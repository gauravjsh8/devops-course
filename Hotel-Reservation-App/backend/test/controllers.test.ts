import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/config/db";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../src/controllers/roomController";
import Room from "../src/models/room";

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
});

beforeEach(async () => {
  await Room.deleteMany({});
});

after(async () => {
  await disconnectDatabase();
  await mongoServer.stop();
});

test("createRoom creates a new room successfully", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      roomNumber: "301",
      roomType: "double",
      beds: 2,
      description: "A comfortable double room",
      maxGuests: 2,
      pricePerNight: 150,
      facilities: ["Wi-Fi", "TV"],
      photos: [],
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

  await createRoom(req, res);

  assert.equal(statusCode, 201);
  assert.equal(responseBody.message, "Room created successfully");
  assert.equal(responseBody.room.roomNumber, "301");

  const savedRoom = await Room.findOne({ roomNumber: "301" });

  assert.ok(savedRoom);
  assert.equal(savedRoom.pricePerNight, 150);
});

test("createRoom rejects missing required details", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      roomNumber: "302",
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

  await createRoom(req, res);

  assert.equal(statusCode, 400);
  assert.equal(
    responseBody.message,
    "Please provide all required room details",
  );
});

test("createRoom rejects duplicate room numbers", async () => {
  await Room.create({
    roomNumber: "303",
    roomType: "double",
    beds: 2,
    description: "A double room",
    maxGuests: 2,
    pricePerNight: 150,
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    body: {
      roomNumber: "303",
      roomType: "double",
      beds: 2,
      description: "Another double room",
      maxGuests: 2,
      pricePerNight: 150,
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

  await createRoom(req, res);

  assert.equal(statusCode, 409);
  assert.equal(responseBody.message, "Room number already exists");
});

test("getAllRooms returns all rooms", async () => {
  await Room.create([
    {
      roomNumber: "301",
      roomType: "double",
      beds: 2,
      description: "Double room",
      maxGuests: 2,
      pricePerNight: 150,
    },
    {
      roomNumber: "302",
      roomType: "suite",
      beds: 1,
      description: "Suite room",
      maxGuests: 3,
      pricePerNight: 250,
    },
  ]);

  let statusCode = 0;
  let responseBody: any;

  const req = {} as any;

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

  await getAllRooms(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseBody.count, 2);
  assert.equal(responseBody.rooms.length, 2);
  assert.equal(responseBody.rooms[0].roomNumber, "301");
  assert.equal(responseBody.rooms[1].roomNumber, "302");
});

test("getRoomById returns a room using its ID", async () => {
  const room = await Room.create({
    roomNumber: "304",
    roomType: "single",
    beds: 1,
    description: "A single room",
    maxGuests: 1,
    pricePerNight: 100,
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    params: {
      id: room._id.toString(),
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

  await getRoomById(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseBody.room.roomNumber, "304");
});

test("getRoomById rejects an invalid ID", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    params: {
      id: "invalid-id",
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

  await getRoomById(req, res);

  assert.equal(statusCode, 400);
  assert.equal(responseBody.message, "Invalid room ID");
});

test("getRoomById returns 404 when room is not found", async () => {
  let statusCode = 0;
  let responseBody: any;

  const missingId = new mongoose.Types.ObjectId();

  const req = {
    params: {
      id: missingId.toString(),
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

  await getRoomById(req, res);

  assert.equal(statusCode, 404);
  assert.equal(responseBody.message, "Room not found");
});

test("updateRoom updates room details", async () => {
  const room = await Room.create({
    roomNumber: "305",
    roomType: "double",
    beds: 2,
    description: "Old description",
    maxGuests: 2,
    pricePerNight: 150,
  });

  let statusCode = 0;
  let responseBody: any;

  const req = {
    params: {
      id: room._id.toString(),
    },
    body: {
      pricePerNight: 200,
      description: "Updated description",
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

  await updateRoom(req, res);

  assert.equal(statusCode, 200);
  assert.equal(responseBody.message, "Room updated successfully");
  assert.equal(responseBody.room.pricePerNight, 200);
  assert.equal(responseBody.room.description, "Updated description");

  const updatedRoom = await Room.findById(room._id);

  assert.ok(updatedRoom);
  assert.equal(updatedRoom.pricePerNight, 200);
});

test("updateRoom rejects an invalid ID", async () => {
  let statusCode = 0;
  let responseBody: any;

  const req = {
    params: {
      id: "invalid-id",
    },
    body: {
      pricePerNight: 200,
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

  await updateRoom(req, res);

  assert.equal(statusCode, 400);
  assert.equal(responseBody.message, "Invalid room ID");
});

test("updateRoom returns 404 when room is not found", async () => {
  let statusCode = 0;
  let responseBody: any;

  const missingId = new mongoose.Types.ObjectId();

  const req = {
    params: {
      id: missingId.toString(),
    },
    body: {
      pricePerNight: 200,
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

  await updateRoom(req, res);

  assert.equal(statusCode, 404);
  assert.equal(responseBody.message, "Room not found");
});
