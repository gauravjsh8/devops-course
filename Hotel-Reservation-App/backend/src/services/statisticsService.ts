import Reservation from "../models/reservation";
import Room from "../models/room";

export async function getHotelStatistics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const activeRoomIds = await Room.find({ isActive: true }).distinct("_id");

  // Occupancy is active rooms with a confirmed reservation covering today,
  // divided by all active rooms. Revenue is the sum of confirmed reservation totals.
  const [
    totalReservations,
    cancelledReservations,
    availableRooms,
    activeRooms,
    occupiedRoomIds,
    revenueResult,
  ] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.countDocuments({ status: "cancelled" }),
    Room.countDocuments({ isActive: true, status: "available" }),
    Room.countDocuments({ isActive: true }),
    Reservation.distinct("room", {
      status: "confirmed",
      checkIn: { $lt: tomorrow },
      checkOut: { $gt: today },
      room: { $in: activeRoomIds },
    }),
    Reservation.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  return {
    totalReservations,
    cancelledReservations,
    availableRooms,
    occupancyRate:
      activeRooms === 0 ? 0 : (occupiedRoomIds.length / activeRooms) * 100,
    revenue: revenueResult[0]?.total ?? 0,
  };
}
