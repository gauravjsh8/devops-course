import type { Request, Response } from "express";
import {
  AuthServiceError,
  login as loginUser,
  logout as logoutUser,
  registerCustomer,
} from "../services/authService";

function respondWithError(
  error: unknown,
  res: Response,
  action: string,
): void {
  if (error instanceof AuthServiceError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(`${action} error:`, error);
  res.status(500).json({ message: `An error occurred during ${action}` });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const user = await registerCustomer(req.body ?? {});
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    respondWithError(error, res, "registration");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = await loginUser(req.body?.email, req.body?.password);
    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    respondWithError(error, res, "login");
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const user = res.locals.authUser as { id: string };
    await logoutUser(user.id);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    respondWithError(error, res, "logout");
  }
}
