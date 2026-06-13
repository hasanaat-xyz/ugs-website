import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    api.get(`/customers/${id}`).then((r) => setCustomer(r.data));
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{customer.name}</h2>
      <p className="text-slate-500 mb-6">{customer.email} · {customer.phone || "No phone"}</p>
      {customer.insuranceInfo && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-semibold mb-2">Insurance</h3>
          <pre className="text-sm text-slate-600">{JSON.stringify(customer.insuranceInfo, null, 2)}</pre>
        </div>
      )}
      <h3 className="font-semibold mb-3">Rental History</h3>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><th className="text-left p-3">Boat</th><th className="text-left p-3">Dates</th><th className="text-left p-3">Status</th><th className="text-left p-3">Amount</th></tr>
          </thead>
          <tbody>
            {(customer.reservations || []).map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.boatId?.name || "—"}</td>
                <td className="p-3">{new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3">${r.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
