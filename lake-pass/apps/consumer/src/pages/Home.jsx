import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [marinas, setMarinas] = useState([]);
  const [filters, setFilters] = useState({ marinaSlug: "", boatType: "", startDate: "", endDate: "" });
  const [boats, setBoats] = useState([]);

  useEffect(() => { api.get("/public/marinas").then((r) => setMarinas(r.data)); }, []);

  const search = async () => {
    if (!filters.marinaSlug) return;
    const params = {};
    if (filters.boatType) params.boatType = filters.boatType;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    const { data } = await api.get(`/public/marinas/${filters.marinaSlug}/boats`, { params });
    setBoats(data);
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-lake-600 to-lake-700 text-white py-16 px-6 rounded-2xl mb-8">
        <h1 className="text-4xl font-bold mb-2">Lake Pass</h1>
        <p className="text-lake-100 text-lg">Find and book the perfect boat for your next adventure</p>
      </section>

      <div className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select value={filters.marinaSlug} onChange={(e) => setFilters({ ...filters, marinaSlug: e.target.value })}
          className="border rounded-lg px-3 py-2">
          <option value="">Select marina</option>
          {marinas.map((m) => <option key={m._id} value={m.slug}>{m.name}</option>)}
        </select>
        <input placeholder="Boat type" value={filters.boatType} onChange={(e) => setFilters({ ...filters, boatType: e.target.value })}
          className="border rounded-lg px-3 py-2" />
        <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="border rounded-lg px-3 py-2" />
        <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="border rounded-lg px-3 py-2" />
        <button onClick={search} className="md:col-span-4 bg-lake-600 text-white py-2 rounded-lg">Search Boats</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boats.map((b) => (
          <Link key={b._id} to={`/boats/${b._id}`} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
            {b.images?.[0] && <img src={b.images[0]} alt={b.name} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h3 className="font-bold text-lg">{b.name}</h3>
              <p className="text-slate-500 text-sm">{b.type} · {b.capacity} guests</p>
              <p className="text-lake-600 font-semibold mt-2">${b.pricePerDay}/day</p>
            </div>
          </Link>
        ))}
      </div>
      {boats.length === 0 && filters.marinaSlug && (
        <p className="text-center text-slate-400 mt-8">No boats found. Try different dates or filters.</p>
      )}
    </div>
  );
}
