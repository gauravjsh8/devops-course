import type { Request, Response } from "express";
import mongoose from "mongoose";
import * as reservationService from "../services/reservationService";
import {
  ReservationError,
  type CurrentUser,
} from "../services/reservationService";

function getUser(res: Response): CurrentUser {
  return res.locals.authUser as CurrentUser;
}

function handleError(error: unknown, res: Response): void {
  if (error instanceof ReservationError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    res.status(400).json({ message: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
}

// GET /api/rooms/available?checkIn=2027-01-10&checkOut=2027-01-12&guests=2
export async function searchAvailableRooms(req: Request, res: Response) {
  try {
    const rooms = await reservationService.searchAvailableRooms(
      String(req.query.checkIn),
      String(req.query.checkOut),
      Number(req.query.guests ?? 1),
    );
    res.json({ count: rooms.length, rooms });
  } catch (error) {
    handleError(error, res);
  }
}

// POST /api/reservations
export async function createReservation(req: Request, res: Response) {
  try {
    const reservation = await reservationService.createReservation(
      getUser(res),
      req.body ?? {},
    );
    res.status(201).json({ message: "Reservation created", reservation });
  } catch (error) {
    handleError(error, res);
  }
}

// GET /api/reservations/my
export async function getMyReservations(_req: Request, res: Response) {
  try {
    const reservations = await reservationService.getMyReservations(
      getUser(res),
    );
    res.json({ count: reservations.length, reservations });
  } catch (error) {
    handleError(error, res);
  }
}

// GET /api/reservations
export async function getAllReservations(_req: Request, res: Response) {
  try {
    const reservations = await reservationService.getAllReservations();
    res.json({ count: reservations.length, reservations });
  } catch (error) {
    handleError(error, res);
  }
}

// GET /api/reservations/:id
export async function getReservationById(req: Request, res: Response) {
  try {
    const reservation = await reservationService.getReservationById(
      String(req.params.id),

      getUser(res),
    );
    res.json({ reservation });
  } catch (error) {
    handleError(error, res);
  }
}

// PUT /api/reservations/:id
export async function updateReservation(req: Request, res: Response) {
  try {
    const reservation = await reservationService.updateReservation(
      String(req.params.id),

      getUser(res),
      req.body ?? {},
    );
    res.json({ message: "Reservation updated", reservation });
  } catch (error) {
    handleError(error, res);
  }
}

// PATCH /api/reservations/:id/cancel
export async function cancelReservation(req: Request, res: Response) {
  try {
    const reservation = await reservationService.cancelReservation(
      String(req.params.id),

      getUser(res),
    );
    res.json({ message: "Reservation cancelled", reservation });
  } catch (error) {
    handleError(error, res);
  }
}
