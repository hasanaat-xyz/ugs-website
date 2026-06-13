import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

const STEPS = ["Dates", "Details", "Payment", "Confirmation"];

export default function Book() {
  const { boatId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [boat, setBoat] = useState(null);
  const [dates, setDates] = useState({
    startDate: searchParams.get("start") || "",
    endDate: searchParams.get("end") || "",
  });
  const [customer, setCustomer] = useState({ customerName: "", customerEmail: "", customerPhone: "" });
  const [total, setTotal] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api.get(`/public/boats/${boatId}`).then((r) => setBoat(r.data)); }, [boatId]);

  const checkDates = async () => {
    const { data } = await api.get(`/public/boats/${boatId}/check-availability`, { params: dates });
    if (!data.available) { setError(data.conflicts?.join(", ") || "Not available"); return; }
    setTotal(data.totalAmount);
    setError("");
    setStep(1);
  };

  const submitDetails = () => {
    if (!customer.customerName || !customer.customerEmail) { setError("Name and email required"); return; }
    setError("");
    setStep(2);
  };

  const submitPayment = async () => {
    try {
      const { data } = await api.post("/public/reservations", {
        boatId,
        startDate: dates.startDate,
        endDate: dates.endDate,
        ...customer,
      });
      setReservation(data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (!boat) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Book {boat.name}</h1>
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 text-center text-xs py-2 rounded ${i <= step ? "bg-lake-600 text-white" : "bg-slate-200"}`}>{s}</div>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {step === 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <input type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button onClick={checkDates} className="w-full bg-lake-600 text-white py-2 rounded-lg">Continue</button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <p className="text-sm text-slate-500">Total: ${total}</p>
          <input placeholder="Full name" value={customer.customerName} onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="email" placeholder="Email" value={customer.customerEmail} onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input placeholder="Phone" value={customer.customerPhone} onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button onClick={submitDetails} className="w-full bg-lake-600 text-white py-2 rounded-lg">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4 text-center">
          <p>Deposit payment (Stripe test mode)</p>
          <p className="text-2xl font-bold">${total ? (total * 0.2).toFixed(2) : "—"}</p>
          <p className="text-xs text-slate-400">In production, Stripe Elements would render here. Mock payment succeeds automatically.</p>
          <button onClick={submitPayment} className="w-full bg-lake-600 text-white py-2 rounded-lg">Pay Deposit</button>
        </div>
      )}

      {step === 3 && reservation && (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-green-700">Booking Confirmed!</h2>
          <p className="text-slate-500 mt-2">Reservation ID: {reservation._id}</p>
          <p className="text-sm mt-4">{dates.startDate} to {dates.endDate}</p>
          <button onClick={() => navigate(`/bookings/${reservation._id}`)} className="mt-4 text-lake-600 underline text-sm">
            View confirmation
          </button>
        </div>
      )}
    </div>
  );
}
