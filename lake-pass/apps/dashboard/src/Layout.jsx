import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const links = [
  { to: "/dashboard", label: "Overview" },
  { to: "/fleet", label: "Fleet" },
  { to: "/calendar", label: "Calendar" },
  { to: "/reservations", label: "Reservations" },
  { to: "/customers", label: "Customers" },
  { to: "/payments", label: "Payments" },
  { to: "/users", label: "Users" },
  { to: "/settings", label: "Settings" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-lake-900 text-white flex flex-col">
        <div className="p-4 border-b border-lake-700">
          <h1 className="text-lg font-bold">Lake Pass</h1>
          <p className="text-xs text-lake-100 mt-1">{user?.marinaId?.name || "Marina Dashboard"}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${isActive ? "bg-lake-600" : "hover:bg-lake-700"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-lake-700 text-sm">
          <p className="text-lake-100">{user?.name}</p>
          <p className="text-xs text-lake-200 capitalize">{user?.role}</p>
          <button onClick={handleLogout} className="mt-2 text-xs text-lake-200 hover:text-white">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
