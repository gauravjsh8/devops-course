import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <p className="text-7xl font-bold text-blue-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Page not found
        </h1>
        <p className="mt-2 text-slate-500">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Back to home
          </Link>
          <Link
            to="/rooms"
            className="rounded-lg border border-blue-600 px-5 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
          >
            See rooms
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
