import Stripe from "stripe";
import Payment from "../models/payment-model.js";
import Reservation from "../models/reservation-model.js";
import Marina from "../models/marina-model.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createConnectAccount(marina) {
  if (marina.stripeAccountId) return marina.stripeAccountId;

  if (!stripe) {
    marina.stripeAccountId = `acct_mock_${marina.slug}`;
    await marina.save();
    return marina.stripeAccountId;
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email: `owner@${marina.slug}.lakepass.dev`,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: { marinaId: marina._id.toString() },
  });

  marina.stripeAccountId = account.id;
  await marina.save();
  return account.id;
}

export async function createOnboardingLink(marina) {
  const accountId = await createConnectAccount(marina);

  if (!stripe) {
    return `http://localhost:5173/settings?stripe=mock_onboarded&account=${accountId}`;
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "http://localhost:5173/settings?stripe=refresh",
    return_url: "http://localhost:5173/settings?stripe=success",
    type: "account_onboarding",
  });
  return link.url;
}

export async function createPaymentIntent(reservation, amount, paymentType, marina) {
  const payment = await Payment.create({
    reservationId: reservation._id,
    type: paymentType,
    amount,
    status: "pending",
  });

  if (!stripe) {
    payment.stripePaymentIntentId = `pi_mock_${payment._id}`;
    payment.status = "succeeded";
    if (paymentType === "full") reservation.status = "confirmed";
    await payment.save();
    await reservation.save();
    return { payment, clientSecret: `mock_secret_${payment._id}` };
  }

  const intentParams = {
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: {
      reservationId: reservation._id.toString(),
      paymentId: payment._id.toString(),
      type: paymentType,
    },
  };

  if (marina.stripeAccountId) {
    intentParams.transfer_data = { destination: marina.stripeAccountId };
    intentParams.application_fee_amount = Math.round(amount * 100 * 0.05);
  }

  const intent = await stripe.paymentIntents.create(intentParams);
  payment.stripePaymentIntentId = intent.id;
  await payment.save();
  return { payment, clientSecret: intent.client_secret };
}

export async function handleStripeWebhook(payload, sig) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("[Stripe] Webhook received (dev mode)");
    return { status: "ignored" };
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const payment = await Payment.findOne({ stripePaymentIntentId: intent.id });
    if (payment) {
      payment.status = "succeeded";
      await payment.save();
      const reservation = await Reservation.findById(payment.reservationId);
      if (reservation && payment.type === "full") {
        reservation.status = "confirmed";
        await reservation.save();
      }
    }
  }

  return { status: "ok" };
}

export function sendConfirmationEmail(reservation) {
  console.log(
    `[MOCK EMAIL] Reservation ${reservation._id} confirmed for boat ${reservation.boatId}`
  );
}
