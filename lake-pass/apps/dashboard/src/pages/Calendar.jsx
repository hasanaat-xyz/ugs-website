import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../api";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [boats, setBoats] = useState([]);
  const [form, setForm] = useState({ boatId: "", type: "maintenance", startDate: "", endDate: "", notes: "" });

  const load = () => {
    api.get("/calendar/events").then((r) =>
      setEvents(r.data.map((e) => ({
        id: e.id || e._id,
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: e.backgroundColor,
      })))
    );
    api.get("/boats").then((r) => setBoats(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!form.boatId) return;
    await api.post(`/boats/${form.boatId}/availability`, form);
    setForm({ boatId: "", type: "maintenance", startDate: "", endDate: "", notes: "" });
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Calendar</h2>
      <form onSubmit={handleAddBlock} className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
        <select value={form.boatId} onChange={(e) => setForm({ ...form, boatId: e.target.value })}
          className="border rounded px-3 py-2" required>
          <option value="">Select boat</option>
          {boats.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded px-3 py-2">
          <option value="maintenance">Maintenance</option>
          <option value="blocked">Blocked</option>
          <option value="available">Available</option>
          <option value="buffer">Buffer</option>
        </select>
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="border rounded px-3 py-2" required />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="border rounded px-3 py-2" required />
        <button type="submit" className="bg-lake-600 text-white px-4 py-2 rounded-lg text-sm">Add Block</button>
      </form>
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} height="auto" />
      </div>
    </div>
  );
}
