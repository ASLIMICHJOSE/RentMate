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
import { useToast } from '../hooks/useToast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { STUDENT_NAV } from '../layouts/dashboardNav';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9\s-]{7,15}$/, 'Enter a valid phone number')
    .optional(),
  city: z.string().trim().max(60).optional(),
  occupation: z.string().trim().max(80).optional(),
  education: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(500, 'Keep your bio under 500 characters').optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Aditya Sharma',
      phone: '+91 98400 11223',
      city: 'Chennai',
      occupation: 'Student',
      education: 'Anna University · Mechanical Engineering',
      bio: 'Final-year student looking for a quiet flat close to campus.',
    },
  });

  function onSubmit(values: ProfileValues): void {
    showToast({
      variant: 'info',
      title: 'Profile saving is not connected yet',
      description: `${values.name}'s details will be persisted by the profile API in Milestone 5.`,
    });
  }

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Keep your details current so owners and potential flatmates can reach you."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Personal details" />

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
              <Button type="submit">Save changes</Button>
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
                AS
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
                <dd className="font-medium text-slate-900">aditya@example.com</dd>
              </div>
              <div>
                <dt className="text-slate-500">Role</dt>
                <dd className="mt-1">
                  <Badge tone="brand">Student</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Account status</dt>
                <dd className="mt-1">
                  <Badge tone="success">Active</Badge>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Role and status come from the authenticated session (Milestone 4).
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
