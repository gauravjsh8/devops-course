# Hotel Reservation App

## Run with Docker Compose

Copy `.env.example` to `.env` and replace `JWT_SECRET` with a random value of
at least 32 characters. Then build and start the frontend, backend, and
MongoDB:

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). The frontend image serves
the React application. Nginx forwards `/api` and `/uploads` requests to the
backend over Compose's private network. MongoDB data and uploaded room photos
persist in named volumes.

Use `docker compose up --build -d` to run in the background, and
`docker compose logs -f` to view logs.

Public registration creates customer accounts. To create or update an
administrator account for room management, run this once with local
credentials:

```sh
docker compose exec \
  -e STAFF_NAME="Hotel Administrator" \
  -e STAFF_EMAIL="admin@example.com" \
  -e STAFF_PASSWORD="replace-with-a-local-password" \
  -e STAFF_ROLE=administrator \
  backend node dist/createStaffUser.js
```

Stop and remove containers with `docker compose down`; named volumes are
preserved. Use `docker compose down -v` to also delete the database and
uploaded photos.

For source hot reload, run `npm run dev` in `frontend/` and `backend/` as
described in their package scripts. The frontend `.env` should point
`VITE_API_URL` at `http://localhost:3000/api`.
