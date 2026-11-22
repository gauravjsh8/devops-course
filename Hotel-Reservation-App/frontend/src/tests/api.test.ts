import { describe, expect, it } from "vitest";
import axios, { AxiosHeaders } from "axios";
import { getErrorMessage } from "../api";

describe("API helpers", () => {
  it("returns the readable server message", () => {
    const error = new axios.AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: { message: "Room is already booked" },
        status: 409,
        statusText: "Conflict",
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      },
    );

    expect(getErrorMessage(error)).toBe("Room is already booked");
  });

  it("returns a network error message", () => {
    const error = new axios.AxiosError(
      "Network Error",
      "ERR_NETWORK",
    );

    expect(getErrorMessage(error)).toBe("Cannot reach the server");
  });
});
