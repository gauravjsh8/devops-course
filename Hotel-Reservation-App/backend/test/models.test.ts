import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { after, before, test } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import Reservation from "../src/models/reservation.js";
import Room from "../src/models/room.js";
import User from "../src/models/user.js";

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
});

after(async () => {
  await disconnectDatabase();
  await mongoServer.stop();
});

test("connectDatabase connects to the configured test database", () => {
  assert.equal(mongoose.connection.readyState, 1);
});

test("RoomModel saves and loads a valid room", async () => {
  const room = await Room.create({
    roomNumber: "101",
    roomType: "double",
    beds: 2,
    description: "A comfortable double room",
    maxGuests: 2,
    pricePerNight: 120,
    facilities: ["Wi-Fi", "Air conditioning"],
    photos: ["https://example.com/room.jpg"],
  });

  const loadedRoom = await Room.findById(room._id);

  assert.ok(loadedRoom);
  assert.equal(loadedRoom.roomNumber, "101");
  assert.equal(loadedRoom.maxGuests, 2);
  assert.equal(loadedRoom.isActive, true);
  assert.deepEqual(loadedRoom.facilities, ["Wi-Fi", "Air conditioning"]);
  assert.equal(loadedRoom.createdAt instanceof Date, true);
});

test("UserModel stores a password hash and hides it from default queries", async () => {
  const user = await User.create({
    name: "Taylor Example",
    email: "TAYLOR@example.com",
    passwordHash: "correct horse battery staple",
  });

  const loadedUser = await User.findById(user._id);
  assert.ok(loadedUser);
  assert.equal(loadedUser.email, "taylor@example.com");
  assert.equal(loadedUser.passwordHash, undefined);

  const userWithPassword = await User.findById(user._id).select("+passwordHash");
  assert.ok(userWithPassword);
  assert.notEqual(
    userWithPassword.passwordHash,
    "correct horse battery staple",
  );
  assert.equal(
    await bcrypt.compare(
      "correct horse battery staple",
      userWithPassword.passwordHash,
    ),
    true,
  );
});

test("ReservationModel saves and loads a valid reservation", async () => {
  const user = await User.create({
    name: "Reservation Customer",
    email: "customer@example.com",
    passwordHash: "password123",
  });
  const room = await Room.create({
    roomNumber: "202",
    roomType: "suite",
    beds: 1,
    description: "A suite",
    maxGuests: 3,
    pricePerNight: 250,
  });

  const reservation = await Reservation.create({
    customer: user._id,
    room: room._id,
    checkIn: new Date("2027-02-10T00:00:00.000Z"),
    checkOut: new Date("2027-02-12T00:00:00.000Z"),
    guestCount: 2,
  });

  const loadedReservation = await Reservation.findById(reservation._id);
  assert.ok(loadedReservation);
  assert.equal(loadedReservation.customer.toString(), user._id.toString());
  assert.equal(loadedReservation.room.toString(), room._id.toString());
  assert.equal(loadedReservation.status, "confirmed");
  assert.ok(loadedReservation.reservationNumber);
});

test("ReservationModel rejects invalid status and dates", async () => {
  const reservation = new Reservation({
    customer: new mongoose.Types.ObjectId(),
    room: new mongoose.Types.ObjectId(),
    checkIn: new Date("2027-02-12T00:00:00.000Z"),
    checkOut: new Date("2027-02-10T00:00:00.000Z"),
    guestCount: 1,
    status: "pending",
  });

  await assert.rejects(reservation.validate(), (error: unknown) => {
    assert.ok(error instanceof mongoose.Error.ValidationError);
    assert.ok(error.errors.status);
    assert.ok(error.errors.checkOut);
    return true;
  });
});
