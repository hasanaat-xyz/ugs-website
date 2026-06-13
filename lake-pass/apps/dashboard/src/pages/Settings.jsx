import { useAuth } from "../AuthContext";
import api from "../api";

export default function Settings() {
  const { user } = useAuth();

  const handleStripeOnboard = async () => {
    try {
      const { data } = await api.get("/payments/stripe/onboard");
      window.open(data.url, "_blank");
    } catch {
      alert("Stripe onboarding requires owner role");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
        <div>
          <h3 className="font-semibold">Marina</h3>
          <p className="text-slate-500 text-sm">{user?.marinaId?.name || "Your marina"}</p>
        </div>
        {user?.role === "owner" && (
          <div>
            <h3 className="font-semibold mb-2">Stripe Connect</h3>
            <p className="text-sm text-slate-500 mb-3">Connect your Stripe account to receive payments (test mode).</p>
            <button onClick={handleStripeOnboard} className="bg-lake-600 text-white px-4 py-2 rounded-lg text-sm">
              Connect Stripe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
