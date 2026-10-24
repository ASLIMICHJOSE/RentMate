import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoommateMatch } from '../../types/roommate';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { TextArea } from '../ui/TextArea';
import { AppStore } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, getInitials } from '../../utils/format';
import {
  CLEANLINESS_LABELS,
  FOOD_PREFERENCE_LABELS,
  SLEEP_SCHEDULE_LABELS,
  SMOKING_LABELS,
} from '../../utils/labels';

export interface RoommateCardProps {
  match: RoommateMatch;
  onRequestSent?: () => void;
}

function scoreTone(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'neutral';
}

export function RoommateCard({ match, onRequestSent }: RoommateCardProps) {
  const { profile, score, factors } = match;
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestNote, setRequestNote] = useState(
    `Hey ${profile.name.split(' ')[0]}! Our lifestyles and budget match up nicely (${score}%). Are you interested in finding a place together?`,
  );
  const [hasRequested, setHasRequested] = useState(false);

  function handleSendRequest(e: React.FormEvent) {
    e.preventDefault();
    AppStore.sendRoommateRequest({
      senderId: user?.id ?? 'user-101',
      senderName: user?.name ?? 'Aditya Sharma',
      senderCity: user?.profile?.city ?? 'Chennai',
      senderOccupation: user?.profile?.occupation ?? 'Student',
      receiverId: profile.userId,
      receiverName: profile.name,
      compatibilityScore: score,
      note: requestNote,
    });

    setHasRequested(true);
    setIsRequestModalOpen(false);
    showToast({
      variant: 'success',
      title: 'Roommate request sent!',
      description: `${profile.name} will be notified. You can track this in Requests.`,
    });
    onRequestSent?.();
  }

  function handleOpenChat() {
    const conv = AppStore.getOrCreateConversation({
      id: profile.userId,
      name: profile.name,
      role: 'Student',
      avatarUrl: profile.avatarUrl,
    });
    showToast({
      variant: 'success',
      title: `Chat opened with ${profile.name}`,
    });
    navigate('/messages', { state: { activeConversationId: conv.id } });
  }

  return (
    <>
      <Card className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-700 text-base font-bold text-white shadow-md shadow-brand-500/20"
          >
            {getInitials(profile.name)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <h2 className="font-heading text-lg font-bold text-slate-900">{profile.name}</h2>
              <Badge tone={scoreTone(score)} className="font-extrabold text-xs px-2.5 py-0.5 shadow-xs">
                {score}% Match
              </Badge>
            </div>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              {profile.occupation}
              {profile.institute ? ` · ${profile.institute}` : ''}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>📍</span> {profile.city} · {profile.preferredLocalities.slice(0, 2).join(', ')}
              {profile.preferredLocalities.length > 2 ? '…' : ''}
            </p>
          </div>
        </div>

        {/* Budget & Move-in */}
        <div className="rounded-xl bg-slate-50 p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Target Budget</p>
            <p className="text-sm font-extrabold text-slate-900">
              {formatCurrency(profile.budgetMin)} – {formatCurrency(profile.budgetMax)}
              <span className="text-xs font-normal text-slate-500"> / mo</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Move-in date</p>
            <p className="text-xs font-semibold text-brand-700">{profile.moveInFrom}</p>
          </div>
        </div>

        {/* Routine Badges */}
        <ul className="flex flex-wrap gap-1.5 text-xs text-slate-700">
          <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium">
            🍱 {FOOD_PREFERENCE_LABELS[profile.foodPreference]}
          </li>
          <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium">
            ⏰ {SLEEP_SCHEDULE_LABELS[profile.sleepSchedule]}
          </li>
          <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium">
            ✨ {CLEANLINESS_LABELS[profile.cleanliness]}
          </li>
          <li className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium">
            🚭 {SMOKING_LABELS[profile.smoking]}
          </li>
          {profile.petsFriendly && (
            <li className="rounded-md bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[11px] font-medium">
              🐾 Pet Friendly
            </li>
          )}
        </ul>

        {/* Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
          "{profile.bio}"
        </p>

        {/* Compatibility Factor Breakdown */}
        <div className="border-t border-slate-100 pt-3">
          <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Compatibility Breakdown
          </h3>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
            {factors.map((factor) => (
              <div key={factor.label} className="rounded-lg bg-slate-50 p-1.5 text-center">
                <dt className="text-[10px] font-medium text-slate-500">{factor.label}</dt>
                <dd className="font-bold text-slate-800 text-xs mt-0.5">
                  <span
                    className={
                      factor.score >= 85
                        ? 'text-emerald-600'
                        : factor.score >= 65
                          ? 'text-amber-600'
                          : 'text-slate-400'
                    }
                  >
                    {factor.score}%
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
          <Button
            size="sm"
            fullWidth
            onClick={() => setIsRequestModalOpen(true)}
            disabled={hasRequested}
            className="font-bold text-xs"
          >
            {hasRequested ? '✓ Request Sent' : '🤝 Connect'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenChat}
            className="font-semibold text-xs shrink-0"
          >
            💬 Chat
          </Button>
        </div>
      </Card>

      {/* Connect Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Connect with ${profile.name}`}
        description={`Send a roommate invitation. You have a ${score}% compatibility match!`}
      >
        <form onSubmit={handleSendRequest} className="flex flex-col gap-4 mt-2">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">Compatibility Highlights:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Budget overlap: {formatCurrency(profile.budgetMin)} - {formatCurrency(profile.budgetMax)}</li>
              <li>Location: {profile.city} ({profile.preferredLocalities.join(', ')})</li>
              <li>Habits: {FOOD_PREFERENCE_LABELS[profile.foodPreference]}, {SLEEP_SCHEDULE_LABELS[profile.sleepSchedule]}</li>
            </ul>
          </div>

          <FormField id="request-note" label="Personal Message" required>
            {(field) => (
              <TextArea
                {...field}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                rows={3}
                required
              />
            )}
          </FormField>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
