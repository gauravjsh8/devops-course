import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../src/config/db";
import User, { type UserRole } from "../src/models/user";

dotenv.config();

async function createStaffUser(): Promise<void> {
  const { MONGO_URI, STAFF_NAME, STAFF_EMAIL, STAFF_PASSWORD, STAFF_ROLE } =
    process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }
  if (!STAFF_NAME?.trim() || !STAFF_EMAIL?.trim()) {
    throw new Error("STAFF_NAME and STAFF_EMAIL are required");
  }
  if (!STAFF_PASSWORD || STAFF_PASSWORD.length < 5) {
    throw new Error("STAFF_PASSWORD must be at least 5 characters long");
  }
  if (STAFF_ROLE !== "receptionist" && STAFF_ROLE !== "administrator") {
    throw new Error("STAFF_ROLE must be receptionist or administrator");
  }

  const role: UserRole = STAFF_ROLE;
  const email = STAFF_EMAIL.trim().toLowerCase();
  await connectDatabase(MONGO_URI);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(`An account already exists for ${email}`);
    }

    const user = await User.create({
      name: STAFF_NAME.trim(),
      email,
      passwordHash: STAFF_PASSWORD,
      role,
    });

    console.log(`Created ${role} account for ${user.email}`);
  } finally {
    await disconnectDatabase();
  }
}

createStaffUser().catch((error: unknown) => {
  console.error("Could not create staff account:", error);
  process.exitCode = 1;
});
