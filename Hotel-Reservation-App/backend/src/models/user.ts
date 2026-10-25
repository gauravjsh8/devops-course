import bcrypt from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "receptionist" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "receptionist", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
