import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function authHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (error.code === "ERR_NETWORK") return "Cannot reach the server";
  }
  return "Something went wrong";
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout", {}, authHeader()),
};

export const roomApi = {
  list: () => api.get("/rooms"),
  get: (id: string) => api.get(`/rooms/${id}`),
  search: (checkIn: string, checkOut: string, guests: number) =>
    api.get("/rooms/available", {
      params: { checkIn, checkOut, guests },
    }),
};

export const reservationApi = {
  create: (
    roomId: string,
    checkIn: string,
    checkOut: string,
    guestCount: number,
    guest?: { name: string; email: string },
  ) =>
    api.post(
      "/reservations",
      {
        roomId,
        checkIn,
        checkOut,
        guestCount,
        guestName: guest?.name,
        guestEmail: guest?.email,
      },
      authHeader(),
    ),
  my: () => api.get("/reservations/my", authHeader()),
  update: (id: string, changes: object) =>
    api.put(`/reservations/${id}`, changes, authHeader()),
  cancel: (id: string) =>
    api.patch(`/reservations/${id}/cancel`, {}, authHeader()),
};
