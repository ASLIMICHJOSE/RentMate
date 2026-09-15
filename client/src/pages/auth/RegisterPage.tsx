import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Checkbox } from '../../components/ui/Checkbox';
import { FormField } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';
import { TextInput } from '../../components/ui/TextInput';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage, getFieldErrors } from '../../utils/apiErrors';
import { defaultRouteForRole } from '../../utils/roles';

const ROLE_OPTIONS = [
  { value: 'STUDENT', label: 'Student - looking for a place' },
  { value: 'OWNER', label: 'Owner - listing a property' },
];

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name').max(80),
    email: z.email('Enter a valid email address'),
    role: z.enum(['STUDENT', 'OWNER'], { message: 'Choose how you will use RentMate' }),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .max(72, 'Passwords cannot be longer than 72 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((values) => values.acceptTerms, {
    path: ['acceptTerms'],
    message: 'Please accept the terms to create an account',
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'STUDENT',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  async function onSubmit(values: RegisterValues): Promise<void> {
    setIsSubmitting(true);

    try {
      const user = await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      showToast({
        variant: 'success',
        title: 'Account created',
        description: `Welcome to RentMate, ${user.name.split(' ')[0]}.`,
      });

      navigate(defaultRouteForRole(user.role), { replace: true });
    } catch (caught) {
      const fieldErrors = getFieldErrors(caught);

      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field === 'name' || field === 'email' || field === 'password' || field === 'role') {
          setError(field, { message });
        }
      }

      showToast({
        variant: 'error',
        title: 'Could not create your account',
        description: getErrorMessage(caught),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          One account works for both finding a place and listing one.
        </p>
      </div>

      <Card>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormField id="register-name" label="Full name" error={errors.name?.message} required>
            {(field) => (
              <TextInput
                {...field}
                {...register('name')}
                autoComplete="name"
                placeholder="Aditya Sharma"
              />
            )}
          </FormField>

          <FormField
            id="register-email"
            label="Email address"
            error={errors.email?.message}
            required
          >
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

          <FormField
            id="register-role"
            label="I am joining as"
            error={errors.role?.message}
            required
          >
            {(field) => <Select {...field} {...register('role')} options={ROLE_OPTIONS} />}
          </FormField>

          <FormField
            id="register-password"
            label="Password"
            hint="At least 8 characters, including a letter and a number."
            error={errors.password?.message}
            required
          >
            {(field) => (
              <TextInput
                {...field}
                {...register('password')}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            )}
          </FormField>

          <FormField
            id="register-confirm-password"
            label="Confirm password"
            error={errors.confirmPassword?.message}
            required
          >
            {(field) => (
              <TextInput
                {...field}
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            )}
          </FormField>

          <div>
            <Checkbox
              id="register-terms"
              label="I agree to the RentMate terms of use and privacy policy."
              {...register('acceptTerms')}
              aria-invalid={Boolean(errors.acceptTerms)}
              aria-describedby={errors.acceptTerms ? 'register-terms-error' : undefined}
            />
            {errors.acceptTerms && (
              <p id="register-terms-error" className="mt-1.5 text-xs font-medium text-red-700">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <Button type="submit" fullWidth className="mt-1" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Passwords are hashed with bcrypt on the server (12 rounds) and are never stored or logged
          in plaintext. Admin accounts are created by other admins, not from this form.
        </p>
      </Card>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>
    </div>
  );
}
