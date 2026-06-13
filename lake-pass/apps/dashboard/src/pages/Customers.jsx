import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const load = () => api.get("/customers", { params: search ? { search } : {} }).then((r) => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customers</h2>
      <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && load()} className="border rounded px-3 py-2 mb-4" />
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th></th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone || "—"}</td>
                <td className="p-3"><Link to={`/customers/${c._id}`} className="text-lake-600 text-xs">View history</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
