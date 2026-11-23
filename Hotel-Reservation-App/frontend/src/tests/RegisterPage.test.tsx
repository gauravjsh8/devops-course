import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "../pages/RegisterPage";

// A fake api.post, so the test doesn't call the real backend
const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock("../api", () => ({
  api: { post: mockPost },
  getErrorMessage: (error: Error) => error.message,
}));

// Fill in the form and click Sign up
async function fillAndSubmit(password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText("Your full name"), "Test User");
  await user.type(
    screen.getByPlaceholderText("you@example.com"),
    "test@example.com",
  );
  await user.type(
    screen.getByPlaceholderText("At least 8 characters"),
    password,
  );
  await user.click(screen.getByRole("button", { name: "Sign up" }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    mockPost.mockReset();
    vi.spyOn(window, "alert").mockImplementation(() => undefined);
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );
  });

  it("shows an error when the password is too short", async () => {
    await fillAndSubmit("short");

    expect(
      await screen.findByText("Password must be at least 8 characters long"),
    ).toBeInTheDocument();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("sends the form to the backend", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await fillAndSubmit("strong-password");

    expect(mockPost).toHaveBeenCalledWith("/auth/register", {
      name: "Test User",
      email: "test@example.com",
      password: "strong-password",
    });
  });

  it("shows the error from the backend", async () => {
    mockPost.mockRejectedValue(new Error("Email is already registered"));

    await fillAndSubmit("strong-password");

    expect(
      await screen.findByText("Email is already registered"),
    ).toBeInTheDocument();
  });
});
