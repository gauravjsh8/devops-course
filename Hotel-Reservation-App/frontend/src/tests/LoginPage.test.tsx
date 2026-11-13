import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "../pages/LoginPage";

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock("../api", () => ({
  api: { post: mockPost },
  getErrorMessage: (error: Error) => error.message,
}));

const customer = {
  id: "1",
  name: "Gaurav",
  email: "gaurav@example.com",
  role: "customer",
};

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(
    screen.getByPlaceholderText("you@example.com"),
    "gaurav@example.com",
  );
  await user.type(
    screen.getByPlaceholderText("Your password"),
    "strong-password",
  );
  await user.click(screen.getByRole("button", { name: "Log in" }));
}

describe("LoginPage", () => {
  const onLogin = vi.fn();

  beforeEach(() => {
    mockPost.mockReset();
    onLogin.mockReset();
    localStorage.clear();
    render(
      <MemoryRouter>
        <LoginPage onLogin={onLogin} />
      </MemoryRouter>,
    );
  });

  it("saves the token and user after a successful login", async () => {
    mockPost.mockResolvedValue({
      data: { token: "test-token", user: customer },
    });

    await fillAndSubmit();

    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "gaurav@example.com",
      password: "strong-password",
    });
    expect(localStorage.getItem("token")).toBe("test-token");
    expect(onLogin).toHaveBeenCalledWith(customer);
  });

  it("shows an error when the login fails", async () => {
    mockPost.mockRejectedValue(new Error("Invalid email or password"));

    await fillAndSubmit();

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
