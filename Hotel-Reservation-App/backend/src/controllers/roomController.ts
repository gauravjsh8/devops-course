import type { Request, Response } from "express";
import mongoose from "mongoose";
import Room from "../models/room";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sendRoomError(
  error: unknown,
  res: Response,
  action: string,
): void {
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    res.status(400).json({ message: error.message });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({ message: "Room number already exists" });
    return;
  }

  console.error(`${action} error:`, error);
  res.status(500).json({ message: `An error occurred while ${action}` });
}

export async function createRoom(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    if (
      !isRecord(body) ||
      typeof body.roomNumber !== "string" ||
      !body.roomNumber.trim() ||
      typeof body.description !== "string" ||
      !body.description.trim() ||
      body.roomType === undefined ||
      body.beds === undefined ||
      body.maxGuests === undefined ||
      body.pricePerNight === undefined
    ) {
      res.status(400).json({
        message: "Please provide all required room details",
      });
      return;
    }

    const room = new Room();
    room.set("roomNumber", body.roomNumber.trim());
    room.set("roomType", body.roomType);
    room.set("beds", body.beds);
    room.set("description", body.description.trim());
    room.set("maxGuests", body.maxGuests);
    room.set("pricePerNight", body.pricePerNight);
    room.set("facilities", body.facilities);
    room.set("photos", body.photos);
    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    sendRoomError(error, res, "creating the room");
  }
}

export async function getAllRooms(_req: Request, res: Response): Promise<void> {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json({ count: rooms.length, rooms });
  } catch (error) {
    sendRoomError(error, res, "retrieving rooms");
  }
}

export async function getRoomById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.status(200).json({ room });
  } catch (error) {
    sendRoomError(error, res, "retrieving the room");
  }
}

export async function updateRoom(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    if (!isRecord(req.body)) {
      res.status(400).json({ message: "A room update object is required" });
      return;
    }

    const body = req.body;
    const fields = [
      "roomNumber",
      "roomType",
      "beds",
      "description",
      "maxGuests",
      "pricePerNight",
      "status",
      "isActive",
      "facilities",
      "photos",
    ] as const;
    const hasUpdates = fields.some((field) => body[field] !== undefined);
    if (!hasUpdates) {
      res.status(400).json({ message: "At least one room field is required" });
      return;
    }

    for (const field of fields) {
      if (body[field] !== undefined) {
        room.set(field, body[field]);
      }
    }

    await room.save();
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    sendRoomError(error, res, "updating the room");
  }
}

export async function deactivateRoom(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    room.isActive = false;
    await room.save();
    res.status(200).json({ message: "Room archived successfully", room });
  } catch (error) {
    sendRoomError(error, res, "archiving the room");
  }
}
