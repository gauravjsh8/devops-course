import { Request, Response } from "express";
import Room from "../models/room";
import mongoose from "mongoose";

export async function createRoom(req: Request, res: Response): Promise<void> {
  try {
    const {
      roomNumber,
      roomType,
      beds,
      description,
      maxGuests,
      pricePerNight,
      facilities,
      photos,
    } = req.body;

    if (
      !roomNumber ||
      !roomType ||
      beds == null ||
      !description ||
      maxGuests == null ||
      pricePerNight == null
    ) {
      res.status(400).json({
        message: "Please provide all required room details",
      });
      return;
    }

    const existingRoom = await Room.findOne({
      roomNumber: roomNumber.trim(),
    });

    if (existingRoom) {
      res.status(409).json({
        message: "Room number already exists",
      });
      return;
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      beds,
      description,
      maxGuests,
      pricePerNight,
      facilities,
      photos,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "An error occurred while creating the room",
    });
  }
}

export async function getAllRooms(req: Request, res: Response): Promise<void> {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });

    res.status(200).json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    res.status(500).json({
      message: "An error occurred while retrieving rooms",
    });
  }
}

export async function getRoomById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid room ID",
      });
      return;
    }

    const room = await Room.findById(id);

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    res.status(200).json({ room });
  } catch (error) {
    console.error("Get room error:", error);

    res.status(500).json({
      message: "An error occurred while retrieving the room",
    });
  }
}

export async function updateRoom(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid room ID",
      });
      return;
    }

    const room = await Room.findById(id);

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    const {
      roomNumber,
      roomType,
      beds,
      description,
      maxGuests,
      pricePerNight,
      status,
      isActive,
      facilities,
      photos,
    } = req.body;

    if (roomNumber) room.roomNumber = roomNumber;
    if (roomType) room.roomType = roomType;
    if (beds) room.beds = beds;
    if (description) room.description = description;
    if (maxGuests) room.maxGuests = maxGuests;
    if (pricePerNight) room.pricePerNight = pricePerNight;
    if (status) room.status = status;
    if (isActive !== undefined) room.isActive = isActive;
    if (facilities) room.facilities = facilities;
    if (photos) room.photos = photos;

    await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      message: "An error occurred while updating the room",
    });
  }
}
