import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function BookingConfirmation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  useEffect(() => { api.get(`/public/reservations/${id}`).then((r) => setReservation(r.data)); }, [id]);

  if (!reservation) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 text-center">
      <h1 className="text-2xl font-bold text-lake-700 mb-4">Booking Confirmation</h1>
      <p className="text-slate-500">Status: <span className="capitalize font-medium">{reservation.status}</span></p>
      <p className="mt-4">{reservation.boatId?.name}</p>
      <p className="text-sm text-slate-500">
        {new Date(reservation.startDate).toLocaleDateString()} – {new Date(reservation.endDate).toLocaleDateString()}
      </p>
      <p className="text-xl font-bold mt-4">${reservation.totalAmount}</p>
      <Link to="/" className="inline-block mt-6 text-lake-600 underline">Back to search</Link>
    </div>
  );
}
