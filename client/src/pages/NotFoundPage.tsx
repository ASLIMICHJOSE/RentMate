import { Link, useLocation } from 'react-router-dom';
import { buttonStyles } from '../components/ui/buttonStyles';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">404</p>
      <h1 className="text-2xl font-bold text-slate-900">We couldn’t find that page</h1>
      <p className="text-sm text-slate-600">
        Nothing matches{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5">{location.pathname}</code>. The page
        may have moved, or the feature may arrive in a later milestone.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonStyles()}>
          Back to home
        </Link>
        <Link to="/properties" className={buttonStyles({ variant: 'outline' })}>
          Browse properties
        </Link>
      </div>
    </div>
  );
}
