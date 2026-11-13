import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api, getErrorMessage } from "../api";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Account created! You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo and title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            H
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign up to book rooms online
          </p>
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
