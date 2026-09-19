type ErrorPopupProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  return (
    <div className="fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:top-6">
      <div
        role="alertdialog"
        aria-live="assertive"
        aria-labelledby="download-error-title"
        className="w-full max-w-md border-2 border-black bg-white shadow-[6px_6px_0_#000]"
      >
        <div className="flex items-start justify-between gap-4 border-b-2 border-black bg-pink px-4 py-3 text-white">
          <div>
            <p
              id="download-error-title"
              className="font-syne text-2xl font-black leading-none"
            >
              Download Failed
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/90">
              Try another TikTok link or retry the request.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close error popup"
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-white text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            {"\u2715"}
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-sm font-bold leading-7 text-[var(--black)]">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="btn-brutal mt-4 bg-lime px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
