import { Link } from "react-router";

const roomTypes = [
  {
    name: "Single",
    text: "A quiet room for one guest. Perfect for business trips.",
  },
  {
    name: "Double",
    text: "A comfortable room with a double bed for two guests.",
  },
  {
    name: "Suite",
    text: "Extra space with a living area for a relaxing stay.",
  },
  { name: "Family", text: "Room for the whole family, with several beds." },
];

const features = [
  {
    title: "Easy booking",
    text: "Choose your dates, pick a room and book in a few clicks.",
  },
  {
    title: "Clear prices",
    text: "You see the total price for your stay before you book.",
  },
  {
    title: "Manage online",
    text: "Change or cancel your booking anytime from your account.",
  },
];

const steps = [
  {
    number: "1",
    title: "Search",
    text: "Pick your check-in and check-out dates and the number of guests.",
  },
  {
    number: "2",
    title: "Choose",
    text: "Compare the free rooms and their total price.",
  },
  {
    number: "3",
    title: "Book",
    text: "Confirm your booking and get your reservation number.",
  },
];

function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 px-8 py-16 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold md:text-5xl">Welcome to Our Hotel</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
          Comfortable rooms, fair prices and simple online booking. Find the
          right room for your stay today.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/rooms"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Find a room
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-blue-600"
          >
            Create an account
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
          Why book with us
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-blue-700">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
          Our rooms
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roomTypes.map((room) => (
            <div
              key={room.name}
              className="rounded-xl border-t-4 border-blue-600 bg-white p-6 shadow"
            >
              <h3 className="text-lg font-semibold text-slate-800">
                {room.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{room.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">
          How it works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/rooms"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Start searching
          </Link>
        </div>
      </section>

      <footer className="pb-4 text-center text-sm text-gray-500">
        © 2026 Hotel Reservation System · VAMK DevOps project
      </footer>
    </div>
  );
}

export default HomePage;
