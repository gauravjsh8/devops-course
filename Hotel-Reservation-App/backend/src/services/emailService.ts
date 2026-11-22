import nodemailer from "nodemailer";

interface ConfirmationDetails {
  email: string;
  name: string;
  reservationNumber: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

export async function sendReservationConfirmation(
  details: ConfirmationDetails,
): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.info(
      `SMTP is not configured; confirmation would be sent to ${details.email}`,
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to: details.email,
    subject: `Reservation confirmed: ${details.reservationNumber}`,
    text:
      `Hello ${details.name},\n\n` +
      `Your reservation ${details.reservationNumber} is confirmed.\n` +
      `Room: ${details.roomNumber}\n` +
      `Check-in: ${details.checkIn.toISOString().slice(0, 10)}\n` +
      `Check-out: ${details.checkOut.toISOString().slice(0, 10)}\n` +
      `Total: ${details.totalPrice} EUR\n`,
  });
  return true;
}
