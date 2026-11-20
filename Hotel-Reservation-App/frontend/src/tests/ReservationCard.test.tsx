import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Reservation } from "../types";
import ReservationCard from "../components/ReservationCard";

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
  customer: { _id: "c1", name: "Gaurav", email: "g@example.com" },
  checkIn: "2030-01-10T00:00:00.000Z",
  checkOut: "2030-01-12T00:00:00.000Z",
  guestCount: 2,
  totalPrice: 240,
  status: "confirmed",
  createdAt: "2029-12-01T00:00:00.000Z",
};

function showCard(props: Partial<Parameters<typeof ReservationCard>[0]> = {}) {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onCancel = vi.fn().mockResolvedValue(undefined);
  render(
    <ReservationCard
      reservation={reservation}
      onSave={onSave}
      onCancel={onCancel}
      {...props}
    />,
  );
  return { onSave, onCancel };
}

describe("ReservationCard", () => {
  it("shows the booking details", () => {
    showCard();

    expect(screen.getByText("Room 101")).toBeInTheDocument();
    expect(screen.getByText("10/01/2030")).toBeInTheDocument();
    expect(screen.getByText("12/01/2030")).toBeInTheDocument();
    expect(screen.getByText("240 €")).toBeInTheDocument();
    expect(screen.getByText("confirmed")).toBeInTheDocument();
  });

  it("shows the customer only when showCustomer is set", () => {
    showCard({ showCustomer: true });

    expect(screen.getByText("Gaurav · g@example.com")).toBeInTheDocument();
  });

  it("shows no buttons for a cancelled booking", () => {
    showCard({ reservation: { ...reservation, status: "cancelled" } });

    expect(
      screen.queryByRole("button", { name: "Change" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel booking" }),
    ).not.toBeInTheDocument();
  });

  it("sends the new dates and guests when saving a change", async () => {
    const { onSave } = showCard();

    await userEvent.click(screen.getByRole("button", { name: "Change" }));

    const checkOut =
      document.querySelectorAll<HTMLInputElement>('input[type="date"]')[1];
    fireEvent.change(checkOut, { target: { value: "2030-01-13" } });

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSave).toHaveBeenCalledWith({
      checkIn: "2030-01-10",
      checkOut: "2030-01-13",
      guestCount: 2,
    });
  });

  it("calls onCancel when Cancel booking is clicked", async () => {
    const { onCancel } = showCard();

    await userEvent.click(
      screen.getByRole("button", { name: "Cancel booking" }),
    );

    expect(onCancel).toHaveBeenCalled();
  });
});
