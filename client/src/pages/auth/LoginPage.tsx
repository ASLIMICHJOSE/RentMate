import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage, getFieldErrors } from '../../utils/apiErrors';
import { defaultRouteForRole } from '../../utils/roles';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues): Promise<void> {
    setIsSubmitting(true);

    try {
      const user = await login(values);
      showToast({
        variant: 'success',
        title: `Welcome back, ${user.name.split(' ')[0]}`,
      });

      // Return the user to the page that redirected them here, if any.
      const requestedPath = (location.state as { from?: string } | null)?.from;
      navigate(requestedPath ?? defaultRouteForRole(user.role), { replace: true });
    } catch (caught) {
      const fieldErrors = getFieldErrors(caught);

      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field === 'email' || field === 'password') {
          setError(field, { message });
        }
      }

      showToast({
        variant: 'error',
        title: 'Could not sign in',
        description: getErrorMessage(caught),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage your listings, saved properties and messages.
        </p>
      </div>

      <Card>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormField id="login-email" label="Email address" error={errors.email?.message} required>
            {(field) => (
              <TextInput
                {...field}
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            )}
          </FormField>

          <FormField id="login-password" label="Password" error={errors.password?.message} required>
            {(field) => (
              <TextInput
                {...field}
                {...register('password')}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            )}
          </FormField>

          <Button type="submit" fullWidth className="mt-1" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        {/* 1-Click Quick Demo Accounts */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Instant Demo Sign-in:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => void onSubmit({ email: 'aditya.student@rentmate.dev', password: 'Password123!' })}
              className="rounded-xl border border-brand-200 bg-brand-50 p-2 text-center text-xs font-bold text-brand-700 hover:bg-brand-100 transition shadow-xs"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => void onSubmit({ email: 'priya.owner@rentmate.dev', password: 'Password123!' })}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
            >
              🏡 Owner
            </button>
            <button
              type="button"
              onClick={() => void onSubmit({ email: 'admin@rentmate.dev', password: 'Password123!' })}
              className="rounded-xl border border-purple-200 bg-purple-50 p-2 text-center text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-xs"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </Card>

      <p className="text-center text-sm text-slate-600">
        New to RentMate?{' '}
        <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}
