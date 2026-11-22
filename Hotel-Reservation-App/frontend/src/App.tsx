import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import { api, authHeader } from "./api";
import type { User } from "./types";

import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyReservationPage from "./pages/MyReservationPage";
import AllReservationsPage from "./pages/AllReservationsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import NotFoundPage from "./pages/NotFoundPage";
import StatisticsPage from "./pages/StatisticsPage";

// Read the saved user, so we stay logged in after a page refresh
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
  const isAdmin = user?.role === "administrator";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} onLogout={logout} />

      <main className="mx-auto max-w-5xl p-6">
        <Routes>
          {/* Everyone */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/rooms" element={<RoomsPage user={user} />} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer only */}
          <Route
            path="/my-reservations"
            element={
              isCustomer ? <MyReservationPage /> : <Navigate to="/login" />
            }
          />

          {/* Receptionist and admin */}
          <Route
            path="/reservations"
            element={
              isStaff ? <AllReservationsPage /> : <Navigate to="/login" />
            }
          />

          {/* Admin only */}
          <Route
            path="/admin/rooms"
            element={isAdmin ? <AdminRoomsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/statistics"
            element={isAdmin ? <StatisticsPage /> : <Navigate to="/login" />}
          />

          {/* Everything else */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
