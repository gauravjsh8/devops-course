import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  roomType: "single" | "double" | "twin" | "suite" | "family";
  beds: number;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  status: "available" | "occupied" | "maintenance";
  isActive: boolean;
  facilities: string[];
  photos: string[];
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

    beds: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Beds must be a whole number",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Maximum guests must be a whole number",
      },
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

    isActive: {
      type: Boolean,
      default: true,
    },

    facilities: {
      type: [String],
      default: [],
    },

    photos: {
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
