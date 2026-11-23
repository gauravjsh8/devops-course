import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RoomDetails from "../features/rooms/RoomDetails";

const room = {
  _id: "r1",
  roomNumber: "101",
  roomType: "double",
  beds: 2,
  description: "Bright room",
  maxGuests: 2,
  pricePerNight: 120,
  facilities: ["WiFi", "TV"],
  photos: [],
};

describe("RoomDetails", () => {
  it("shows details and closes with the top-right button", async () => {
    const onClose = vi.fn();
    render(<RoomDetails room={room} onClose={onClose} />);

    expect(
      screen.getByRole("dialog", { name: "Room 101" }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Close room details" }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<RoomDetails room={room} onClose={onClose} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
