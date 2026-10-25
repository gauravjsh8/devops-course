import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  roomType: "single" | "double" | "twin" | "suite" | "family";
  description: string;
  capacity: number;
  pricePerNight: number;
  status: "available" | "occupied" | "maintenance";
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    roomType: {
      type: String,
      enum: ["single", "double", "twin", "suite", "family"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },

    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
