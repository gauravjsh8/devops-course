# Authentication setup

Set `JWT_SECRET` in the backend environment to a private random value of at least
32 characters. For local development, generate one with:

```sh
openssl rand -hex 32
```

Put the result in the ignored `backend/.env` file. Never commit that value.

Public registration at `POST /api/auth/register` always creates a `customer`;
the submitted role is ignored. Login returns a bearer token that expires after
one hour. Send it as `Authorization: Bearer <token>` to protected endpoints.
`POST /api/auth/logout` revokes all currently issued tokens for that account.

Room creation, updates, and archival require an authenticated `receptionist` or
`administrator`. Room reads are public. To archive a room, use
`DELETE /api/rooms/:id`; records are retained in the database with
`isActive: false`.

## Create or update staff accounts

There is deliberately no public staff-registration endpoint. Create staff
accounts using one of the provided scripts:

- macOS/Linux administrator: `backend/scripts/createAdmin.sh`
- macOS/Linux receptionist: `backend/scripts/createReceptionist.sh`
- Windows administrator: `backend/scripts/createAdmin.bat`
- Windows receptionist: `backend/scripts/createReceptionist.bat`

On macOS/Linux, make the script executable once if needed:

```sh
chmod +x backend/scripts/createAdmin.sh
chmod +x backend/scripts/createReceptionist.sh
```

Edit `STAFF_NAME`, `STAFF_EMAIL`, and `STAFF_PASSWORD` near the top of the
selected script. The password must contain at least 8 characters. The scripts
automatically use the `MONGO_URI` configured in `backend/.env`, so ensure that
URI matches the database used by the backend server.

Run the script from any directory:

```sh
backend/scripts/createAdmin.sh
```

On Windows, run the corresponding `.bat` file.

Running a script again with the same `STAFF_EMAIL` updates that existing staff
account's name, password, and role. It does not create another account.
Changing `STAFF_EMAIL` identifies a new account and will create it. The script
uses the normal user model, so passwords are hashed before storage.

Do not commit real staff credentials or the `backend/.env` file.
