import type { RoommateMatch } from '../../types/roommate';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { formatCurrency, getInitials } from '../../utils/format';
import {
  CLEANLINESS_LABELS,
  FOOD_PREFERENCE_LABELS,
  SLEEP_SCHEDULE_LABELS,
  SMOKING_LABELS,
} from '../../utils/labels';

export interface RoommateCardProps {
  match: RoommateMatch;
}

function scoreTone(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'neutral';
}

export function RoommateCard({ match }: RoommateCardProps) {
  const { profile, score, factors } = match;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
        >
          {getInitials(profile.name)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{profile.name}</h2>
            <Badge tone={scoreTone(score)}>{score}% compatible</Badge>
          </div>
          <p className="mt-0.5 text-sm text-slate-600">
            {profile.occupation}
            {profile.institute ? ` · ${profile.institute}` : ''}
          </p>
          <p className="text-sm text-slate-500">
            {profile.city} · {profile.preferredLocalities.slice(0, 2).join(', ')}
            {profile.preferredLocalities.length > 2 ? '…' : ''}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">
          Budget {formatCurrency(profile.budgetMin)} – {formatCurrency(profile.budgetMax)} / month
        </p>
        <p className="mt-1 text-xs text-slate-500">Moving in from {profile.moveInFrom}</p>
      </div>

      <ul className="flex flex-wrap gap-1.5 text-xs text-slate-600">
        <li className="rounded bg-slate-100 px-2 py-0.5">
          {FOOD_PREFERENCE_LABELS[profile.foodPreference]}
        </li>
        <li className="rounded bg-slate-100 px-2 py-0.5">
          {SLEEP_SCHEDULE_LABELS[profile.sleepSchedule]}
        </li>
        <li className="rounded bg-slate-100 px-2 py-0.5">
          {CLEANLINESS_LABELS[profile.cleanliness]}
        </li>
        <li className="rounded bg-slate-100 px-2 py-0.5">{SMOKING_LABELS[profile.smoking]}</li>
        {profile.petsFriendly && <li className="rounded bg-slate-100 px-2 py-0.5">Pet friendly</li>}
      </ul>

      <p className="text-sm text-slate-600">{profile.bio}</p>

      <div>
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Why this score
        </h3>
        <dl className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-slate-600 sm:grid-cols-3">
          {factors.map((factor) => (
            <div key={factor.label} className="flex items-center gap-1.5">
              <dt className="text-slate-500">{factor.label}</dt>
              <dd>
                <span
                  className={
                    factor.match === 'FULL'
                      ? 'text-emerald-700'
                      : factor.match === 'PARTIAL'
                        ? 'text-amber-700'
                        : 'text-slate-400'
                  }
                >
                  {factor.match === 'FULL' ? '✓' : factor.match === 'PARTIAL' ? '~' : '—'}
                </span>
                <span className="sr-only">
                  {factor.match === 'FULL'
                    ? 'strong match'
                    : factor.match === 'PARTIAL'
                      ? 'partial match'
                      : 'no match'}
                </span>
                <span className="ml-1 text-slate-500">{factor.score}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        Compatibility scores are sample values. The explainable matching algorithm and roommate
        requests arrive in Milestones 11 and 12.
      </p>
    </Card>
  );
}
