import { useEffect, useState } from "react";
import { api, authHeader, getErrorMessage } from "../api";
import type { Room } from "../types";

const emptyForm = {
  roomNumber: "",
  roomType: "single",
  beds: 1,
  maxGuests: 1,
  pricePerNight: 100,
  description: "",
  facilities: "",
  photo: "",
  status: "available",
};

type RoomForm = typeof emptyForm;

const inputStyle =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get("/rooms")
      .then((response) => setRooms(response.data.rooms))
      .catch((error) => setError(getErrorMessage(error)));
  }, [reloadKey]);

  function updateField(name: keyof RoomForm, value: string | number) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Upload the chosen photo, then put its address in the form
  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    // A file is sent as "form data", not JSON
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.post("/uploads", formData, authHeader());
      updateField("photo", response.data.url);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    // Turn the form into the data the backend expects
    const roomData = {
      roomNumber: form.roomNumber,
      roomType: form.roomType,
      beds: form.beds,
      maxGuests: form.maxGuests,
      pricePerNight: form.pricePerNight,
      description: form.description,
      status: form.status,
      facilities: form.facilities
        .split(",")
        .map((facility) => facility.trim())
        .filter((facility) => facility !== ""),
      photos: form.photo.trim() ? [form.photo.trim()] : [],
    };

    try {
      if (editingId) {
        await api.put(`/rooms/${editingId}`, roomData, authHeader());
        setMessage(`Room ${form.roomNumber} updated.`);
      } else {
        await api.post("/rooms", roomData, authHeader());
        setMessage(`Room ${form.roomNumber} added.`);
      }
      setForm(emptyForm);
      setEditingId(null);
      setReloadKey(reloadKey + 1);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  // Fill the form with a room's data, to edit it
  function startEdit(room: Room) {
    setEditingId(room._id);
    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      beds: room.beds,
      maxGuests: room.maxGuests,
      pricePerNight: room.pricePerNight,
      description: room.description,
      facilities: room.facilities.join(", "),
      photo: room.photos[0] ?? "",
      status: room.status ?? "available",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function archiveRoom(room: Room) {
    const confirmed = window.confirm(
      `Archive room ${room.roomNumber}? Customers will no longer see it.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/rooms/${room._id}`, authHeader());
      setMessage(`Room ${room.roomNumber} archived.`);
      setReloadKey(reloadKey + 1);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Manage rooms</h1>
        <p className="mt-1 text-slate-500">
          Add rooms, change prices and set availability.
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

      {/* Add / edit form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white p-6 shadow"
      >
        <h2 className="text-xl font-semibold text-slate-800">
          {editingId ? `Edit room ${form.roomNumber}` : "Add a new room"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Room number
            </label>
            <input
              value={form.roomNumber}
              onChange={(e) => updateField("roomNumber", e.target.value)}
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Room type
            </label>
            <select
              value={form.roomType}
              onChange={(e) => updateField("roomType", e.target.value)}
              className={inputStyle}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="twin">Twin</option>
              <option value="suite">Suite</option>
              <option value="family">Family</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Price per night (€)
            </label>
            <input
              type="number"
              min={0}
              value={form.pricePerNight}
              onChange={(e) =>
                updateField("pricePerNight", Number(e.target.value))
              }
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Beds
            </label>
            <input
              type="number"
              min={1}
              value={form.beds}
              onChange={(e) => updateField("beds", Number(e.target.value))}
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Max guests
            </label>
            <input
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={(e) => updateField("maxGuests", Number(e.target.value))}
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className={inputStyle}
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            rows={2}
            className={inputStyle}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Facilities
            </label>
            <input
              value={form.facilities}
              onChange={(e) => updateField("facilities", e.target.value)}
              placeholder="WiFi, TV, Balcony"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Photo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => void handlePhotoUpload(e)}
              className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && (
              <p className="mt-1 text-sm text-slate-500">Uploading...</p>
            )}
            {form.photo && (
              <img
                src={form.photo}
                alt="Room preview"
                className="mt-2 h-24 rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
          >
            {editingId ? "Save changes" : "Add room"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  {room.photos[0] ? (
                    <img
                      src={room.photos[0]}
                      alt={`Room ${room.roomNumber}`}
                      className="h-12 w-16 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                      No photo
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">{room.roomNumber}</td>
                <td className="px-4 py-3 capitalize">{room.roomType}</td>
                <td className="px-4 py-3">{room.pricePerNight} €</td>
                <td className="px-4 py-3">{room.maxGuests}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      room.status === "maintenance"
                        ? "rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700"
                        : "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                    }
                  >
                    {room.status ?? "available"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    onClick={() => startEdit(room)}
                    className="mr-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void archiveRoom(room)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No rooms yet. Add the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRoomsPage;
