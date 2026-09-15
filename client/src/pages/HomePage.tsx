import { useEffect, useState } from 'react';
import { ApiRequestError } from '../services/http';
import { fetchHealth, type HealthPayload } from '../services/health.service';

type Status = 'loading' | 'online' | 'offline';

/**
 * Milestone 1 landing page.
 *
 * Its only job right now is to prove the client, the dev proxy and the Express
 * API are wired together. Real discovery UI lands in later milestones.
 */
export default function HomePage() {
  const [status, setStatus] = useState<Status>('loading');
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // `ignore` prevents a late response from updating an unmounted component
    // (and keeps React StrictMode's double-invoke harmless).
    let ignore = false;

    fetchHealth()
      .then((payload) => {
        if (ignore) return;
        setHealth(payload);
        setError(null);
        setStatus('online');
      })
      .catch((caught: unknown) => {
        if (ignore) return;
        setHealth(null);
        setError(caught instanceof ApiRequestError ? caught.message : 'Unexpected error');
        setStatus('offline');
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function handleRetry(): void {
    setStatus('loading');
    setError(null);
    setAttempt((current) => current + 1);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
          Milestone 1 &middot; Project foundation
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">RentMate</h1>
        <p className="text-lg text-slate-600">
          Student rentals, compatible roommates and everything owners need to manage listings.
        </p>
      </header>

      <section
        aria-labelledby="api-status-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="api-status-heading" className="text-lg font-semibold">
          API status
        </h2>

        <div aria-live="polite" className="mt-4">
          {status === 'loading' && (
            <p className="flex items-center gap-3 text-slate-600">
              <span aria-hidden="true" className="size-3 animate-pulse rounded-full bg-brand-500" />
              Checking <code className="rounded bg-slate-100 px-1.5 py-0.5">GET /api/health</code>…
            </p>
          )}

          {status === 'online' && health && (
            <div className="space-y-2">
              <p className="flex items-center gap-3 font-medium text-emerald-700">
                <span aria-hidden="true" className="size-3 rounded-full bg-emerald-500" />
                Server online
              </p>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt className="font-medium text-slate-500">Service</dt>
                  <dd>{health.service}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium text-slate-500">Environment</dt>
                  <dd>{health.environment}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium text-slate-500">Uptime</dt>
                  <dd>{health.uptimeSeconds}s</dd>
                </div>
              </dl>
            </div>
          )}

          {status === 'offline' && (
            <div className="space-y-3">
              <p className="flex items-center gap-3 font-medium text-red-700">
                <span aria-hidden="true" className="size-3 rounded-full bg-red-500" />
                Server unreachable
              </p>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleRetry}
          disabled={status === 'loading'}
          className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Re-check API
        </button>
      </section>

      <p className="text-sm text-slate-500">
        Next up: Milestone 2 &mdash; frontend foundation (layout, components and routed pages with
        mock data).
      </p>
    </main>
  );
}
