import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, type BadgeTone } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { OWNER_NAV } from '../../layouts/dashboardNav';
import { AppStore, CURATED_PROPERTY_IMAGES, type VisitRequestItem } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { Property, ListingStatus, PropertyType, Amenity } from '../../types/property';
import { formatCurrency, formatDate } from '../../utils/format';
import { LISTING_STATUS_LABELS, PROPERTY_TYPE_LABELS, AMENITY_LABELS } from '../../utils/labels';

const statusTones: Record<ListingStatus, BadgeTone> = {
  PUBLISHED: 'success',
  PENDING: 'warning',
  REJECTED: 'danger',
  RENTED: 'brand',
  ARCHIVED: 'neutral',
};

const ALL_AMENITIES: Amenity[] = [
  'WIFI',
  'PARKING',
  'LAUNDRY',
  'KITCHEN',
  'AC',
  'SECURITY',
  'POWER_BACKUP',
  'WATER_SUPPLY',
  'GYM',
  'MEALS',
];

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<VisitRequestItem[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('18000');
  const [deposit, setDeposit] = useState('36000');
  const [city, setCity] = useState('Chennai');
  const [locality, setLocality] = useState('Guindy');
  const [address, setAddress] = useState('4th Cross Street, Guindy, Chennai');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [areaSqft, setAreaSqft] = useState('950');
  const [furnished, setFurnished] = useState(true);
  const [status, setStatus] = useState<ListingStatus>('PUBLISHED');
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([
    'WIFI',
    'AC',
    'KITCHEN',
    'POWER_BACKUP',
  ]);

  function reloadData() {
    const all = AppStore.getProperties();
    // In demo or for signed-in owner, show owner listings or all demo listings
    setProperties(all);
    setVisits(AppStore.getVisits());
  }

  useEffect(() => {
    reloadData();
  }, []);

  function handleOpenCreateModal() {
    setEditingPropertyId(null);
    setTitle('');
    setDescription('');
    setRent('18000');
    setDeposit('36000');
    setCity('Chennai');
    setLocality('Guindy');
    setAddress('');
    setPropertyType('APARTMENT');
    setBedrooms('2');
    setBathrooms('2');
    setAreaSqft('950');
    setFurnished(true);
    setStatus('PUBLISHED');
    setSelectedAmenities(['WIFI', 'AC', 'KITCHEN']);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(prop: Property) {
    setEditingPropertyId(prop.id);
    setTitle(prop.title);
    setDescription(prop.description);
    setRent(String(prop.rent));
    setDeposit(String(prop.deposit));
    setCity(prop.city);
    setLocality(prop.locality);
    setAddress(prop.address);
    setPropertyType(prop.propertyType);
    setBedrooms(String(prop.bedrooms));
    setBathrooms(String(prop.bathrooms));
    setAreaSqft(prop.areaSqft ? String(prop.areaSqft) : '');
    setFurnished(prop.furnished);
    setStatus(prop.status);
    setSelectedAmenities(prop.amenities);
    setIsModalOpen(true);
  }

  function handleSaveProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !rent) return;

    const numRent = Number(rent);
    const numDeposit = Number(deposit) || numRent * 2;
    const numBeds = Number(bedrooms) || 1;
    const numBaths = Number(bathrooms) || 1;
    const numSqft = areaSqft ? Number(areaSqft) : null;

    // Pick photos
    let images = CURATED_PROPERTY_IMAGES.apartment.map((url, i) => ({
      id: `img-${Date.now()}-${i}`,
      imageUrl: url,
      sortOrder: i,
    }));
    if (propertyType === 'STUDIO') {
      images = CURATED_PROPERTY_IMAGES.studio.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        imageUrl: url,
        sortOrder: i,
      }));
    } else if (propertyType === 'SHARED_ROOM' || propertyType === 'PG') {
      images = CURATED_PROPERTY_IMAGES.sharedRoom.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        imageUrl: url,
        sortOrder: i,
      }));
    }

    if (editingPropertyId) {
      AppStore.updateProperty(editingPropertyId, {
        title,
        description,
        rent: numRent,
        deposit: numDeposit,
        city,
        locality,
        address,
        propertyType,
        bedrooms: numBeds,
        bathrooms: numBaths,
        areaSqft: numSqft,
        furnished,
        status,
        amenities: selectedAmenities,
      });
      showToast({
        variant: 'success',
        title: 'Listing updated!',
        description: `${title} was successfully updated.`,
      });
    } else {
      AppStore.addProperty({
        title,
        description,
        rent: numRent,
        deposit: numDeposit,
        city,
        locality,
        address,
        propertyType,
        bedrooms: numBeds,
        bathrooms: numBaths,
        furnished,
        areaSqft: numSqft,
        availableFrom: new Date().toISOString().split('T')[0],
        status,
        amenities: selectedAmenities,
        images,
        owner: {
          id: user?.id ?? 'owner-1',
          name: user?.name ?? 'Priya Raghavan',
          avatarUrl: user?.avatarUrl ?? null,
          phone: user?.profile?.phone ?? '+91 98400 11223',
          memberSince: '2024-06-01',
          verified: true,
        },
      });
      showToast({
        variant: 'success',
        title: 'Listing published!',
        description: `Your new property is now live and accepting student visit requests.`,
      });
    }

    setIsModalOpen(false);
    reloadData();
  }

  function handleDeleteProperty(id: string, propTitle: string) {
    if (window.confirm(`Are you sure you want to delete "${propTitle}"?`)) {
      AppStore.deleteProperty(id);
      reloadData();
      showToast({
        variant: 'success',
        title: 'Listing removed',
        description: `${propTitle} has been deleted.`,
      });
    }
  }

  function handleUpdateVisit(id: string, newStatus: 'ACCEPTED' | 'REJECTED') {
    AppStore.updateVisitStatus(id, newStatus);
    reloadData();
    showToast({
      variant: 'success',
      title: newStatus === 'ACCEPTED' ? 'Visit request accepted!' : 'Visit request declined',
      description: 'The student will see the updated status on their dashboard.',
    });
  }

  const publishedCount = properties.filter((p) => p.status === 'PUBLISHED').length;
  const totalRentRoll = properties.reduce((acc, p) => (p.status === 'PUBLISHED' || p.status === 'RENTED' ? acc + p.rent : acc), 0);
  const pendingVisitsCount = visits.filter((v) => v.status === 'PENDING').length;

  return (
    <DashboardLayout nav={OWNER_NAV} navLabel="Owner dashboard">
      <PageHeader
        eyebrow="Owner Management Center"
        title="Your Property Portfolio"
        description="Add listings, update availability, track rental performance, and confirm student visits."
        actions={
          <Button onClick={handleOpenCreateModal} className="font-bold shadow-md shadow-brand-500/20">
            ➕ Add New Property
          </Button>
        }
      />

      {/* Dynamic Owner Stats */}
      <section aria-labelledby="owner-stats-heading">
        <h2 id="owner-stats-heading" className="sr-only">
          Listing summary
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StatCard
              stat={{
                label: 'Active Listings',
                value: String(publishedCount),
                change: `${publishedCount} live in search`,
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Estimated Monthly Rent',
                value: formatCurrency(totalRentRoll),
                change: 'Across active portfolio',
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Pending Visit Slots',
                value: String(pendingVisitsCount),
                change: pendingVisitsCount > 0 ? 'Requires your confirmation' : 'All up to date',
              }}
            />
          </li>
          <li>
            <StatCard
              stat={{
                label: 'Verification Status',
                value: '100% Verified',
                change: 'Official Landlord Partner',
              }}
            />
          </li>
        </ul>
      </section>

      {/* Property Listings Table */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardHeader
          title="All Managed Properties"
          description="Complete control over pricing, occupancy status, and descriptions."
          action={
            <Button size="sm" onClick={handleOpenCreateModal}>
              + Add Property
            </Button>
          }
        />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 uppercase bg-slate-50/60">
                <th scope="col" className="py-3 px-4">
                  Listing Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Type
                </th>
                <th scope="col" className="py-3 px-4">
                  Monthly Rent
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/50 transition">
                  <th scope="row" className="py-3 px-4 font-bold text-slate-900">
                    <Link
                      to={`/properties/${property.id}`}
                      className="hover:text-brand-600 transition"
                    >
                      {property.title}
                    </Link>
                    <span className="block text-xs font-normal text-slate-500">
                      📍 {property.locality}, {property.city}
                    </span>
                  </th>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium">
                      {PROPERTY_TYPE_LABELS[property.propertyType]}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {formatCurrency(property.rent)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge tone={statusTones[property.status]}>
                      {LISTING_STATUS_LABELS[property.status]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(property)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProperty(property.id, property.title)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Student Visit Requests */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardHeader
          title="Student Visit Requests"
          description="Review incoming in-person viewing requests from prospective students."
        />

        {visits.length === 0 ? (
          <p className="mt-4 text-xs text-slate-500">No student visit requests currently pending.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {visits.map((v) => (
              <li key={v.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900">{v.propertyTitle}</p>
                    <Badge tone={v.status === 'ACCEPTED' ? 'success' : v.status === 'PENDING' ? 'warning' : 'neutral'}>
                      {v.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Requested by <span className="font-semibold text-slate-800">{v.studentName}</span> ({v.studentPhone}) for{' '}
                    <span className="font-bold text-brand-700">{formatDate(v.preferredDate)}</span> · {v.preferredSlot}
                  </p>
                  {v.note && <p className="text-xs text-slate-500 italic mt-0.5">"{v.note}"</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {v.status === 'PENDING' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateVisit(v.id, 'ACCEPTED')}
                        className="text-xs font-bold"
                      >
                        ✓ Accept Slot
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateVisit(v.id, 'REJECTED')}
                        className="text-xs"
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">Decision recorded</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Add / Edit Property Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPropertyId ? 'Edit Property Listing' : 'Publish New Rental Listing'}
        description="Provide comprehensive details about the apartment, pricing, location and amenities."
      >
        <form onSubmit={handleSaveProperty} className="flex flex-col gap-4 mt-2 max-h-[75vh] overflow-y-auto px-1">
          <FormField id="prop-title" label="Listing Title" required>
            {(field) => (
              <TextInput
                {...field}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious 2BHK near Guindy Metro"
                required
              />
            )}
          </FormField>

          <FormField id="prop-description" label="Detailed Description" required>
            {(field) => (
              <TextArea
                {...field}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe rooms, natural lighting, student atmosphere, proximity to college gates..."
                rows={3}
                required
              />
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="prop-rent" label="Monthly Rent (₹)" required>
              {(field) => (
                <TextInput
                  {...field}
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  required
                />
              )}
            </FormField>

            <FormField id="prop-deposit" label="Security Deposit (₹)" required>
              {(field) => (
                <TextInput
                  {...field}
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  required
                />
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="prop-city" label="City" required>
              {(field) => (
                <Select
                  {...field}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  options={[
                    { value: 'Chennai', label: 'Chennai' },
                    { value: 'Bengaluru', label: 'Bengaluru' },
                    { value: 'Hyderabad', label: 'Hyderabad' },
                    { value: 'Pune', label: 'Pune' },
                    { value: 'Mumbai', label: 'Mumbai' },
                  ]}
                />
              )}
            </FormField>

            <FormField id="prop-locality" label="Locality / Neighborhood" required>
              {(field) => (
                <TextInput
                  {...field}
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Guindy, Koramangala"
                  required
                />
              )}
            </FormField>
          </div>

          <FormField id="prop-address" label="Street Address" required>
            {(field) => (
              <TextInput
                {...field}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address and pincode"
                required
              />
            )}
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField id="prop-type" label="Property Type">
              {(field) => (
                <Select
                  {...field}
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  options={[
                    { value: 'APARTMENT', label: 'Apartment' },
                    { value: 'STUDIO', label: 'Studio' },
                    { value: 'SHARED_ROOM', label: 'Shared Room' },
                    { value: 'PG', label: 'PG Accommodation' },
                    { value: 'HOUSE', label: 'Independent House' },
                  ]}
                />
              )}
            </FormField>

            <FormField id="prop-beds" label="Bedrooms">
              {(field) => (
                <TextInput
                  {...field}
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              )}
            </FormField>

            <FormField id="prop-baths" label="Bathrooms">
              {(field) => (
                <TextInput
                  {...field}
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="prop-status" label="Listing Status">
              {(field) => (
                <Select
                  {...field}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ListingStatus)}
                  options={[
                    { value: 'PUBLISHED', label: 'Published (Active)' },
                    { value: 'PENDING', label: 'Pending Review' },
                    { value: 'RENTED', label: 'Rented' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                />
              )}
            </FormField>

            <div className="flex items-center pt-6">
              <Checkbox
                id="prop-furnished"
                label="Furnished Accommodation"
                checked={furnished}
                onChange={(e) => setFurnished(e.target.checked)}
              />
            </div>
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Select Available Amenities
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ALL_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                      } else {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      }
                    }}
                    className={`rounded-lg p-2 text-xs font-semibold text-left border transition ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {AMENITY_LABELS[amenity]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-slate-200 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingPropertyId ? 'Save Changes' : 'Publish Property'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
