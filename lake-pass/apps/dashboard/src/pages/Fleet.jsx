import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Fleet() {
  const [boats, setBoats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Pontoon", capacity: 6, pricePerDay: 299, description: "", images: [] });

  const load = () => api.get("/boats").then((r) => setBoats(r.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/boats", form);
    setShowForm(false);
    setForm({ name: "", type: "Pontoon", capacity: 6, pricePerDay: 299, description: "", images: [] });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this boat?")) return;
    await api.delete(`/boats/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Fleet Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-lake-600 text-white px-4 py-2 rounded-lg text-sm">
          {showForm ? "Cancel" : "Add Boat"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2" required />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border rounded px-3 py-2" required />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
            className="border rounded px-3 py-2" required />
          <input type="number" placeholder="Price/day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: +e.target.value })}
            className="border rounded px-3 py-2" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded px-3 py-2 col-span-2" rows={2} />
          <button type="submit" className="col-span-2 bg-lake-600 text-white py-2 rounded-lg">Save Boat</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boats.map((b) => (
          <div key={b._id} className="bg-white rounded-xl shadow overflow-hidden">
            {b.images?.[0] && <img src={b.images[0]} alt={b.name} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <h3 className="font-bold text-lg">{b.name}</h3>
              <p className="text-sm text-slate-500">{b.type} · {b.capacity} guests</p>
              <p className="text-lake-600 font-semibold mt-1">${b.pricePerDay}/day</p>
              <div className="flex gap-2 mt-3">
                <Link to={`/fleet/${b._id}`} className="text-sm text-lake-600 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(b._id)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
