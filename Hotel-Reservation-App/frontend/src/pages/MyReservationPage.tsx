import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api, authHeader, getErrorMessage } from "../api";

import type { Reservation } from "../types";
import ReservationCard, {
  type ReservationChanges,
} from "../components/ReservationCard";

function MyReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/reservations/my", authHeader())
      .then((response) => setReservations(response.data.reservations))
      .catch((error) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  async function saveChanges(
    reservation: Reservation,
    changes: ReservationChanges,
  ) {
    setError("");
    setMessage("");
    try {
      await api.put(`/reservations/${reservation._id}`, changes, authHeader());
      setMessage("Your booking was updated.");
      setReloadKey(reloadKey + 1);
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    }
  }

  async function cancelBooking(reservation: Reservation) {
    const confirmed = window.confirm(
      `Cancel your booking for room ${reservation.room?.roomNumber}?`,
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    try {
      await api.patch(
        `/reservations/${reservation._id}/cancel`,
        {},
        authHeader(),
      );
      setMessage("Your booking was cancelled.");
      setReloadKey(reloadKey + 1);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My reservations</h1>
        <p className="mt-1 text-slate-500">
          See, change or cancel your bookings.
        </p>
      </div>

      {message && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="text-slate-500">Loading...</p>}

      {!loading && reservations.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-slate-600">You have no bookings yet.</p>
          <Link
            to="/rooms"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Find a room
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            onSave={(changes) => saveChanges(reservation, changes)}
            onCancel={() => cancelBooking(reservation)}
          />
        ))}
      </div>
    </div>
  );
}

export default MyReservationPage;
