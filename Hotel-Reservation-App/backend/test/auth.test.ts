import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { after, before, beforeEach, test } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { register, login } from "../src/controllers/authController.js";
import User from "../src/models/user.js";

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  await disconnectDatabase();
  await mongoServer.stop();
});

test("register creates a new user successfully", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      name: "John Smith",
      email: "JOHN@example.com",
      password: "password123",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await register(req, res);

  assert.equal(statusCode, 201);
  assert.equal(responseBody.message, "User registered successfully");
  assert.equal(responseBody.user.name, "John Smith");
  assert.equal(responseBody.user.email, "john@example.com");
  assert.equal(responseBody.user.role, "user");

  const savedUser = await User.findOne({
    email: "john@example.com",
  }).select("+passwordHash");

  assert.ok(savedUser);
  assert.notEqual(savedUser.passwordHash, "password123");

  assert.equal(
    await bcrypt.compare("password123", savedUser.passwordHash),
    true,
  );
});

test("register rejects missing required details", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      name: "John Smith",
      email: "john@example.com",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await register(req, res);

  assert.equal(statusCode, 400);
  assert.equal(responseBody.message, "Name, email, and password are required");
});

test("register rejects a short password", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      name: "John Smith",
      email: "john@example.com",
      password: "12345",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await register(req, res);

  assert.equal(statusCode, 400);
  assert.equal(
    responseBody.message,
    "Password must be at least 8 characters long",
  );
});

test("register rejects an already registered email", async () => {
  await User.create({
    name: "John Smith",
    email: "john@example.com",
    passwordHash: "password123",
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      name: "Another User",
      email: "JOHN@example.com",
      password: "password456",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await register(req, res);

  assert.equal(statusCode, 409);
  assert.equal(responseBody.message, "Email is already registered");
});

test("login allows a user with correct credentials", async () => {
  await User.create({
    name: "John Smith",
    email: "john@example.com",
    passwordHash: "password123",
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      email: "JOHN@example.com",
      password: "password123",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await login(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseBody.message, "Login successful");
  assert.equal(responseBody.user.name, "John Smith");
  assert.equal(responseBody.user.email, "john@example.com");
  assert.equal(responseBody.user.role, "user");

  assert.equal(responseBody.user.passwordHash, undefined);
});

test("login rejects missing email or password", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      email: "john@example.com",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await login(req, res);

  assert.equal(statusCode, 400);
  assert.equal(responseBody.message, "Email and password are required");
});

test("login rejects an incorrect password", async () => {
  await User.create({
    name: "John Smith",
    email: "john@example.com",
    passwordHash: "password123",
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      email: "john@example.com",
      password: "wrongpassword",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await login(req, res);

  assert.equal(statusCode, 401);
  assert.equal(responseBody.message, "Invalid email or password");
});

test("login rejects an email that does not exist", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      email: "unknown@example.com",
      password: "password123",
    },
  } as any;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseBody = data;
      return this;
    },
  } as any;

  await login(req, res);

  assert.equal(statusCode, 401);
  assert.equal(responseBody.message, "Invalid email or password");
});
