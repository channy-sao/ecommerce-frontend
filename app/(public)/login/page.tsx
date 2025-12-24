'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AlertCircle,
  CheckCircle,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
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
        // setTimeout(() => {
        router.replace('/');
        router.refresh();
        // }, 600);
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* LEFT SIDE - Hero/Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
              <span className="text-2xl font-bold">SecurePortal</span>
            </div>

            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight mb-6">
                Welcome back to your secure workspace
              </h1>
              <p className="text-lg text-blue-100 mb-10">
                Access your personalized dashboard, manage your projects, and collaborate with your
                team seamlessly.
              </p>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Team Collaboration</h3>
                    <p className="text-blue-100">
                      Work together efficiently with real-time updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Enterprise Security</h3>
                    <p className="text-blue-100">Bank-level encryption and secure data handling</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Lightning Fast</h3>
                    <p className="text-blue-100">Optimized performance for seamless experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Testimonial */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-blue-100">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to your account</p>
          </div>

          {/* Desktop/Large Header */}
          <div className="hidden lg:block text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled={loginMutation.isPending}
                  placeholder="you@company.com"
                  {...register('email')}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-all duration-200 disabled:opacity-50"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loginMutation.isPending}
                  placeholder="••••••••"
                  {...register('password')}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-all duration-200 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={loginMutation.isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
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

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register('rememberMe')}
                  disabled={loginMutation.isPending}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
            </div>

            {/* ERROR MESSAGES */}
            {serverError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-300">{serverError}</p>
                </div>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {loginMutation.isSuccess && isSuccess && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Login successful! Redirecting...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in to dashboard
                </>
              )}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loginMutation.isPending}
                onClick={() => handleSocialLogin('github')}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-sm hover:shadow"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>

              <button
                type="button"
                disabled={loginMutation.isPending}
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-sm hover:shadow"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </button>
            </div>
          </div>

          {/* SIGN UP LINK */}
          <div className="text-center pt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Don&#39;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Get started
              </Link>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Free 14-day trial • No credit card required
            </p>
          </div>

          {/* Footer Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/support"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
