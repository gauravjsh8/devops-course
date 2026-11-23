import { useEffect, useState } from "react";
import { api, authHeader, getErrorMessage } from "../api";
import RoomCard from "../components/RoomCard";
import type { Room, User } from "../types";
import BookingReview from "../features/reservations/BookingReview";
import ReservationConfirmation from "../features/reservations/ReservationConfirmation";
import RoomDetails from "../features/rooms/RoomDetails";

interface Props {
  user: User | null;
}

const today = new Date().toISOString().slice(0, 10);

function RoomsPage({ user }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [reviewRoom, setReviewRoom] = useState<Room | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reservationNumber: string;
    status: string;
    email: string;
    emailSent: boolean;
  } | null>(null);
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);

  useEffect(() => {
    api
      .get("/rooms")
      .then((response) => setRooms(response.data.rooms))
      .catch((error) => setError(getErrorMessage(error)));
  }, []);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.get("/rooms/available", {
        params: { checkIn, checkOut, guests },
      });
      setRooms(response.data.rooms);
      setSearched(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  async function handleBook(room: Room) {
    setReviewRoom(room);
  }

  async function submitBooking(guestName: string, guestEmail: string) {
    if (!reviewRoom) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await api.post(
        "/reservations",
        {
          roomId: reviewRoom._id,
          checkIn,
          checkOut,
          guestCount: guests,
          guestName: user ? undefined : guestName,
          guestEmail: user ? undefined : guestEmail,
        },
        authHeader(),
      );
      setReviewRoom(null);
      setConfirmation({
        reservationNumber: response.data.reservation.reservationNumber,
        status: response.data.reservation.status,
        email: user?.email ?? guestEmail,
        emailSent: Boolean(response.data.emailSent),
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }
  const canBook =
    searched && (!user || user.role === "customer");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Find a room</h1>
        <p className="mt-1 text-slate-500">
          Choose your dates to see free rooms and prices.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid gap-4 rounded-2xl bg-white p-6 shadow sm:grid-cols-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Guests
          </label>
          <input
            type="number"
            value={guests}
            min={1}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {searched ? `${rooms.length} free room(s) found` : "All rooms"}
        </h2>

        {rooms.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow">
            {searched ? "No free rooms for these dates." : "No rooms yet."}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onViewDetails={() => setDetailsRoom(room)}
                onBook={canBook ? () => void handleBook(room) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {reviewRoom && (
        <BookingReview
          room={reviewRoom}
          user={user}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          submitting={submitting}
          error={error}
          onSubmit={(guestName, guestEmail) =>
            void submitBooking(guestName, guestEmail)
          }
          onClose={() => {
            setReviewRoom(null);
            setError("");
          }}
        />
      )}
      {confirmation && (
        <ReservationConfirmation
          {...confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}
      {detailsRoom && (
        <RoomDetails
          room={detailsRoom}
          onClose={() => setDetailsRoom(null)}
        />
      )}
    </div>
  );
}

export default RoomsPage;
