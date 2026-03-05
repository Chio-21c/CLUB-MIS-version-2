import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("✅ Admin registered successfully!");
        setForm({ name: "", email: "", password: "" });
      } else {
        setError(data.message || "❌ Registration failed");
      }
    } catch {
      setError("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">
          Register Admin
        </h2>

        {/* Error / Success Messages */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm text-center mb-4 font-medium">
            {success}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-gray-200 border border-slate-600 
              focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-gray-200 border border-slate-600 
              focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-gray-200 border border-slate-600 
              focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-white bg-cyan-500 
              hover:bg-cyan-600 shadow-md hover:shadow-cyan-400/50 transition-all"
          >
            Register Admin
          </button>
        </form>
      </div>
    </div>
  );
}
