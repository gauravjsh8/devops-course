import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BookingReview from "../features/reservations/BookingReview";
import type { Room } from "../types";

const room: Room = {
  _id: "r1",
  roomNumber: "101",
  roomType: "double",
  beds: 2,
  description: "Bright room",
  maxGuests: 2,
  pricePerNight: 120,
  facilities: [],
  photos: [],
  nights: 2,
  totalPrice: 240,
};

describe("BookingReview", () => {
  it("shows the total and collects guest name and email", async () => {
    const onSubmit = vi.fn();
    render(
      <BookingReview
        room={room}
        user={null}
        checkIn="2030-01-10"
        checkOut="2030-01-12"
        guests={2}
        submitting={false}
        error=""
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("240 €")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Name"), "Taylor Guest");
    await userEvent.type(screen.getByLabelText("Email"), "taylor@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(onSubmit).toHaveBeenCalledWith("Taylor Guest", "taylor@example.com");
  });
});
