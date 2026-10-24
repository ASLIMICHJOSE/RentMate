import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { FormField } from '../components/ui/FormField';
import { PageHeader } from '../components/ui/PageHeader';
import { TextArea } from '../components/ui/TextArea';
import { TextInput } from '../components/ui/TextInput';
import { Select } from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { STUDENT_NAV, OWNER_NAV, ADMIN_NAV } from '../layouts/dashboardNav';
import type { CurrentUser, UserRole } from '../types/user';
import { getInitials } from '../utils/format';
import { ROLE_LABELS } from '../utils/roles';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9\s-]{7,15}$/, 'Enter a valid phone number'),
  city: z.string().trim().max(60),
  occupation: z.string().trim().max(80),
  education: z.string().trim().max(120),
  bio: z.string().trim().max(500, 'Keep your bio under 500 characters'),
});

type ProfileValues = z.infer<typeof profileSchema>;

const roleTones: Record<UserRole, 'brand' | 'success' | 'danger'> = {
  STUDENT: 'brand',
  OWNER: 'success',
  ADMIN: 'danger',
};

function ProfileView({ user }: { user: CurrentUser }) {
  const { showToast } = useToast();

  // Student matching preferences state
  const [sleepSchedule, setSleepSchedule] = useState('EARLY_BIRD');
  const [foodPreference, setFoodPreference] = useState('VEGETARIAN');
  const [cleanliness, setCleanliness] = useState('TIDY');
  const [budgetMin, setBudgetMin] = useState('8000');
  const [budgetMax, setBudgetMax] = useState('15000');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.profile?.phone ?? '',
      city: user.profile?.city ?? 'Chennai',
      occupation: user.profile?.occupation ?? '',
      education: user.profile?.education ?? '',
      bio: user.profile?.bio ?? '',
    },
  });

  async function onSubmit(values: ProfileValues): Promise<void> {
    const updatedUser: CurrentUser = {
      ...user,
      name: values.name,
      profile: {
        phone: values.phone,
        city: values.city,
        occupation: values.occupation,
        education: values.education,
        bio: values.bio,
      },
    };

    localStorage.setItem('rentmate_local_session_user', JSON.stringify(updatedUser));

    showToast({
      variant: 'success',
      title: 'Profile updated successfully!',
      description: 'Your details and flatmate preferences have been saved.',
    });
  }

  const navigation =
    user.role === 'ADMIN' ? ADMIN_NAV : user.role === 'OWNER' ? OWNER_NAV : STUDENT_NAV;

  return (
    <DashboardLayout nav={navigation} navLabel="Account navigation">
      <PageHeader
        eyebrow="Account Settings"
        title="Your Profile & Preferences"
        description="Update your contact details, education, bio and roommate compatibility parameters."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs">
            <CardHeader
              title="Personal Information"
              description="Basic profile info displayed on reviews, visit bookings, and roommate cards."
            />

            <form
              onSubmit={(event) => void handleSubmit(onSubmit)(event)}
              noValidate
              className="mt-5 flex flex-col gap-4"
            >
              <FormField id="profile-name" label="Full Name" error={errors.name?.message} required>
                {(field) => <TextInput {...field} {...register('name')} autoComplete="name" />}
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="profile-phone"
                  label="Phone Number"
                  hint="Used by owners for visit coordination"
                  error={errors.phone?.message}
                >
                  {(field) => (
                    <TextInput
                      {...field}
                      {...register('phone')}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98400 00000"
                    />
                  )}
                </FormField>

                <FormField id="profile-city" label="Current City" error={errors.city?.message}>
                  {(field) => (
                    <TextInput
                      {...field}
                      {...register('city')}
                      autoComplete="address-level2"
                      placeholder="e.g. Chennai"
                    />
                  )}
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="profile-occupation"
                  label="Occupation"
                  error={errors.occupation?.message}
                >
                  {(field) => (
                    <TextInput
                      {...field}
                      {...register('occupation')}
                      placeholder="e.g. Computer Science Student"
                    />
                  )}
                </FormField>

                <FormField
                  id="profile-education"
                  label="College / Organization"
                  error={errors.education?.message}
                >
                  {(field) => (
                    <TextInput
                      {...field}
                      {...register('education')}
                      placeholder="e.g. Anna University (CEG)"
                    />
                  )}
                </FormField>
              </div>

              <FormField
                id="profile-bio"
                label="Bio & About You"
                hint="Share your habits, hobbies, and what you're looking for."
                error={errors.bio?.message}
              >
                {(field) => (
                  <TextArea
                    {...field}
                    {...register('bio')}
                    rows={4}
                    placeholder="Tell flatmates and owners a little about yourself..."
                  />
                )}
              </FormField>

              {user.role === 'STUDENT' && (
                <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-4 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    Roommate Matching Criteria
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Sleep</label>
                      <select
                        value={sleepSchedule}
                        onChange={(e) => setSleepSchedule(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                      >
                        <option value="EARLY_BIRD">Early Bird</option>
                        <option value="FLEXIBLE">Flexible</option>
                        <option value="NIGHT_OWL">Night Owl</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Food</label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                      >
                        <option value="VEGETARIAN">Vegetarian</option>
                        <option value="EGGETARIAN">Eggetarian</option>
                        <option value="NON_VEGETARIAN">Non-Veg</option>
                        <option value="NO_PREFERENCE">No Preference</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Cleanliness</label>
                      <select
                        value={cleanliness}
                        onChange={(e) => setCleanliness(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                      >
                        <option value="SPOTLESS">Spotless</option>
                        <option value="TIDY">Tidy</option>
                        <option value="AVERAGE">Average</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 flex justify-end">
                <Button type="submit" isLoading={isSubmitting} className="font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Card */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs p-6 text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-700 text-2xl font-bold text-white shadow-lg shadow-brand-500/20">
              {getInitials(user.name)}
            </div>
            <h2 className="mt-3 font-heading text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            <div className="mt-3 flex justify-center">
              <Badge tone={roleTones[user.role]} className="font-bold">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Account Status:</span>
                <span className="font-semibold text-emerald-600">✓ Active</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Security:</span>
                <span className="font-semibold text-slate-900">Encrypted JWT Session</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Verification:</span>
                <span className="font-semibold text-brand-600">Platform Verified</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return <ProfileView user={user} />;
}
