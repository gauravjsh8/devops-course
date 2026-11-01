import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import User, { type UserRole } from "../models/user";

export interface RegisterCustomerInput {
  name: unknown;
  email: unknown;
  password: unknown;
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }

  return secret;
}

function normalizeEmail(email: unknown): string {
  if (typeof email !== "string") {
    throw new AuthServiceError("A valid email is required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AuthServiceError("A valid email is required", 400);
  }

  return normalizedEmail;
}

export async function registerCustomer(input: RegisterCustomerInput) {
  if (typeof input.name !== "string" || !input.name.trim()) {
    throw new AuthServiceError("Name is required", 400);
  }

  const email = normalizeEmail(input.email);
  if (typeof input.password !== "string" || input.password.length < 8) {
    throw new AuthServiceError("Password must be at least 8 characters long", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AuthServiceError("Email is already registered", 409);
  }

  try {
    const user = await User.create({
      name: input.name.trim(),
      email,
      passwordHash: input.password,
      role: "customer",
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AuthServiceError("Email is already registered", 409);
    }

    throw error;
  }
}

export async function login(emailInput: unknown, passwordInput: unknown) {
  const email = normalizeEmail(emailInput);
  if (typeof passwordInput !== "string" || !passwordInput) {
    throw new AuthServiceError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select(
    "+passwordHash +authTokenVersion",
  );
  if (!user || !(await bcrypt.compare(passwordInput, user.passwordHash))) {
    throw new AuthServiceError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { tokenVersion: user.authTokenVersion },
    getJwtSecret(),
    { subject: user.id, expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function logout(userId: string): Promise<void> {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { authTokenVersion: 1 } },
  );

  if (!user) {
    throw new AuthServiceError("User not found", 401);
  }
}

interface AuthenticatedPayload extends JwtPayload {
  sub: string;
  tokenVersion: number;
}

function isAuthenticatedPayload(
  payload: string | JwtPayload,
): payload is AuthenticatedPayload {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    typeof payload.tokenVersion === "number" &&
    Number.isInteger(payload.tokenVersion)
  );
}

export const requireAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const secret = getJwtSecret();
  let payload: AuthenticatedPayload;
  try {
    const verified = jwt.verify(match[1], secret);
    if (!isAuthenticatedPayload(verified)) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    payload = verified;
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  try {
    const user = await User.findById(payload.sub).select("+authTokenVersion");
    if (!user || user.authTokenVersion !== payload.tokenVersion) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    res.locals.authUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (_req, res, next) => {
    const user = res.locals.authUser as { role?: UserRole } | undefined;
    if (!user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!user.role || !roles.includes(user.role)) {
      res.status(403).json({ message: "You do not have permission to do this" });
      return;
    }

    next();
  };
}

export function validateAuthConfiguration(): void {
  getJwtSecret();
}
