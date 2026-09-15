import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FormField } from '../../components/ui/FormField';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../hooks/useToast';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

type LoginValues = z.infer<typeof loginSchema>;

/**
 * Login screen.
 *
 * The form and its validation are final; the credentials are not sent anywhere
 * yet because `POST /api/auth/login` is implemented in Milestone 4. Submitting
 * tells the user exactly that instead of pretending to sign them in.
 */
export default function LoginPage() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(values: LoginValues): void {
    showToast({
      variant: 'info',
      title: 'Authentication is not connected yet',
      description: `Signing in as ${values.email} works once the auth API lands in Milestone 4.`,
    });
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

          <Button type="submit" fullWidth className="mt-1">
            Log in
          </Button>
        </form>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Validation runs locally. Session handling, secure cookies and role-based access are
          implemented in Milestone 4.
        </p>
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
