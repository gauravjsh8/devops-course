import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createServer, type Server } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import Reservation from "../src/models/reservation.js";
import Room from "../src/models/room.js";
import User, { type UserRole } from "../src/models/user.js";

const password = "strong-password-123";
let mongoServer: MongoMemoryServer;
let server: Server;
let baseUrl: string;

before(async () => {
  process.env.JWT_SECRET =
    "test-only-secret-with-at-least-thirty-two-characters";
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
  server = createServer(createApp());
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  await Reservation.deleteMany({});
  await Room.deleteMany({});
  await User.deleteMany({});
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await disconnectDatabase();
  await mongoServer.stop();
});

// "2027-01-10" style date, X days from today
function day(x: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + x);
  return date.toISOString().slice(0, 10);
}

async function call(
  path: string,
  method = "GET",
  token?: string,
  body?: unknown,
) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, data: await response.json() };
}

async function loginAs(email: string, role: UserRole): Promise<string> {
  await User.create({ name: "Test", email, passwordHash: password, role });
  const login = await call("/api/auth/login", "POST", undefined, {
    email,
    password,
  });
  return login.data.token;
}

async function makeRoom(roomNumber: string): Promise<string> {
  const room = await Room.create({
    roomNumber,
    roomType: "double",
    beds: 2,
    description: "Test room",
    maxGuests: 2,
    pricePerNight: 100,
  });
  return room.id;
}

test("customer can book a room and it disappears from search", async () => {
  const token = await loginAs("customer@example.com", "customer");
  const roomId = await makeRoom("101");
  await makeRoom("102");

  const booking = await call("/api/reservations", "POST", token, {
    roomId,
    checkIn: day(10),
    checkOut: day(12),
    guestCount: 2,
  });
  assert.equal(booking.status, 201);
  assert.equal(booking.data.reservation.totalPrice, 200);

  const search = await call(
    `/api/rooms/available?checkIn=${day(10)}&checkOut=${day(12)}&guests=2`,
  );
  assert.equal(search.data.count, 1);
  assert.equal(search.data.rooms[0].roomNumber, "102");
});

test("double booking is rejected", async () => {
  const token = await loginAs("customer@example.com", "customer");
  const roomId = await makeRoom("101");

  const first = await call("/api/reservations", "POST", token, {
    roomId,
    checkIn: day(10),
    checkOut: day(12),
    guestCount: 1,
  });
  const overlap = await call("/api/reservations", "POST", token, {
    roomId,
    checkIn: day(11),
    checkOut: day(13),
    guestCount: 1,
  });

  assert.equal(first.status, 201);
  assert.equal(overlap.status, 409);
});

test("customer can update and cancel own booking, but not see others", async () => {
  const owner = await loginAs("owner@example.com", "customer");
  const other = await loginAs("other@example.com", "customer");
  const roomId = await makeRoom("101");

  const booking = await call("/api/reservations", "POST", owner, {
    roomId,
    checkIn: day(10),
    checkOut: day(12),
    guestCount: 2,
  });
  const id = booking.data.reservation._id;

  assert.equal(
    (await call(`/api/reservations/${id}`, "GET", other)).status,
    404,
  );

  const updated = await call(`/api/reservations/${id}`, "PUT", owner, {
    guestCount: 1,
  });
  assert.equal(updated.status, 200);

  const cancelled = await call(
    `/api/reservations/${id}/cancel`,
    "PATCH",
    owner,
  );
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.data.reservation.status, "cancelled");
});

test("receptionist can see all bookings, customer cannot", async () => {
  const customer = await loginAs("customer@example.com", "customer");
  const receptionist = await loginAs("reception@example.com", "receptionist");
  const roomId = await makeRoom("101");

  await call("/api/reservations", "POST", customer, {
    roomId,
    checkIn: day(10),
    checkOut: day(12),
    guestCount: 1,
  });

  assert.equal((await call("/api/reservations", "GET", customer)).status, 403);

  const all = await call("/api/reservations", "GET", receptionist);
  assert.equal(all.status, 200);
  assert.equal(all.data.count, 1);
});
