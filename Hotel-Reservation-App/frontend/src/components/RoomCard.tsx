import type { Room } from "../types";

interface Props {
  room: Room;
  onBook?: () => void;
}

function RoomCard({ room, onBook }: Props) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow">
      {room.photos.length > 0 && (
        <img
          src={room.photos[0]}
          alt={`Room ${room.roomNumber}`}
          className="mb-4 h-40 w-full rounded-lg object-cover"
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Room {room.roomNumber}
          </h2>
          <p className="capitalize text-slate-500">{room.roomType}</p>
        </div>
        <p className="text-lg font-bold text-blue-700">
          {room.pricePerNight} €
          <span className="text-sm font-normal text-slate-500"> / night</span>
        </p>
      </div>

      <p className="mt-3 text-slate-600">{room.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        {room.beds} bed(s) · up to {room.maxGuests} guests
      </p>

      {room.facilities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {room.facilities.map((facility) => (
            <span
              key={facility}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {facility}
            </span>
          ))}
        </div>
      )}

      {room.totalPrice !== undefined && (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-slate-700">
          Total for {room.nights} night(s):{" "}
          <span className="font-bold text-blue-700">{room.totalPrice} €</span>
        </p>
      )}

      {onBook && (
        <button
          onClick={onBook}
          className="mt-4 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Book this room
        </button>
      )}
    </div>
  );
}

export default RoomCard;
