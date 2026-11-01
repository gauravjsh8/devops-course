import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createServer, type Server } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import Room from "../src/models/room.js";
import User, { type UserRole } from "../src/models/user.js";

const jwtSecret = "test-only-secret-with-at-least-thirty-two-characters";
const password = "strong-password-123";
let mongoServer: MongoMemoryServer;
let server: Server;
let baseUrl: string;

before(async () => {
  process.env.JWT_SECRET = jwtSecret;
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
  server = createServer(createApp());
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  await User.deleteMany({});
  await Room.deleteMany({});
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await disconnectDatabase();
  await mongoServer.stop();
  delete process.env.JWT_SECRET;
});

async function request(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<{ response: Response; data: any }> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.token) headers.authorization = `Bearer ${options.token}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    ...(options.body === undefined
      ? {}
      : { body: JSON.stringify(options.body) }),
  });
  return { response, data: await response.json() };
}

async function registerCustomer(
  email = "customer@example.com",
  extra: Record<string, unknown> = {},
): Promise<{ token: string; user: { id: string; role: UserRole } }> {
  const registration = await request("/api/auth/register", {
    method: "POST",
    body: { name: "Test Customer", email, password, ...extra },
  });
  assert.equal(registration.response.status, 201);

  const login = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(login.response.status, 200);
  return { token: login.data.token, user: login.data.user };
}

async function staffToken(role: "receptionist" | "administrator"): Promise<string> {
  const email = `${role}@example.com`;
  await User.create({
    name: "Test Staff",
    email,
    passwordHash: password,
    role,
  });
  const result = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(result.response.status, 200);
  return result.data.token;
}

const roomPayload = {
  roomNumber: "101",
  roomType: "double",
  beds: 2,
  description: "A comfortable room",
  maxGuests: 2,
  pricePerNight: 120,
};

test("registerCustomer_createsCustomerAccount", async () => {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: { name: "Taylor", email: "TAYLOR@example.com", password },
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.data.user.role, "customer");
  assert.equal(result.data.user.email, "taylor@example.com");

  const storedUser = await User.findOne({ email: "taylor@example.com" }).select(
    "+passwordHash",
  );
  assert.ok(storedUser);
  assert.notEqual(storedUser.passwordHash, password);
});

test("registerCustomer_doesNotAllowStaffRole", async () => {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Attempted Admin",
      email: "attacker@example.com",
      password,
      role: "administrator",
    },
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.data.user.role, "customer");
  assert.equal(await User.countDocuments({ role: "administrator" }), 0);
});

test("registerCustomer_rejectsDuplicateEmailAndInvalidInput", async () => {
  await registerCustomer();
  const duplicate = await request("/api/auth/register", {
    method: "POST",
    body: { name: "Duplicate", email: "CUSTOMER@example.com", password },
  });
  const invalid = await request("/api/auth/register", {
    method: "POST",
    body: { name: "No email", email: "invalid", password: "short" },
  });

  assert.equal(duplicate.response.status, 409);
  assert.equal(invalid.response.status, 400);
});

test("login_rejectsIncorrectPassword", async () => {
  await registerCustomer();
  const result = await request("/api/auth/login", {
    method: "POST",
    body: { email: "customer@example.com", password: "wrong-password" },
  });

  assert.equal(result.response.status, 401);
});

test("logout_endsUserSession", async () => {
  const { token } = await registerCustomer();
  const logout = await request("/api/auth/logout", {
    method: "POST",
    token,
  });
  const protectedRequest = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });

  assert.equal(logout.response.status, 200);
  assert.equal(protectedRequest.response.status, 401);
});

test("requireAuth_rejectsUnauthenticatedRequest", async () => {
  const result = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
  });

  assert.equal(result.response.status, 401);
});

test("requireRole_rejectsUserWithoutRequiredRole", async () => {
  const { token } = await registerCustomer();
  const result = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });

  assert.equal(result.response.status, 403);
});

test("staffCanCreateUpdateAndArchiveRooms", async () => {
  const token = await staffToken("receptionist");
  const created = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });
  assert.equal(created.response.status, 201);

  const roomId = created.data.room._id as string;
  const updated = await request(`/api/rooms/${roomId}`, {
    method: "PUT",
    body: { pricePerNight: 0 },
    token,
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.room.pricePerNight, 0);

  const archived = await request(`/api/rooms/${roomId}`, {
    method: "DELETE",
    token,
  });
  assert.equal(archived.response.status, 200);
  assert.equal(archived.data.room.isActive, false);
  assert.ok(await Room.findById(roomId));
});

test("roomRoutesRejectInvalidUpdatesAndDuplicateNumbers", async () => {
  const token = await staffToken("administrator");
  const firstRoom = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });
  const duplicate = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });
  const invalidUpdate = await request(
    `/api/rooms/${firstRoom.data.room._id}`,
    {
      method: "PUT",
      body: { status: "not-a-status" },
      token,
    },
  );

  assert.equal(firstRoom.response.status, 201);
  assert.equal(duplicate.response.status, 409);
  assert.equal(invalidUpdate.response.status, 400);
});

test("requireAuth_rejectsMalformedAndLoggedOutTokens", async () => {
  const malformed = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token: "not-a-valid-token",
  });
  assert.equal(malformed.response.status, 401);

  const { token } = await registerCustomer();
  await request("/api/auth/logout", { method: "POST", token });
  const expiredSession = await request("/api/rooms", {
    method: "POST",
    body: roomPayload,
    token,
  });
  assert.equal(expiredSession.response.status, 401);
});
