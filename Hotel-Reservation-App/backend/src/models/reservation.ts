import { randomUUID } from "node:crypto";
import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  customer: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  reservationNumber: string;
  status: "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Guest count must be a whole number",
      },
    },

    reservationNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.pre("validate", function () {
  if (this.checkIn && this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Check-out must be after check-in");
  }
});

const Reservation = mongoose.model<IReservation>(
  "Reservation",
  reservationSchema,
);

export default Reservation;
