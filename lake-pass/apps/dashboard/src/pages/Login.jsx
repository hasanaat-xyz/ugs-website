import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("owner@marina-a.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lake-50 to-lake-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-lake-900 mb-1">Lake Pass</h1>
        <p className="text-slate-500 mb-6">Marina Dashboard</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4" required />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-6" required />
        <button type="submit" className="w-full bg-lake-600 text-white py-2 rounded-lg hover:bg-lake-700">
          Sign In
        </button>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Demo: owner@marina-a.com / password123
        </p>
      </form>
    </div>
  );
}
