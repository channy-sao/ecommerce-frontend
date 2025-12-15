// app/(dashboard)/settings/password/page.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, RefreshCw, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuthentication } from '@/providers/AuthProvider';
import { UpdatePasswordRequest } from '@/lib/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserAPI } from '@/lib/api/user';
import { toast } from 'sonner';

// Password validation schema
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .min(8, 'Current password must be at least 8 characters'),

    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;

  // Generate feedback
  if (password.length < 8) feedback.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('One uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('One lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('One number');
  if (!/[@$!%*?&]/.test(password)) feedback.push('One special character (@$!%*?&)');

  return {
    score,
    strength: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong',
    feedback,
    isStrong: score >= 5,
    percentage: (score / 6) * 100,
  };
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  if (!password) return null;

  const { strength, percentage, feedback } = checkPasswordStrength(password);

  const getColorClass = () => {
    switch (strength) {
      case 'Weak':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getTextColorClass = () => {
    switch (strength) {
      case 'Weak':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Strong':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password strength:</span>
          <span className={cn('text-sm font-semibold', getTextColorClass())}>{strength}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      {feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Requirements:</p>
          <ul className="space-y-1">
            {feedback.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {strength === 'Strong' && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Strong password! Good job.</span>
        </div>
      )}
    </div>
  );
};

export default function UpdatePasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthentication();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Query mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordRequest) => UserAPI.changePassword(data),

    onMutate: () => {
      // Show loading state
      toast.info('Please wait while we update your password.');
    },

    onSuccess: (response) => {
      // Show success message
      toast.success('Password updated successfully');

      // Invalidate user-related queries
      void queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      void queryClient.invalidateQueries({ queryKey: ['user'] });

      // Logout user after successful password change
      // setTimeout(() => {
      //   logout();
      // }, 3000);
    },

    onError: (error: Error) => {
      console.error('Password update error:', error);

      const errorMessage =
        error.message || error.message || 'Failed to update password. Please try again.';

      toast.error(errorMessage);
    },

    // Optional: onSettled callback
    onSettled: () => {
      // Any cleanup or final actions
    },
  });

  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Watch new password for strength indicator
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchNewPassword = form.watch('newPassword');

  const onSubmit = async (data: PasswordFormValues) => {
    if (!user) {
      toast('You must be logged in to change your password');
      return;
    }

    try {
      // Prepare request data
      const requestData = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
        email: user.email,
      };

      // Execute mutation
      await updatePasswordMutation.mutateAsync(requestData);

      // Show success toast
      toast.success('Password changed successfully!');

      // Reset form
      form.reset();
    } catch (error: unknown) {
      // Error is already handled by the mutation's onError callback
      console.error('Password update error:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Update Password</h1>
            <p className="text-muted-foreground mt-1">
              Change your account password to keep your account secure
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Change Your Password
            </CardTitle>
            <CardDescription>Please enter your current password and set a new one</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Security Alert */}
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription>
                After changing your password, you will be logged out of all devices and need to sign
                in again.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            {...field}
                            disabled={updatePasswordMutation.isPending}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            disabled={updatePasswordMutation.isPending}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            {...field}
                            disabled={updatePasswordMutation.isPending}
                            className="pr-10"
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={updatePasswordMutation.isPending}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <PasswordStrengthIndicator password={watchNewPassword} />
                      <FormDescription>
                        Must be at least 8 characters with uppercase, lowercase, number, and special
                        character.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            {...field}
                            disabled={updatePasswordMutation.isPending}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={updatePasswordMutation.isPending}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Password Requirements
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Minimum 8 characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>At least one uppercase letter (A-Z)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>At least one lowercase letter (a-z)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>At least one number (0-9)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>At least one special character (@$!%*?&)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Cannot be the same as current password</span>
                    </li>
                  </ul>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={updatePasswordMutation.isPending || !form.formState.isValid}
                    className="flex-1"
                  >
                    {updatePasswordMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updatePasswordMutation.isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="border-t pt-6">
            <div className="w-full text-center text-sm text-muted-foreground">
              <p>
                Need help?{' '}
                <Link href="/support" className="text-primary hover:underline font-medium">
                  Contact support
                </Link>
              </p>
              <p className="mt-1 text-xs">
                Last password change: {/*{user?.lastPasswordChange*/}
                {/*  ? new Date(user.lastPasswordChange).toLocaleDateString()*/}
                {/*  : 'Never'}*/}
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Security Tips */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                  Use a unique password for this account
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                  Consider using a password manager
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                  Enable two-factor authentication if available
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                What Happens Next
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  You will be logged out from all devices
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  Email confirmation will be sent
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  Need to sign in again with new password
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
