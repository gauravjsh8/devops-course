import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RoomsPage from "../pages/RoomsPage";
import type { Room, User } from "../types";

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock("../api", () => ({
  api: { get: mockGet, post: mockPost },
  authHeader: () => ({}),
  getErrorMessage: (error: Error) => error.message,
}));

const room: Room = {
  _id: "r1",
  roomNumber: "101",
  roomType: "double",
  beds: 2,
  description: "Bright double room",
  maxGuests: 2,
  pricePerNight: 120,
  facilities: [],
  photos: [],
};

const customer: User = {
  id: "1",
  name: "Gaurav",
  email: "g@example.com",
  role: "customer",
};
const admin: User = {
  id: "2",
  name: "Admin",
  email: "a@example.com",
  role: "administrator",
};

function showPage(user: User | null) {
  render(
    <MemoryRouter>
      <RoomsPage user={user} />
    </MemoryRouter>,
  );
}

// Fill in the dates and click Search
async function search() {
  const [checkIn, checkOut] =
    document.querySelectorAll<HTMLInputElement>('input[type="date"]');
  fireEvent.change(checkIn, { target: { value: "2030-01-10" } });
  fireEvent.change(checkOut, { target: { value: "2030-01-12" } });
  await userEvent.click(screen.getByRole("button", { name: "Search" }));
}

describe("RoomsPage", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();

    mockGet.mockImplementation(async (url: string) =>
      url === "/rooms"
        ? { data: { rooms: [room] } }
        : { data: { rooms: [{ ...room, nights: 2, totalPrice: 240 }] } },
    );
  });

  it("shows all rooms when the page opens", async () => {
    showPage(null);

    expect(await screen.findByText("Room 101")).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith("/rooms");
  });

  it("shows the total price and a Book button for a customer after searching", async () => {
    showPage(customer);
    await screen.findByText("Room 101");

    await search();

    expect(await screen.findByText("240 €")).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith("/rooms/available", {
      params: { checkIn: "2030-01-10", checkOut: "2030-01-12", guests: 1 },
    });
    expect(
      screen.getByRole("button", { name: "Book this room" }),
    ).toBeInTheDocument();
  });

  it("shows no Book button for an administrator", async () => {
    showPage(admin);
    await screen.findByText("Room 101");

    await search();
    await screen.findByText("240 €");

    expect(
      screen.queryByRole("button", { name: "Book this room" }),
    ).not.toBeInTheDocument();
  });

  it("sends the booking to the backend", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => undefined);
    mockPost.mockResolvedValue({
      data: { reservation: { reservationNumber: "abc123" } },
    });

    showPage(customer);
    await screen.findByText("Room 101");
    await search();

    await userEvent.click(
      await screen.findByRole("button", { name: "Book this room" }),
    );

    expect(mockPost).toHaveBeenCalledWith(
      "/reservations",
      {
        roomId: "r1",
        checkIn: "2030-01-10",
        checkOut: "2030-01-12",
        guestCount: 1,
      },
      {},
    );
  });
});
