import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function BoatDetail() {
  const { id } = useParams();
  const [boat, setBoat] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [avail, setAvail] = useState(null);

  useEffect(() => { api.get(`/public/boats/${id}`).then((r) => setBoat(r.data)); }, [id]);

  const checkAvail = async () => {
    if (!dates.startDate || !dates.endDate) return;
    const { data } = await api.get(`/public/boats/${id}/check-availability`, { params: dates });
    setAvail(data);
  };

  if (!boat) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        {boat.images?.[0] && <img src={boat.images[0]} alt={boat.name} className="w-full rounded-2xl shadow" />}
      </div>
      <div>
        <p className="text-lake-600 text-sm">{boat.marina?.name}</p>
        <h1 className="text-3xl font-bold mt-1">{boat.name}</h1>
        <p className="text-slate-500 mt-2">{boat.type} · Up to {boat.capacity} guests</p>
        <p className="text-2xl font-bold text-lake-600 mt-4">${boat.pricePerDay}/day</p>
        <p className="text-slate-600 mt-4">{boat.description}</p>

        <div className="mt-6 bg-white rounded-xl shadow p-4 space-y-3">
          <h3 className="font-semibold">Check Availability</h3>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
              className="border rounded px-3 py-2" />
            <input type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
              className="border rounded px-3 py-2" />
          </div>
          <button onClick={checkAvail} className="w-full bg-slate-200 py-2 rounded-lg text-sm">Check</button>
          {avail && (
            <div className={`text-sm p-3 rounded ${avail.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {avail.available ? `Available! Total: $${avail.totalAmount}` : `Not available: ${avail.conflicts?.join(", ")}`}
            </div>
          )}
          {avail?.available && (
            <Link to={`/book/${id}?start=${dates.startDate}&end=${dates.endDate}`}
              className="block text-center bg-lake-600 text-white py-2 rounded-lg">
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
