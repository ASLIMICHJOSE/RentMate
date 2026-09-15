import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

/**
 * Application routes.
 *
 * Milestone 1 only wires the landing page. Feature pages are added in later
 * milestones so each route can be implemented and tested incrementally.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="*"
        element={
          <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">404</p>
            <h1 className="text-2xl font-bold">This page does not exist yet</h1>
            <p className="text-slate-600">
              The route you requested is not part of the current milestone.
            </p>
            <Link
              to="/"
              className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700"
            >
              Back to home
            </Link>
          </main>
        }
      />
    </Routes>
  );
}
