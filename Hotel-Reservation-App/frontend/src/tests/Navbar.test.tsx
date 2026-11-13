import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../types";
import Navbar from "../components/Navbar";

const customer: User = {
  id: "1",
  name: "Gaurav",
  email: "gaurav@example.com",
  role: "customer",
};

const admin: User = {
  id: "2",
  name: "Admin",
  email: "admin@example.com",
  role: "administrator",
};

// Show the Navbar for a user (or null = logged out)
function showNavbar(user: User | null) {
  const onLogout = vi.fn();
  render(
    <MemoryRouter>
      <Navbar user={user} onLogout={onLogout} />
    </MemoryRouter>,
  );
  return onLogout;
}

describe("Navbar", () => {
  it("shows Log in and Sign up when logged out", () => {
    showNavbar(null);

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
  });

  it("shows customer links for a customer", () => {
    showNavbar(customer);

    expect(screen.getByText("Gaurav")).toBeInTheDocument();
    expect(screen.getByText("My reservations")).toBeInTheDocument();
    expect(screen.queryByText("Manage rooms")).not.toBeInTheDocument();
  });

  it("shows admin links for an administrator", () => {
    showNavbar(admin);

    expect(screen.getByText("All reservations")).toBeInTheDocument();
    expect(screen.getByText("Manage rooms")).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.queryByText("My reservations")).not.toBeInTheDocument();
  });

  it("calls onLogout when Log out is clicked", async () => {
    const onLogout = showNavbar(customer);

    await userEvent.click(screen.getByText("Log out"));

    expect(onLogout).toHaveBeenCalled();
  });
});
