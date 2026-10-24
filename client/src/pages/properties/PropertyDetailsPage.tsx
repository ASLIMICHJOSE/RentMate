import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PropertyGallery } from '../../components/property/PropertyGallery';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { Card, CardHeader } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { fetchPropertyById } from '../../data/mockApi';
import { AppStore, type PropertyReview } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ApiRequestError } from '../../services/http';
import type { Property } from '../../types/property';
import { formatCurrency, formatDate, getInitials } from '../../utils/format';
import { AMENITY_LABELS, PROPERTY_TYPE_LABELS } from '../../utils/labels';

interface DetailState {
  status: 'loading' | 'ready' | 'error';
  property?: Property;
  error?: string;
  errorCode?: string;
}

export default function PropertyDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [state, setState] = useState<DetailState>({ status: 'loading' });
  const [isSaved, setIsSaved] = useState(false);
  const [reviews, setReviews] = useState<PropertyReview[]>([]);

  // Modals state
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [visitSlot, setVisitSlot] = useState<'Morning (9 AM - 12 PM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (5 PM - 8 PM)'>('Morning (9 AM - 12 PM)');
  const [visitPhone, setVisitPhone] = useState('+91 98412 34567');
  const [visitNote, setVisitNote] = useState('');
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    let ignore = false;

    fetchPropertyById(id)
      .then((property) => {
        if (ignore) return;
        setState({ status: 'ready', property });
        setIsSaved(AppStore.isPropertySaved(property.id));
        setReviews(AppStore.getPropertyReviews(property.id));
      })
      .catch((caught: unknown) => {
        if (ignore) return;
        setState({
          status: 'error',
          error:
            caught instanceof ApiRequestError
              ? caught.message
              : 'We could not load this property right now.',
          errorCode: caught instanceof ApiRequestError ? caught.code : undefined,
        });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  function handleToggleSave() {
    if (!state.property) return;
    const nextSaved = AppStore.toggleSave(state.property.id);
    setIsSaved(nextSaved);
    showToast({
      variant: 'success',
      title: nextSaved ? 'Added to saved properties' : 'Removed from saved',
      description: nextSaved
        ? 'You can review this anytime in your dashboard.'
        : 'Listing unshortlisted.',
    });
  }

  function handleContactOwner() {
    if (!state.property) return;
    const conv = AppStore.getOrCreateConversation(
      {
        id: state.property.owner.id,
        name: state.property.owner.name,
        role: 'Owner',
        avatarUrl: state.property.owner.avatarUrl,
      },
      state.property,
    );
    showToast({
      variant: 'success',
      title: `Chat opened with ${state.property.owner.name}`,
    });
    navigate('/messages', { state: { activeConversationId: conv.id } });
  }

  function handleScheduleVisit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.property) return;
    setIsSubmittingVisit(true);

    setTimeout(() => {
      AppStore.createVisit({
        propertyId: state.property!.id,
        propertyTitle: state.property!.title,
        propertyAddress: state.property!.address,
        propertyCity: state.property!.city,
        propertyImage: state.property!.images[0]?.imageUrl ?? '',
        rent: state.property!.rent,
        ownerId: state.property!.owner.id,
        ownerName: state.property!.owner.name,
        studentId: user?.id ?? 'user-101',
        studentName: user?.name ?? 'Aditya Sharma',
        studentEmail: user?.email ?? 'aditya.student@rentmate.dev',
        studentPhone: visitPhone,
        preferredDate: visitDate,
        preferredSlot: visitSlot,
        note: visitNote,
      });

      setIsSubmittingVisit(false);
      setIsVisitModalOpen(false);
      showToast({
        variant: 'success',
        title: 'Visit request submitted!',
        description: `Owner ${state.property!.owner.name} will confirm your slot shortly. Track it in Requests.`,
      });
    }, 400);
  }

  function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!state.property || !reviewComment.trim()) return;

    const newRev = AppStore.addReview({
      propertyId: state.property.id,
      authorId: user?.id ?? 'user-101',
      authorName: user?.name ?? 'Aditya Sharma',
      rating: reviewRating,
      title: reviewTitle.trim() || 'Verified Student Review',
      comment: reviewComment.trim(),
      verified: true,
    });

    setReviews([newRev, ...reviews]);
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    showToast({
      variant: 'success',
      title: 'Review submitted',
      description: 'Thank you for helping fellow students make informed housing choices!',
    });
  }

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <LoadingState message="Loading property details…" />
      </div>
    );
  }

  if (state.status === 'error' || !state.property) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-16 sm:px-6">
        <ErrorState
          title="Property unavailable"
          message={state.error ?? 'This property could not be found.'}
          code={state.errorCode}
        />
        <Link to="/properties" className={buttonStyles({ variant: 'outline' })}>
          Back to all properties
        </Link>
      </div>
    );
  }

  const property = state.property;

  const facts = [
    { label: 'Property type', value: PROPERTY_TYPE_LABELS[property.propertyType] },
    { label: 'Bedrooms', value: `${property.bedrooms} BHK` },
    { label: 'Bathrooms', value: `${property.bathrooms} Bath` },
    { label: 'Furnishing', value: property.furnished ? 'Fully Furnished' : 'Unfurnished' },
    { label: 'Area', value: property.areaSqft ? `${property.areaSqft} sq ft` : 'Spacious Layout' },
    { label: 'Available from', value: formatDate(property.availableFrom) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-slate-500">
          <li>
            <Link to="/" className="rounded hover:text-brand-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/properties" className="rounded hover:text-brand-700">
              Properties
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/properties?city=${encodeURIComponent(property.city)}`} className="rounded hover:text-brand-700">
              {property.city}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-900">{property.locality}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand" className="font-semibold">{PROPERTY_TYPE_LABELS[property.propertyType]}</Badge>
              {property.furnished && <Badge tone="neutral">Furnished</Badge>}
              <Badge tone="success">Verified Listing</Badge>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 text-base text-slate-600 flex items-center gap-1">
              <span>📍</span> {property.address} · <span className="font-medium text-slate-900">{property.city}</span>
            </p>
          </div>

          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <h2 className="font-heading text-xl font-bold text-slate-900">About this place</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {property.description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50/80 p-4 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-slate-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <h2 className="font-heading text-xl font-bold text-slate-900">Amenities & Perks</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-3">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 font-medium">
                  <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700 font-bold">
                    ✓
                  </span>
                  {AMENITY_LABELS[amenity]}
                </li>
              ))}
            </ul>
          </Card>

          {/* Interactive Reviews Section */}
          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900">Student Reviews</h2>
                <p className="text-xs text-slate-500">
                  {reviews.length} authentic {reviews.length === 1 ? 'review' : 'reviews'} from students and visitors
                </p>
              </div>
              <Button size="sm" onClick={() => setIsReviewModalOpen(true)}>
                ✍️ Write a review
              </Button>
            </div>

            {reviews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-sm">No reviews yet for this listing. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {reviews.map((rev) => (
                  <li key={rev.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                          {getInitials(rev.authorName)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{rev.authorName}</p>
                          <p className="text-[11px] text-slate-500">{formatDate(rev.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-sm font-bold">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>
                    {rev.title && <h3 className="mt-2 text-sm font-semibold text-slate-900">{rev.title}</h3>}
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right Sticky Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="rounded-2xl border-slate-200/80 shadow-lg shadow-slate-200/40 p-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="font-heading text-3xl font-extrabold text-slate-900">
                  {formatCurrency(property.rent)}
                </p>
                <p className="text-xs text-slate-500 font-medium">per month · utilities included</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium uppercase">Security Deposit</p>
                <p className="text-sm font-bold text-slate-800">{formatCurrency(property.deposit)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                fullWidth
                onClick={() => setIsVisitModalOpen(true)}
                className="shadow-md shadow-brand-500/20 font-bold"
              >
                📅 Request a visit
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleContactOwner}
                className="font-semibold"
              >
                💬 Contact owner
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleToggleSave}
                className="text-slate-600 hover:text-slate-900"
              >
                {isSaved ? '❤️ Remove from saved' : '🤍 Save property'}
              </Button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">⚡ RentMate Guarantee</p>
              <p>Direct contact with verified owners. Zero broker commission, physical inspection before any commitment.</p>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 shadow-xs p-5">
            <h2 className="font-heading text-sm font-bold tracking-wide text-slate-500 uppercase">
              Property Owner
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
              >
                {getInitials(property.owner.name)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{property.owner.name}</p>
                <p className="text-xs text-slate-500">
                  Member since {formatDate(property.owner.memberSince)}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800 flex items-center gap-2">
              <span>🛡️</span> {property.owner.verified ? 'Identity & Property Verified' : 'Standard Verification'}
            </div>
            {property.owner.phone && (
              <p className="mt-2 text-xs text-slate-600">
                Direct phone: <span className="font-mono font-medium text-slate-900">{property.owner.phone}</span>
              </p>
            )}
          </Card>

          <Card className="rounded-2xl border-slate-200/80 shadow-xs p-5">
            <h2 className="font-heading text-sm font-bold tracking-wide text-slate-500 uppercase">
              Listing Timeline
            </h2>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Published</dt>
                <dd className="font-medium text-slate-800">{formatDate(property.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Available Date</dt>
                <dd className="font-medium text-brand-600">{formatDate(property.availableFrom)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Listing Status</dt>
                <dd className="font-medium text-emerald-600">Active & Accepting Visits</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title="Schedule a Property Visit"
        description={`Coordinate an in-person viewing of ${property.title} with owner ${property.owner.name}.`}
      >
        <form onSubmit={handleScheduleVisit} className="flex flex-col gap-4 mt-2">
          <FormField id="visit-date" label="Preferred Visit Date" required>
            {(field) => (
              <TextInput
                {...field}
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField id="visit-slot" label="Preferred Time Slot" required>
            {(field) => (
              <Select
                {...field}
                value={visitSlot}
                onChange={(e) => setVisitSlot(e.target.value as any)}
                options={[
                  { value: 'Morning (9 AM - 12 PM)', label: 'Morning (9 AM - 12 PM)' },
                  { value: 'Afternoon (1 PM - 4 PM)', label: 'Afternoon (1 PM - 4 PM)' },
                  { value: 'Evening (5 PM - 8 PM)', label: 'Evening (5 PM - 8 PM)' },
                ]}
              />
            )}
          </FormField>

          <FormField id="visit-phone" label="Your Contact Phone" required>
            {(field) => (
              <TextInput
                {...field}
                type="tel"
                value={visitPhone}
                onChange={(e) => setVisitPhone(e.target.value)}
                placeholder="+91 98400 00000"
                required
              />
            )}
          </FormField>

          <FormField id="visit-note" label="Notes or questions for the owner">
            {(field) => (
              <TextArea
                {...field}
                value={visitNote}
                onChange={(e) => setVisitNote(e.target.value)}
                placeholder="e.g. Would like to see the room and test the Wi-Fi speed..."
                rows={3}
              />
            )}
          </FormField>

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsVisitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmittingVisit}>
              Confirm & Request Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Rate & Review Property"
        description="Share your feedback to help other students choose their next home."
      >
        <form onSubmit={handleAddReview} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="mt-1 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition hover:scale-125 ${
                    star <= reviewRating ? 'text-amber-500' : 'text-slate-300'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm font-semibold text-slate-700 ml-2">
                {reviewRating} of 5 stars
              </span>
            </div>
          </div>

          <FormField id="review-title" label="Headline">
            {(field) => (
              <TextInput
                {...field}
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Quiet environment, super clean room"
              />
            )}
          </FormField>

          <FormField id="review-comment" label="Review Details" required>
            {(field) => (
              <TextArea
                {...field}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe your experience with the room, facilities, locality and owner..."
                rows={4}
                required
              />
            )}
          </FormField>

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
