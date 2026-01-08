'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { UpdateUserFormValues, updateUserSchema } from 'lib/validators/user-schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle2, Key, Shield, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserAPI, USERS_QUERY_KEY } from '@/lib/api/user';
import { UserResponse } from '@/lib/types/user';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const DEFAULT_IMAGE = '/images/no-image.png';

interface UpdateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
}

export function UpdateUserDialog({ open, onOpenChange, user }: UpdateUserDialogProps) {
  const queryClient = useQueryClient();
  const [profilePreview, setProfilePreview] = useState<string>(DEFAULT_IMAGE);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      email: user.email ?? '',
      password: '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
    });

    setProfilePreview(user.avatar || DEFAULT_IMAGE);
  }, [user, form]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserFormValues) => UserAPI.updateUser(data, user.id),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('🎉 Update user successfully!', {
          description: 'Update user successfully!.',
        });
        form.reset();
        onOpenChange(false);
        void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      } else {
        toast.error('Unable to update user', {
          description: data.status.message,
        });
      }
    },
    onError: (error: any) => {
      toast.error('Update failed', {
        description: error.message || 'Please try again later.',
      });
    },
  });

  const passwordValue = form.watch('password') || '';
  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (passwordValue.length >= 8) strength += 25;
    if (/[A-Z]/.test(passwordValue)) strength += 25;
    if (/[a-z]/.test(passwordValue)) strength += 25;
    if (/[0-9]/.test(passwordValue)) strength += 25;
    return strength;
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [passwordValue]);

  const onSubmit = (data: UpdateUserFormValues) => {
    if (!data.password) delete data.password;
    updateUserMutation.mutate(data);
  };

  const handleProfileChange = (file: File) => {
    form.setValue('profile', file, { shouldDirty: true });
    const reader = new FileReader();
    reader.onload = (e) => setProfilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] p-0 flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            {/* Header */}
            <DialogHeader className="p-5">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-sidebar-menu">
                  <Shield className="h-5 w-5 text-sidebar-menu-foreground" />
                </div>
                <div>
                  <DialogTitle>Update User</DialogTitle>
                  <DialogDescription>Modify user information</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-[100px] h-[120px] rounded-lg overflow-hidden border">
                  <Image src={profilePreview} alt="Profile" fill className="object-cover" />
                  {profilePreview !== DEFAULT_IMAGE && (
                    <button
                      type="button"
                      onClick={() => setProfilePreview(DEFAULT_IMAGE)}
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <label className="mt-3 cursor-pointer text-xs text-primary flex gap-2 items-center">
                  <Upload size={14} />
                  Change picture
                  <input
                    type="file"
                    hidden
                    onChange={(e) => e.target.files && handleProfileChange(e.target.files[0])}
                  />
                </label>
              </div>

              <Separator />

              <div className="space-y-4 mt-4">
                {/* Email (readonly) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-2">
                        <Key size={14} /> New Password
                        <Badge variant="secondary">Optional</Badge>
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>

                      {(passwordValue && form.formState.isDirty) && <Progress value={passwordStrength} className="h-1 mt-2" />}
                      { (passwordValue && form.formState.isDirty) && <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Password Strength</span>
                        <span
                          className={cn(
                            'font-medium',
                            passwordStrength === 100 && 'text-emerald-600',
                            passwordStrength >= 75 && 'text-green-600',
                            passwordStrength >= 50 && 'text-yellow-600',
                            passwordStrength >= 25 && 'text-orange-600',
                            passwordStrength < 25 && 'text-red-600'
                          )}
                        >
                            {passwordStrength === 100
                              ? 'Strong'
                              : passwordStrength >= 75
                                ? 'Good'
                                : passwordStrength >= 50
                                  ? 'Fair'
                                  : passwordStrength >= 25
                                    ? 'Weak'
                                    : 'Very Weak'}
                          </span>
                      </div>}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-between">
              <AnimatePresence mode="wait">
                {form.formState.isValid ? (
                  <motion.div
                    key="valid"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">Ready to create</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="invalid"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm text-muted-foreground"
                  >
                    Fill in all required fields
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={updateUserMutation.isPending} variant="custom">
                {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
