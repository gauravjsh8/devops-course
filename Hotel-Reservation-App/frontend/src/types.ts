export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "receptionist" | "administrator";
}
export interface Room {
  _id: string;
  roomNumber: string;
  roomType: string;
  beds: number;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  facilities: string[];
  photos: string[];
  nights?: number;
  totalPrice?: number;
  status?: "available" | "occupied" | "maintenance";
}
export interface Reservation {
  _id: string;
  reservationNumber: string;
  room: Room;
  customer?: { _id: string; name: string; email: string };
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}
