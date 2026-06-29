'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

const registerSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100),
  email: zod.string().email('Enter a valid email'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h1>
          <p className="text-sm text-[var(--muted)]">Join ReviewSphere and start reviewing</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-full cursor-pointer">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
