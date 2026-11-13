import { Link } from "react-router";
import type { User } from "../types";

interface Props {
  user: User | null;
  onLogout: () => void;
}

function Navbar({ user, onLogout }: Props) {
  return (
    <nav className="sticky top-0 z-10 flex flex-wrap items-center gap-2 bg-white px-6 py-3 shadow-sm">
      <Link to="/" className="mr-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          H
        </span>
        <span className="text-lg font-bold text-slate-800">
          Hotel Reservation
        </span>
      </Link>

      <Link
        to="/rooms"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        Rooms
      </Link>

      {user?.role === "customer" && (
        <Link
          to="/my-reservations"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          My reservations
        </Link>
      )}

      {(user?.role === "receptionist" || user?.role === "administrator") && (
        <Link
          to="/reservations"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          All reservations
        </Link>
      )}

      {user?.role === "administrator" && (
        <>
          <Link
            to="/admin/rooms"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Manage rooms
          </Link>
          <Link
            to="/admin/statistics"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Statistics
          </Link>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-slate-800">
                {user.name}
              </span>
              <span className="block capitalize text-slate-500">
                {user.role}
              </span>
            </span>
            <button
              onClick={onLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
