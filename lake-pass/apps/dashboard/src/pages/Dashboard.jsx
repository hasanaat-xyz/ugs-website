import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Boats", value: stats.totalBoats },
    { label: "Active Reservations", value: stats.activeReservations },
    { label: "Customers", value: stats.totalCustomers },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-3xl font-bold text-lake-700 mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
