'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertCircle, CheckCircle, Chrome, Eye, EyeOff, Github, Loader2, Lock, LogIn, Mail, } from 'lucide-react';
import Link from 'next/link';
import { LoginResponse } from '@/lib/types/auth';
import { BaseResponse } from '@/lib/types/base-response';
import { useAuthentication } from '@/providers/AuthProvider';

/**
 * ✅ Zod Validation Schema
 */
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * API call
 */

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, isLoading } = useAuthentication();

  /**
   * React Hook Form + Zod
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Mutation
   */
  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (res: BaseResponse<LoginResponse>) => {
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.replace('/');
          router.refresh();
        }, 1000);
        return;
      } else {
        console.log('ERROR:', res.status.message);
        setError('root', {
          type: 'manual',
          message: res.status.message,
        });
        return;
      }
    },

    onError: (error: Error) => {
      console.log('CATCH ERROR:', error.message);
      setError('root', {
        type: 'manual',
        message: error.message || 'Login failed',
      });
      return;
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setError('root', { type: 'manual', message: '' });
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    });
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    router.push(`/api/auth/${provider}`);
  };

  const serverError = loginMutation.error?.message || errors.root?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-5 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700 transition-all duration-200">
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL FIELD */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className={`h-5 w-5 ${
                    errors.email
                      ? 'text-red-400 dark:text-red-500'
                      : 'text-slate-400 dark:text-gray-500'
                  }`}
                />
              </div>
              <input
                id="email"
                type="email"
                disabled={loginMutation.isPending}
                placeholder="you@example.com"
                {...register('email')}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 bg-white dark:bg-gray-700 text-slate-900 dark:text-white ${
                  errors.email
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-600'
                    : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-gray-300"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${
                    errors.password
                      ? 'text-red-400 dark:text-red-500'
                      : 'text-slate-400 dark:text-gray-500'
                  }`}
                />
              </div>

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                disabled={loginMutation.isPending}
                placeholder="••••••••"
                {...register('password')}
                className={`block w-full pl-10 pr-10 py-3 border rounded-xl placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 bg-white dark:bg-gray-700 text-slate-900 dark:text-white ${
                  errors.password
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-600'
                    : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600'
                }`}
              />

              <button
                type="button"
                disabled={loginMutation.isPending}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 dark:text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 dark:text-gray-500" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              disabled={loginMutation.isPending}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-700 dark:text-gray-300">
              Remember me for 30 days
            </label>
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
                <p className="text-sm text-red-800 dark:text-red-300">{serverError}</p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {loginMutation.isSuccess && isSuccess && (
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Login successful! Redirecting...
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    You will be redirected shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* SOCIAL LOGIN */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-slate-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loginMutation.isPending}
              onClick={() => handleSocialLogin('github')}
              className="w-full py-3 px-4 border border-slate-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>

            <button
              type="button"
              disabled={loginMutation.isPending}
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 px-4 border border-slate-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Chrome className="h-5 w-5 mr-2 text-blue-500" />
              Google
            </button>
          </div>
        </div>

        {/* SIGN UP */}
        <div className="text-center pt-6 border-t border-slate-200 dark:border-gray-700">
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Don&#39;t have an account?{' '}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
