import { useEffect, useState } from "react";
import api from "../api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [reservationId, setReservationId] = useState("");
  const [damageAmount, setDamageAmount] = useState("");

  useEffect(() => { api.get("/payments").then((r) => setPayments(r.data)); }, []);

  const handleDeposit = async () => {
    if (!reservationId) return;
    const { data } = await api.post("/payments/deposit", { reservationId });
    alert(`Deposit initiated. Client secret: ${data.clientSecret}`);
  };

  const handleDamage = async () => {
    if (!reservationId || !damageAmount) return;
    const { data } = await api.post("/payments/damage", { reservationId, amount: +damageAmount });
    alert(`Damage fee initiated. Client secret: ${data.clientSecret}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payments</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 items-end">
        <input placeholder="Reservation ID" value={reservationId} onChange={(e) => setReservationId(e.target.value)}
          className="border rounded px-3 py-2 flex-1" />
        <button onClick={handleDeposit} className="bg-lake-600 text-white px-4 py-2 rounded-lg text-sm">Collect Deposit</button>
        <input type="number" placeholder="Damage amount" value={damageAmount} onChange={(e) => setDamageAmount(e.target.value)}
          className="border rounded px-3 py-2 w-32" />
        <button onClick={handleDamage} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Damage Fee</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><th className="text-left p-3">Type</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 capitalize">{p.type}</td>
                <td className="p-3">${p.amount}</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
