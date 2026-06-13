import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    api.get("/reservations", { params }).then((r) => setReservations(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel reservation?")) return;
    await api.delete(`/reservations/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reservations</h2>
        <Link to="/reservations/new" className="bg-lake-600 text-white px-4 py-2 rounded-lg text-sm">New Reservation</Link>
      </div>
      <div className="flex gap-3 mb-4">
        <input placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={load} className="bg-slate-200 px-4 py-2 rounded-lg text-sm">Filter</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Boat</th>
              <th className="text-left p-3">Dates</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Amount</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.customerId?.name || "—"}</td>
                <td className="p-3">{r.boatId?.name || "—"}</td>
                <td className="p-3">{new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}</td>
                <td className="p-3"><span className="capitalize px-2 py-1 bg-slate-100 rounded text-xs">{r.status}</span></td>
                <td className="p-3">${r.totalAmount}</td>
                <td className="p-3">
                  {r.status !== "cancelled" && (
                    <button onClick={() => handleCancel(r._id)} className="text-red-500 text-xs">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
