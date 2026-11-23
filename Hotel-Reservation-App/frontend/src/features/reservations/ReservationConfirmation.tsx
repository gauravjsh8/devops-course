interface Props {
  reservationNumber: string;
  status: string;
  email: string;
  emailSent: boolean;
  onClose: () => void;
}

export default function ReservationConfirmation({
  reservationNumber,
  status,
  email,
  emailSent,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl" role="alertdialog" aria-modal="true">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">✓</div>
        <h2 className="mt-3 text-xl font-bold text-slate-800">Reservation confirmed</h2>
        <p className="mt-2 text-sm text-slate-600">Reservation number</p>
        <p className="font-mono font-bold text-slate-900">{reservationNumber}</p>
        <p className="mt-2 text-sm">Status: <span className="font-semibold capitalize">{status}</span></p>
        <p className="mt-3 text-sm text-slate-600">
          {emailSent ? `Confirmation sent to ${email}` : `A confirmation summary is available for ${email}`}
        </p>
        <button onClick={onClose} className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white">Close</button>
      </div>
    </div>
  );
}
