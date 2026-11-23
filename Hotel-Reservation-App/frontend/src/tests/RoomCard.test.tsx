import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types";

const room: Room = {
  _id: "r1",
  roomNumber: "101",
  roomType: "double",
  beds: 2,
  description: "Bright double room",
  maxGuests: 2,
  pricePerNight: 120,
  facilities: ["WiFi", "TV"],
  photos: [],
};

describe("RoomCard", () => {
  it("shows the room details and facilities", () => {
    render(<MemoryRouter><RoomCard room={room} /></MemoryRouter>);

    expect(screen.getByText("Room 101")).toBeInTheDocument();
    expect(screen.getByText("Bright double room")).toBeInTheDocument();
    expect(screen.getByText("WiFi")).toBeInTheDocument();
    expect(screen.getByText("TV")).toBeInTheDocument();
  });

  it("has no Book button when onBook is not given", () => {
    render(<MemoryRouter><RoomCard room={room} /></MemoryRouter>);

    expect(
      screen.queryByRole("button", { name: "Book this room" }),
    ).not.toBeInTheDocument();
  });

  it("opens room details through the View details callback", async () => {
    const onViewDetails = vi.fn();
    render(
      <MemoryRouter>
        <RoomCard room={room} onViewDetails={onViewDetails} />
      </MemoryRouter>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "View details" }),
    );

    expect(onViewDetails).toHaveBeenCalled();
  });

  it("shows the total price and calls onBook when clicked", async () => {
    const onBook = vi.fn();
    render(
      <MemoryRouter>
        <RoomCard
          room={{ ...room, nights: 2, totalPrice: 240 }}
          onBook={onBook}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("240 €")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Book this room" }),
    );

    expect(onBook).toHaveBeenCalled();
  });
});
