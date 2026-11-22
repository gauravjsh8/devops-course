import { useEffect } from "react";
import type { Room } from "../../types";

interface Props {
  room: Room;
  onClose: () => void;
}

export default function RoomDetails({ room, onClose }: Props) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-details-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close room details"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl text-slate-700 shadow hover:bg-slate-100"
        >
          ×
        </button>
        {room.photos[0] && <img src={room.photos[0]} alt={`Room ${room.roomNumber}`} className="h-72 w-full object-cover" />}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 pr-10">
            <div><h2 id="room-details-title" className="text-3xl font-bold">Room {room.roomNumber}</h2><p className="capitalize text-slate-500">{room.roomType}</p></div>
            <p className="text-2xl font-bold text-blue-700">{room.pricePerNight} € <span className="text-sm font-normal text-slate-500">/ night</span></p>
          </div>
          <p className="mt-4 text-slate-600">{room.description}</p>
          <p className="mt-3 text-sm text-slate-600">{room.beds} bed(s) · up to {room.maxGuests} guests · Status: {room.status ?? "available"}</p>
          {room.facilities.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{room.facilities.map((facility) => <span key={facility} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{facility}</span>)}</div>}
        </div>
      </article>
    </div>
  );
}
