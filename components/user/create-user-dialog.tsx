'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateUserFormValues, createUserSchema } from 'lib/validators/user-schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Key,
  Mail,
  Shield,
  Smartphone,
  Sparkles,
  Upload,
  User,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { UserAPI, USERS_QUERY_KEY } from '@/lib/api/user';
import { CreateUserRequest } from '@/lib/types/user';
import { Progress } from '@/components/ui/progress';

const DEFAULT_IMAGE = '/images/no-image.png';

interface CreateUserDialogProps {
  onSuccess?: () => void;
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>(DEFAULT_IMAGE);
  const [isDragging, setIsDragging] = useState(false);

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserFormValues) => UserAPI.createUser(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('🎉 User created successfully!', {
          description: 'The new user has been added to the system.',
        });
        setOpen(false);
        form.reset();
        onSuccess?.();
        void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      } else {
        toast.error('Unable to create user', {
          description: data.status.message,
        });
      }
    },
    onError: (error: any) => {
      toast.error('Creation failed', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    },
  });

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
    mode: 'onChange',
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

  const onSubmit = useCallback(
    (data: CreateUserRequest) => {
      createUserMutation.mutate(data);
    },
    [createUserMutation]
  );

  const handleProfileImageChange = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Only JPEG, PNG, GIF, and WebP images are allowed.',
        });
        return;
      }

      form.setValue('profile', file, { shouldDirty: true });

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProfileImageChange(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleProfileImageChange(file);
    },
    [handleProfileImageChange]
  );

  const removeProfileImage = useCallback(() => {
    form.setValue('profile', undefined, { shouldDirty: true });
    setProfilePreview(DEFAULT_IMAGE);
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset();
    setProfilePreview(DEFAULT_IMAGE);
  }, [form]);


  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="custom"
          className="gap-2 group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl from-primary to-primary/80"
        >
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-h-[90vh] h-[90vh] overflow-hidden p-0 rounded-xl border-0 shadow-2xl flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            {/* Fixed Header */}
            <DialogHeader className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sidebar-menu">
                  <Shield className="h-5 w-5 text-sidebar-menu-foreground" />
                </div>
                <div>
                  <DialogTitle className="text-lg">Create New User</DialogTitle>
                  <DialogDescription className="text-sm">Define user information</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-2 bg-gradient-to-b from-background to-muted/20">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-4 mb-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    'relative w-[100px] h-[120px] rounded-lg overflow-hidden border-2 transition-all duration-300',
                    isDragging ? 'border-primary border-dashed scale-105' : 'border-border',
                    profilePreview !== DEFAULT_IMAGE && 'shadow-lg'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Image
                    src={profilePreview}
                    alt="Profile"
                    width={100}
                    height={120}
                    className={cn(
                      'object-cover w-full h-full transition-all duration-300',
                      profilePreview === DEFAULT_IMAGE && 'opacity-50 scale-110'
                    )}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

                  {profilePreview !== DEFAULT_IMAGE && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </motion.div>

                <div className="text-center">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-all px-4 py-2 rounded-lg border border-primary/30 hover:border-primary/50 bg-primary/5 hover:bg-primary/10">
                      <Upload className="h-4 w-4" />
                      <span>Upload Profile Picture</span>
                    </div>
                    <input
                      id="profile-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Drag & drop or click to upload. Max 5MB.
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Form Fields */}
              <div className="space-y-5 py-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>Email Address</span>
                        <Badge variant="secondary" className="ml-auto text-[10px] px-2 py-0">
                          Required
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="superadmin@example.com"
                          type="email"
                          autoComplete={'off'}
                          {...field}
                          className="h-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Key className="h-4 w-4 text-primary" />
                        <span>Password</span>
                        <Badge variant="secondary" className="ml-auto text-[10px] px-2 py-0">
                          Required
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete={'new-password'}
                          {...field}
                          className="h-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>

                      {/* Password Strength Meter */}
                      <div className="space-y-2 mt-3">
                        <Progress value={passwordStrength} className="h-1.5" />
                        <div className="text-xs text-muted-foreground flex justify-between">
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
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-primary" />
                          <span>First Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="h-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-primary" />
                          <span>Last Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="h-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <span>Phone Number</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0123456789"
                          className="h-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="border-t bg-gradient-to-r from-background to-muted/5 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
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

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={createUserMutation.isPending}
                    size="sm"
                    className="min-w-[80px] hover:border-primary/30"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending || !form.formState.isValid}
                    className="gap-2 min-w-[120px] from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                    variant="custom"
                    size="sm"
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
