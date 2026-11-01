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

## Create the initial staff account

There is deliberately no public staff-registration endpoint. Start MongoDB and
the configured database, then from `backend/` enter the staff details into the
current terminal session and run the one-time setup script:

```sh
export STAFF_NAME="Hotel Administrator"
export STAFF_EMAIL="admin@example.com"
export STAFF_ROLE="administrator"
read -s STAFF_PASSWORD
export STAFF_PASSWORD
npx tsx scripts/createStaffUser.ts
unset STAFF_PASSWORD STAFF_NAME STAFF_EMAIL STAFF_ROLE
```

Enter a password of at least 8 characters when prompted. Use
`STAFF_ROLE=receptionist` to create a receptionist instead. The script uses the
normal user model, so the password is hashed before it is stored. Do not place
staff credentials in a committed file.
