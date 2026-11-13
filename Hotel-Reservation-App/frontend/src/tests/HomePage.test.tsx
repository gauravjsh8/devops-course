import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import HomePage from "../pages/HomePage";

describe("HomePage", () => {
  it("shows the welcome title and the main buttons", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Welcome to Our Hotel")).toBeInTheDocument();
    expect(screen.getByText("Find a room")).toHaveAttribute("href", "/rooms");
    expect(screen.getByText("Create an account")).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
