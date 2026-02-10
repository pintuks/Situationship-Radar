import React, { createContext, useContext, useMemo, useState } from 'react';
import ShareCardModal from './components/ShareCardModal';

const ToastContext = createContext({ showToast: () => {} });

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const value = useMemo(
    () => ({
      showToast: (message) => {
        setToast(message);
        window.clearTimeout(window.__toastTimeoutId);
        window.__toastTimeoutId = window.setTimeout(() => {
          setToast(null);
        }, 1800);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className="pointer-events-none fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-slate-900/95 px-4 py-2 text-sm font-medium text-white shadow-xl"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function useToast() {
  return useContext(ToastContext);
}

const MEME_LABELS = {
  soft: 'Confusing Vibes',
  spicy: 'CEO of Delulu',
};

const REGENERATE_OPTIONS = [
  'More savage',
  'More wholesome',
  'Shorter replies',
  'New jokes',
];

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton-line h-4 w-3/4" />
      <div className="skeleton-line h-4 w-full" />
      <div className="skeleton-line h-4 w-5/6" />
    </div>
  );
}

function RadarContent() {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [officeSafe, setOfficeSafe] = useState(false);
  const [results, setResults] = useState(null);
  const [shareFormat, setShareFormat] = useState('story');
  const [shareOpen, setShareOpen] = useState(false);

  const scoreLabel =
    results?.label || (officeSafe ? MEME_LABELS.soft : MEME_LABELS.spicy);

  const runGenerate = async (styleHint = '') => {
    if (!text.trim()) {
      showToast('Add chat context first');
      return;
    }

    const isRegen = Boolean(styleHint && results);
    if (isRegen) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          officeSafe,
          styleHint: styleHint || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not generate results');
      }

      const data = await response.json();

      setResults({
        score: data.score ?? 72,
        label:
          data.label ||
          (officeSafe ? 'Confusing Vibes' : 'Situationship Shenanigans'),
        memeInsights:
          data.memeInsights ||
          (officeSafe
            ? ['Mixed signals detected.', 'Keep boundaries clear.']
            : ['They text like a part-time poet.', 'Breadcrumb energy: activated.']),
        replySuggestions:
          data.replySuggestions ||
          (officeSafe
            ? [
                'I enjoy chatting, but I value consistency.',
                'Can we align on what we both want?',
              ]
            : [
                'You are giving trailer vibes, where is the full movie?',
                'Are we flirting or doing improv right now?',
              ]),
      });
    } catch (error) {
      showToast('Generation failed. Try again.');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const copyCaption = async () => {
    if (!results) {
      showToast('Generate results first');
      return;
    }

    const caption = `Situationship Radar: ${results.score}/100 — ${scoreLabel}. #SituationshipRadar`;
    try {
      await navigator.clipboard.writeText(caption);
      showToast('Copied');
    } catch {
      showToast('Copy failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-6">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Situationship Radar</h1>
        <p className="mt-2 text-sm text-slate-300">
          Decode the chaos with playful insights and share-ready scores.
        </p>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
          <label htmlFor="input" className="mb-2 block text-sm font-semibold text-slate-200">
            Paste your convo
          </label>
          <textarea
            id="input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-32 w-full rounded-xl border border-white/15 bg-slate-950/70 p-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            placeholder="Drop chat snippets..."
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => runGenerate()}
              disabled={loading}
              className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-cyan-200 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
              aria-label="Generate relationship analysis"
            >
              {loading ? 'Analyzing…' : 'Analyze / Generate'}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-slate-900/70 px-3 py-1.5 text-sm focus-within:ring-2 focus-within:ring-cyan-300">
              <input
                type="checkbox"
                checked={officeSafe}
                onChange={(event) => setOfficeSafe(event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
                aria-label="Toggle office safe mode"
              />
              <span>Office-safe</span>
            </label>
            <span className="text-xs text-slate-400">
              {officeSafe
                ? 'Softer labels and low-drama wording.'
                : 'Meme mode enabled: spicy but not hateful.'}
            </span>
          </div>
        </section>

        {results && (
          <div className="mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-[300px_1fr] md:gap-6">
            <aside className="md:sticky md:top-6">
              <div className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:rounded-2xl md:border md:bg-white/5 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Radar score</p>
                    <p className="text-4xl font-black leading-none">{results.score}</p>
                    <p className="mt-1 text-sm text-slate-300">{scoreLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:hidden"
                    aria-label="Open share options"
                  >
                    Share
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Share</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShareFormat('story');
                        setShareOpen(true);
                      }}
                      className="rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      aria-label="Open story share format"
                    >
                      Story 1080×1920
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShareFormat('square');
                        setShareOpen(true);
                      }}
                      className="rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      aria-label="Open square share format"
                    >
                      Square 1080×1080
                    </button>
                    <button
                      type="button"
                      onClick={copyCaption}
                      className="rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-2.5 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      aria-label="Copy share caption"
                    >
                      Copy caption
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <section className="space-y-5 pt-2 md:pt-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-lg font-bold">Meme Insights {officeSafe ? '🙂' : '🔥'}</h2>
                <div className="mt-3">
                  {regenerating ? (
                    <LoadingSkeleton />
                  ) : (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
                      {results.memeInsights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-lg font-bold">Reply Suggestions {officeSafe ? '💬' : '😏'}</h2>
                <div className="mt-3">
                  {regenerating ? (
                    <LoadingSkeleton />
                  ) : (
                    <ul className="space-y-2 text-sm text-slate-200">
                      {results.replySuggestions.map((item) => (
                        <li key={item} className="rounded-lg bg-slate-900/70 p-2.5">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Regenerate
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {REGENERATE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => runGenerate(option)}
                      disabled={regenerating}
                      className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      aria-label={`Regenerate with style: ${option}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <ShareCardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        format={shareFormat}
        score={results?.score}
        label={scoreLabel}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <RadarContent />
    </ToastProvider>
  );
}
