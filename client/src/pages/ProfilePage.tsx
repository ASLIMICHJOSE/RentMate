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
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { STUDENT_NAV, OWNER_NAV } from '../layouts/dashboardNav';
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

/** Saves arrive in Milestone 5; today the form is read-only-ish and honest about it. */
function ProfileView({ user }: { user: CurrentUser }) {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.profile?.phone ?? '',
      city: user.profile?.city ?? '',
      occupation: user.profile?.occupation ?? '',
      education: user.profile?.education ?? '',
      bio: user.profile?.bio ?? '',
    },
  });

  async function onSubmit(values: ProfileValues): Promise<void> {
    // The update endpoint lands in Milestone 5; keep the interaction honest.
    await Promise.resolve(values);
    showToast({
      variant: 'info',
      title: 'Profile saving arrives in Milestone 5',
      description: `Nothing was changed yet - ${values.name}'s details are still the seeded values.`,
    });
  }

  const navigation = user.role === 'OWNER' ? OWNER_NAV : STUDENT_NAV;

  return (
    <DashboardLayout nav={navigation} navLabel="Account navigation">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Keep your details current so owners and potential flatmates can reach you."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Personal details"
            description="Validation runs here and again on the server before anything is stored."
          />

          <form
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            noValidate
            className="mt-5 flex flex-col gap-4"
          >
            <FormField id="profile-name" label="Full name" error={errors.name?.message} required>
              {(field) => <TextInput {...field} {...register('name')} autoComplete="name" />}
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="profile-phone"
                label="Phone number"
                hint="Shared with owners only after you request a visit."
                error={errors.phone?.message}
              >
                {(field) => <TextInput {...field} {...register('phone')} autoComplete="tel" />}
              </FormField>

              <FormField id="profile-city" label="City" error={errors.city?.message}>
                {(field) => (
                  <TextInput {...field} {...register('city')} autoComplete="address-level2" />
                )}
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="profile-occupation"
                label="Occupation"
                error={errors.occupation?.message}
              >
                {(field) => <TextInput {...field} {...register('occupation')} />}
              </FormField>

              <FormField
                id="profile-education"
                label="College / course"
                error={errors.education?.message}
              >
                {(field) => <TextInput {...field} {...register('education')} />}
              </FormField>
            </div>

            <FormField id="profile-bio" label="About you" error={errors.bio?.message}>
              {(field) => <TextArea {...field} {...register('bio')} rows={4} />}
            </FormField>

            <div>
              <Button type="submit" isLoading={isSubmitting}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Profile photo" />
            <div className="mt-4 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-16 place-items-center rounded-full bg-brand-50 text-lg font-semibold text-brand-700"
              >
                {getInitials(user.name)}
              </span>
              <div>
                <Button variant="outline" size="sm" disabled title="Uploads arrive in Milestone 15">
                  Upload photo
                </Button>
                <p className="mt-1 text-xs text-slate-500">JPG or PNG, up to 2 MB.</p>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              Avatar uploads go through Cloudinary in Milestone 15, with file type and size checks
              on the server.
            </p>
          </Card>

          <Card>
            <CardHeader title="Account" />
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Signed in as</dt>
                <dd className="font-medium text-slate-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Role</dt>
                <dd className="mt-1">
                  <Badge tone={roleTones[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Account status</dt>
                <dd className="mt-1">
                  <Badge tone={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Member since</dt>
                <dd className="text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Role and status come from your session and are re-checked on the server for every
              request.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  // ProtectedRoute guarantees a signed-in user before this page renders.
  if (!user) return null;

  return <ProfileView user={user} />;
}
