import { useState } from "react";
import type { Room, User } from "../../types";

interface Props {
  room: Room;
  user: User | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  submitting: boolean;
  error: string;
  onSubmit: (guestName: string, guestEmail: string) => void;
  onClose: () => void;
}

export default function BookingReview({
  room,
  user,
  checkIn,
  checkOut,
  guests,
  submitting,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [guestName, setGuestName] = useState(user?.name ?? "");
  const [guestEmail, setGuestEmail] = useState(user?.email ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800">Review your booking</h2>
        <dl className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Room</dt><dd className="font-semibold">{room.roomNumber} - {room.roomType}</dd></div>
          <div><dt className="text-slate-500">Guests</dt><dd className="font-semibold">{guests}</dd></div>
          <div><dt className="text-slate-500">Check-in</dt><dd className="font-semibold">{checkIn}</dd></div>
          <div><dt className="text-slate-500">Check-out</dt><dd className="font-semibold">{checkOut}</dd></div>
          <div className="sm:col-span-2"><dt className="text-slate-500">Total</dt><dd className="text-lg font-bold text-blue-700">{room.totalPrice ?? 0} €</dd></div>
        </dl>

        {!user && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="guest-name" className="mb-1 block text-sm font-medium">Name</label>
              <input id="guest-name" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label htmlFor="guest-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="guest-email" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={submitting} className="rounded-lg border border-slate-300 px-4 py-2">Cancel</button>
          <button type="button" disabled={submitting || (!user && (!guestName.trim() || !guestEmail.trim()))} onClick={() => onSubmit(guestName.trim(), guestEmail.trim())} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:bg-slate-400">
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
