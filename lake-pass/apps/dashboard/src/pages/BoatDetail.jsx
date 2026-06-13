import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function BoatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boat, setBoat] = useState(null);

  useEffect(() => {
    api.get(`/boats/${id}`).then((r) => setBoat(r.data));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get("name"),
      type: form.get("type"),
      capacity: +form.get("capacity"),
      pricePerDay: +form.get("pricePerDay"),
      description: form.get("description"),
      images: boat.images,
    };
    await api.put(`/boats/${id}`, data);
    navigate("/fleet");
  };

  if (!boat) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Boat</h2>
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
        <input name="name" defaultValue={boat.name} className="w-full border rounded px-3 py-2" />
        <input name="type" defaultValue={boat.type} className="w-full border rounded px-3 py-2" />
        <input name="capacity" type="number" defaultValue={boat.capacity} className="w-full border rounded px-3 py-2" />
        <input name="pricePerDay" type="number" defaultValue={boat.pricePerDay} className="w-full border rounded px-3 py-2" />
        <textarea name="description" defaultValue={boat.description} className="w-full border rounded px-3 py-2" rows={3} />
        <button type="submit" className="bg-lake-600 text-white px-6 py-2 rounded-lg">Save</button>
      </form>
    </div>
  );
}
