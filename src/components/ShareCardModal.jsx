import React from 'react';

const SIZE_MAP = {
  story: {
    label: 'Story 1080×1920',
    className: 'w-[270px] h-[480px]',
  },
  square: {
    label: 'Square 1080×1080',
    className: 'w-[320px] h-[320px]',
  },
};

export default function ShareCardModal({
  open,
  onClose,
  format = 'story',
  score,
  label,
}) {
  if (!open) {
    return null;
  }

  const selected = SIZE_MAP[format] || SIZE_MAP.story;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share card preview"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900 p-5 text-slate-100 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">{selected.label}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label="Close share preview"
          >
            ✕
          </button>
        </div>

        <div
          className={`mx-auto overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500 p-5 ${selected.className}`}
        >
          <div className="flex h-full flex-col justify-between rounded-xl bg-black/25 p-4 backdrop-blur-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">Situationship Radar</p>
              <p className="mt-3 text-5xl font-black leading-none">{score ?? '--'}</p>
              <p className="text-sm text-white/80">out of 100</p>
            </div>
            <p className="text-lg font-semibold">{label || 'Reading the vibes...'}</p>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          aria-label="Download share card"
        >
          Download
        </button>
      </div>
    </div>
  );
}
