import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function NewReservation() {
  const [boats, setBoats] = useState([]);
  const [form, setForm] = useState({
    boatId: "", startDate: "", endDate: "",
    customerName: "", customerEmail: "", customerPhone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { api.get("/boats").then((r) => setBoats(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/reservations", form);
      navigate("/reservations");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.conflicts?.join(", ") || "Failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create Reservation</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
        <select value={form.boatId} onChange={(e) => setForm({ ...form, boatId: e.target.value })}
          className="w-full border rounded px-3 py-2" required>
          <option value="">Select boat</option>
          {boats.map((b) => <option key={b._id} value={b._id}>{b.name} (${b.pricePerDay}/day)</option>)}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border rounded px-3 py-2" required />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border rounded px-3 py-2" required />
        </div>
        <input placeholder="Customer name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full border rounded px-3 py-2" required />
        <input type="email" placeholder="Customer email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          className="w-full border rounded px-3 py-2" required />
        <input placeholder="Phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="w-full border rounded px-3 py-2" />
        <button type="submit" className="bg-lake-600 text-white px-6 py-2 rounded-lg">Create</button>
      </form>
    </div>
  );
}
