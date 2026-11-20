import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyReservationPage from "../pages/MyReservationPage";
import type { Reservation } from "../types";

const { mockGet, mockPut, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
  mockPatch: vi.fn(),
}));

vi.mock("../api", () => ({
  api: { get: mockGet, put: mockPut, patch: mockPatch },
  authHeader: () => ({}),
  getErrorMessage: (error: Error) => error.message,
}));

const reservation: Reservation = {
  _id: "res1",
  reservationNumber: "3f2a9c1e-1234-5678-9abc-def012345678",
  room: {
    _id: "r1",
    roomNumber: "101",
    roomType: "double",
    beds: 2,
    description: "Bright double room",
    maxGuests: 2,
    pricePerNight: 120,
    facilities: [],
    photos: [],
  },
  checkIn: "2030-01-10T00:00:00.000Z",
  checkOut: "2030-01-12T00:00:00.000Z",
  guestCount: 2,
  totalPrice: 240,
  status: "confirmed",
  createdAt: "2029-12-01T00:00:00.000Z",
};

function showPage() {
  render(
    <MemoryRouter>
      <MyReservationPage />
    </MemoryRouter>,
  );
}

describe("MyReservationPage", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPut.mockReset();
    mockPatch.mockReset();
  });

  it("shows the customer's bookings", async () => {
    mockGet.mockResolvedValue({ data: { reservations: [reservation] } });

    showPage();

    expect(await screen.findByText("Room 101")).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith("/reservations/my", {});
  });

  it("shows a message when there are no bookings", async () => {
    mockGet.mockResolvedValue({ data: { reservations: [] } });

    showPage();

    expect(
      await screen.findByText("You have no bookings yet."),
    ).toBeInTheDocument();
  });

  it("cancels a booking after confirming", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mockGet.mockResolvedValue({ data: { reservations: [reservation] } });
    mockPatch.mockResolvedValue({ data: {} });

    showPage();
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancel booking" }),
    );

    expect(mockPatch).toHaveBeenCalledWith("/reservations/res1/cancel", {}, {});
    expect(
      await screen.findByText("Your booking was cancelled."),
    ).toBeInTheDocument();
  });
});
