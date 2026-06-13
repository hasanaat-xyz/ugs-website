import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BoatDetail from "./pages/BoatDetail";
import Book from "./pages/Book";
import BookingConfirmation from "./pages/BookingConfirmation";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <a href="/" className="text-xl font-bold text-lake-700">Lake Pass</a>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boats/:id" element={<BoatDetail />} />
            <Route path="/book/:boatId" element={<Book />} />
            <Route path="/bookings/:id" element={<BookingConfirmation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
