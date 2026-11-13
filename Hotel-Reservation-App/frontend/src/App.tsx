import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import { api, authHeader } from "./api";
import type { User } from "./types";

import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllReservationsPage from "./pages/AllReservationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyReservationPage from "./pages/MyReservationPage";

function loadUser(): User | null {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

function App() {
  const [user, setUser] = useState<User | null>(loadUser);
  const navigate = useNavigate();

  async function logout() {
    try {
      await api.post("/auth/logout", {}, authHeader());
    } catch {
      console.log("Logout request failed, logging out locally");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  const isCustomer = user?.role === "customer";
  const isStaff =
    user?.role === "receptionist" || user?.role === "administrator";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} onLogout={logout} />

      <main className="mx-auto max-w-5xl p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-reservations"
            element={
              isCustomer ? <MyReservationPage /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/reservations"
            element={
              isStaff ? <AllReservationsPage /> : <Navigate to="/login" />
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
