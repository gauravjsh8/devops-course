import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createServer, type Server } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../../src/app.js";
import { connectDatabase, disconnectDatabase } from "../../src/config/db.js";
import Reservation from "../../src/models/reservation.js";
import Room from "../../src/models/room.js";
import User, { type UserRole } from "../../src/models/user.js";

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
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await disconnectDatabase();
  await mongoServer.stop();
  delete process.env.JWT_SECRET;
});

async function login(email: string, role: UserRole): Promise<string> {
  await User.create({ name: "Test", email, passwordHash: password, role });
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(response.status, 200);
  return (await response.json()).token;
}

async function request(path: string, token?: string) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: token ? { authorization: "Bearer " + token } : {},
  });
  return { status: response.status, data: await response.json() };
}

async function makeRoom(roomNumber: string, changes = {}) {
  return Room.create({
    roomNumber,
    roomType: "double",
    beds: 2,
    description: "Test room",
    maxGuests: 2,
    pricePerNight: 100,
    ...changes,
  });
}

async function makeReservation(
  customer: string,
  room: string,
  checkIn: Date,
  checkOut: Date,
  changes = {},
) {
  return Reservation.create({
    customer,
    room,
    checkIn,
    checkOut,
    guestCount: 1,
    totalPrice: 100,
    ...changes,
  });
}

async function setupReservation() {
  const customer = await User.create({
    name: "Customer",
    email: "customer@example.com",
    passwordHash: password,
  });
  const room = await makeRoom("101");
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { customer, room, today, tomorrow };
}

test("getHotelStatistics_countsReservations", async () => {
  const { customer, room, today, tomorrow } = await setupReservation();
  await makeReservation(customer.id, room.id, today, tomorrow);

  const token = await login("admin@example.com", "administrator");
  const result = await request("/api/admin/statistics", token);

  assert.equal(result.data.statistics.totalReservations, 1);
});

test("getHotelStatistics_countsCancelledReservations", async () => {
  const { customer, room, today, tomorrow } = await setupReservation();
  await makeReservation(customer.id, room.id, today, tomorrow, {
    status: "cancelled",
  });

  const token = await login("admin@example.com", "administrator");
  const result = await request("/api/admin/statistics", token);

  assert.equal(result.data.statistics.totalReservations, 1);
  assert.equal(result.data.statistics.cancelledReservations, 1);
});

test("getHotelStatistics_countsAvailableRooms", async () => {
  const { room } = await setupReservation();
  await makeRoom("102", { status: "maintenance" });
  await makeRoom("103", { isActive: false });

  const token = await login("admin@example.com", "administrator");
  const result = await request("/api/admin/statistics", token);

  assert.equal(result.data.statistics.availableRooms, 1);
  assert.ok(room);
});

test("getHotelStatistics_returnsOccupancyAndRevenue", async () => {
  const { customer, room, today, tomorrow } = await setupReservation();
  const otherRoom = await makeRoom("102");
  const inactiveRoom = await makeRoom("103", { isActive: false });
  await makeReservation(customer.id, room.id, today, tomorrow, {
    totalPrice: 250,
  });
  await makeReservation(customer.id, inactiveRoom.id, today, tomorrow, {
    totalPrice: 900,
  });
  await makeReservation(customer.id, otherRoom.id, today, tomorrow, {
    status: "cancelled",
    totalPrice: 500,
  });

  const token = await login("admin@example.com", "administrator");
  const result = await request("/api/admin/statistics", token);

  assert.equal(result.data.statistics.occupancyRate, 50);
  assert.equal(result.data.statistics.revenue, 1150);
});

test("adminStatisticsRoute_rejectsNonAdministrator", async () => {
  const customerToken = await login("customer@example.com", "customer");
  const receptionistToken = await login("reception@example.com", "receptionist");

  assert.equal(
    (await request("/api/admin/statistics", customerToken)).status,
    403,
  );
  assert.equal(
    (await request("/api/admin/statistics", receptionistToken)).status,
    403,
  );
  assert.equal((await request("/api/admin/statistics")).status, 401);
});
