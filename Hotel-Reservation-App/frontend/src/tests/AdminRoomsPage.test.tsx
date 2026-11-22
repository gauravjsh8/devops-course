import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminRoomsPage from "../pages/AdminRoomsPage";
import type { Room } from "../types";

const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("../api", () => ({
  api: { get: mockGet, post: mockPost, put: mockPut, delete: mockDelete },
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
  status: "available",
};

describe("AdminRoomsPage", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPut.mockReset();
    mockDelete.mockReset();
    mockGet.mockResolvedValue({ data: { rooms: [room] } });
  });

  it("shows the rooms in the list", async () => {
    render(<AdminRoomsPage />);

    expect(await screen.findByText("101")).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith("/rooms");
  });

  it("sends a new room to the backend", async () => {
    mockPost.mockResolvedValue({ data: {} });
    render(<AdminRoomsPage />);
    await screen.findByText("101");

    const [roomNumber, description, facilities] =
      screen.getAllByRole("textbox");
    await userEvent.type(roomNumber, "105");
    await userEvent.type(description, "Test room");
    await userEvent.type(facilities, "WiFi, TV");

    await userEvent.click(screen.getByRole("button", { name: "Add room" }));

    expect(mockPost).toHaveBeenCalledWith(
      "/rooms",
      expect.objectContaining({
        roomNumber: "105",
        description: "Test room",
        facilities: ["WiFi", "TV"],
        photos: [],
      }),
      {},
    );
    expect(await screen.findByText("Room 105 added.")).toBeInTheDocument();
  });

  it("archives a room after confirming", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mockDelete.mockResolvedValue({ data: {} });
    render(<AdminRoomsPage />);
    await screen.findByText("101");

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));

    expect(mockDelete).toHaveBeenCalledWith("/rooms/r1", {});
    expect(await screen.findByText("Room 101 archived.")).toBeInTheDocument();
  });
});
