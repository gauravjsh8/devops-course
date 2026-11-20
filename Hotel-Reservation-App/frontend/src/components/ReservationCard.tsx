import { useState } from "react";
import type { Reservation } from "../types";

export interface ReservationChanges {
  checkIn: string;
  checkOut: string;
  guestCount: number;
}

interface Props {
  reservation: Reservation;
  showCustomer?: boolean;
  onSave: (changes: ReservationChanges) => Promise<void>;
  onCancel: () => Promise<void>;
}

const today = new Date().toISOString().slice(0, 10);

function showDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}

const inputStyle =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function ReservationCard({
  reservation,
  showCustomer = false,
  onSave,
  onCancel,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [checkIn, setCheckIn] = useState(reservation.checkIn.slice(0, 10));
  const [checkOut, setCheckOut] = useState(reservation.checkOut.slice(0, 10));
  const [guestCount, setGuestCount] = useState(reservation.guestCount);

  const nights = Math.round(
    (new Date(reservation.checkOut).getTime() -
      new Date(reservation.checkIn).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const isCancelled = reservation.status === "cancelled";
  const canChange = !isCancelled && reservation.checkIn.slice(0, 10) > today;

  async function handleSave() {
    try {
      await onSave({ checkIn, checkOut, guestCount });
      setEditing(false);
    } catch {
      setEditing(true);
    }
  }

  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow ${isCancelled ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Room {reservation.room?.roomNumber ?? "-"}
            <span className="ml-2 text-base font-normal capitalize text-slate-500">
              {reservation.room?.roomType}
            </span>
          </h2>
          <p className="text-sm text-slate-500">
            Reservation no.{" "}
            {reservation.reservationNumber.slice(0, 8).toUpperCase()}
          </p>
          {showCustomer && reservation.customer && (
            <p className="mt-1 text-sm text-slate-600">
              {reservation.customer.name} · {reservation.customer.email}
            </p>
          )}
        </div>
        <span
          className={
            isCancelled
              ? "rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
              : "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
          }
        >
          {reservation.status}
        </span>
      </div>

      {!editing && (
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-slate-500">Check-in</p>
            <p className="font-semibold">{showDate(reservation.checkIn)}</p>
          </div>
          <div>
            <p className="text-slate-500">Check-out</p>
            <p className="font-semibold">{showDate(reservation.checkOut)}</p>
          </div>
          <div>
            <p className="text-slate-500">Guests</p>
            <p className="font-semibold">{reservation.guestCount}</p>
          </div>
          <div>
            <p className="text-slate-500">Total ({nights} night(s))</p>
            <p className="font-semibold text-blue-700">
              {reservation.totalPrice} €
            </p>
          </div>
        </div>
      )}

      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Guests
            </label>
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className={inputStyle}
            />
          </div>
        </div>
      )}

      {canChange && (
        <div className="mt-4 flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                onClick={() => void handleSave()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Change
              </button>
              <button
                onClick={() => void onCancel()}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel booking
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReservationCard;
