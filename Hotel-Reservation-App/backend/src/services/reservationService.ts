import mongoose from "mongoose";
import Reservation from "../models/reservation";
import Room from "../models/room";
import User from "../models/user";

// Error with an HTTP status code, same idea as AuthServiceError
export class ReservationError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export interface CurrentUser {
  id: string;
  role: string;
}

export interface ReservationInput {
  roomId?: string;
  customerId?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
}

const ONE_DAY = 1000 * 60 * 60 * 24;

// ---------- small helpers ----------

function checkDates(checkIn: Date, checkOut: Date): void {
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new ReservationError("Please give valid dates", 400);
  }
  if (checkOut <= checkIn) {
    throw new ReservationError("Check-out must be after check-in", 400);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    throw new ReservationError("Check-in cannot be in the past", 400);
  }
}

function countNights(checkIn: Date, checkOut: Date): number {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / ONE_DAY);
}

// Two stays overlap if: old.checkIn < new.checkOut AND old.checkOut > new.checkIn
async function isRoomBooked(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  ignoreReservationId?: string,
): Promise<boolean> {
  const overlapping = await Reservation.find({
    room: roomId,
    status: "confirmed",
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
  // When updating, ignore the reservation we are changing
  return overlapping.some((r) => r.id !== ignoreReservationId);
}

// Finds a reservation. Customers only get their own.
async function findReservationForUser(id: string, user: CurrentUser) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ReservationError("Invalid reservation ID", 400);
  }

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new ReservationError("Reservation not found", 404);
  }

  const isOwner = reservation.customer.toString() === user.id;
  if (user.role === "customer" && !isOwner) {
    throw new ReservationError("Reservation not found", 404);
  }

  return reservation;
}

// ---------- search ----------

export async function searchAvailableRooms(
  checkInText: string,
  checkOutText: string,
  guests: number,
) {
  if (!Number.isInteger(guests) || guests < 1) {
    throw new ReservationError("Guests must be a positive whole number", 400);
  }

  const checkIn = new Date(checkInText);
  const checkOut = new Date(checkOutText);
  checkDates(checkIn, checkOut);

  // 1. Rooms already booked for these dates
  const bookings = await Reservation.find({
    status: "confirmed",
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
  const bookedRoomIds = bookings.map((b) => b.room.toString());

  // 2. Rooms that can be used and are big enough
  const rooms = await Room.find({
    isActive: true,
    status: "available",
    maxGuests: { $gte: guests },
  }).sort({ pricePerNight: 1 });

  // 3. Keep the free rooms and add the total price
  const nights = countNights(checkIn, checkOut);
  return rooms
    .filter((room) => !bookedRoomIds.includes(room.id))
    .map((room) => ({
      ...room.toObject(),
      nights,
      totalPrice: nights * room.pricePerNight,
    }));
}

// ---------- customer ----------

export async function createReservation(
  user: CurrentUser,
  data: ReservationInput,
) {
  if (
    !data.roomId ||
    !data.checkIn ||
    !data.checkOut ||
    data.guestCount === undefined
  ) {
    throw new ReservationError(
      "roomId, checkIn, checkOut and guestCount are required",
      400,
    );
  }

  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const guestCount = Number(data.guestCount);
  checkDates(checkIn, checkOut);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new ReservationError("Guests must be a positive whole number", 400);
  }

  if (!mongoose.isValidObjectId(data.roomId)) {
    throw new ReservationError("Invalid room ID", 400);
  }

  let customerId = user.id;
  if (user.role === "receptionist") {
    if (!data.customerId || !mongoose.isValidObjectId(data.customerId)) {
      throw new ReservationError("A valid customerId is required", 400);
    }
    const customer = await User.findOne({
      _id: data.customerId,
      role: "customer",
    });
    if (!customer) {
      throw new ReservationError("Customer not found", 404);
    }
    customerId = customer.id;
  }

  return mongoose.connection.transaction(async (session) => {
    const room = await Room.findById(data.roomId).session(session);
    if (!room || !room.isActive || room.status !== "available") {
      throw new ReservationError("Room is not available", 404);
    }
    if (guestCount > room.maxGuests) {
      throw new ReservationError(
        `This room allows at most ${room.maxGuests} guests`,
        400,
      );
    }

    // Temporarily change the room document so concurrent bookings conflict.
    const guard = await Room.updateOne(
      { _id: room._id, isActive: true, status: "available" },
      { $set: { status: "occupied" } },
      { session },
    );
    if (guard.modifiedCount !== 1) {
      throw new ReservationError("Room is not available", 409);
    }

    const overlapping = await Reservation.findOne({
      room: room._id,
      status: "confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    }).session(session);
    if (overlapping) {
      throw new ReservationError(
        "Room is already booked for these dates",
        409,
      );
    }

    const [reservation] = await Reservation.create(
      [
        {
          customer: customerId,
          room: room.id,
          checkIn,
          checkOut,
          guestCount,
          totalPrice: countNights(checkIn, checkOut) * room.pricePerNight,
        },
      ],
      { session },
    );
    await Room.updateOne(
      { _id: room._id, status: "occupied" },
      { $set: { status: "available" } },
      { session },
    );
    return reservation;
  });
}

export async function getMyReservations(user: CurrentUser) {
  return Reservation.find({ customer: user.id })
    .populate("room")
    .sort({ checkIn: -1 });
}

// ---------- receptionist / admin ----------

export async function getAllReservations() {
  return Reservation.find()
    .populate("room")
    .populate("customer", "name email")
    .sort({ checkIn: 1 });
}

export async function getReservations(user: CurrentUser) {
  return user.role === "customer"
    ? getMyReservations(user)
    : getAllReservations();
}

// ---------- shared (owner or staff) ----------

export async function getReservationById(id: string, user: CurrentUser) {
  const reservation = await findReservationForUser(id, user);
  return reservation.populate([
    { path: "room" },
    { path: "customer", select: "name email" },
  ]);
}

export async function updateReservation(
  id: string,
  user: CurrentUser,
  data: ReservationInput,
) {
  const reservation = await findReservationForUser(id, user);
  if (reservation.status === "cancelled") {
    throw new ReservationError("Cancelled reservations cannot be changed", 400);
  }

  // Use new values if given, otherwise keep the old ones
  const checkIn =
    data.checkIn === undefined ? reservation.checkIn : new Date(data.checkIn);
  const checkOut =
    data.checkOut === undefined
      ? reservation.checkOut
      : new Date(data.checkOut);
  const guestCount =
    data.guestCount === undefined
      ? reservation.guestCount
      : Number(data.guestCount);
  checkDates(checkIn, checkOut);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new ReservationError("Guests must be a positive whole number", 400);
  }

  const room = await Room.findById(reservation.room);
  if (!room) {
    throw new ReservationError("Room not found", 404);
  }
  if (!room.isActive || room.status !== "available") {
    throw new ReservationError("Room is not available", 409);
  }
  if (guestCount > room.maxGuests) {
    throw new ReservationError(
      `This room allows at most ${room.maxGuests} guests`,
      400,
    );
  }
  if (await isRoomBooked(room.id, checkIn, checkOut, reservation.id)) {
    throw new ReservationError("Room is already booked for these dates", 409);
  }

  reservation.checkIn = checkIn;
  reservation.checkOut = checkOut;
  reservation.guestCount = guestCount;
  reservation.totalPrice = countNights(checkIn, checkOut) * room.pricePerNight;
  return reservation.save();
}

export async function cancelReservation(id: string, user: CurrentUser) {
  const reservation = await findReservationForUser(id, user);
  if (reservation.status === "cancelled") {
    throw new ReservationError("Reservation is already cancelled", 400);
  }

  reservation.status = "cancelled";
  return reservation.save();
}
