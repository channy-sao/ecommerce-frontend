'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Permission, Role } from '@/lib/types/role';
import { PermissionAPI } from '@/lib/api/permission';
import { toast } from 'sonner';
import { RoleAPI, ROLES_QUERY_KEY } from '@/lib/api/role';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit,
  Package,
  Search,
  Settings,
  Shield,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@radix-ui/react-menu';
import { BaseResponse } from '@/lib/types/base-response';

// Form validation schema (same as create)
const updateRoleSchema = z.object({
  roleName: z
    .string()
    .min(2, { message: 'Role name must be at least 2 characters.' })
    .max(50, { message: 'Role name cannot exceed 50 characters.' }),
  description: z
    .string()
    .max(200, { message: 'Description cannot exceed 200 characters.' })
    .optional()
    .or(z.literal('')),
  permissionIds: z
    .array(z.number())
    .min(1, { message: 'At least one permission must be selected.' }),
});

type UpdateRoleFormValues = {
  roleName: string;
  description?: string;
  permissionIds: number[];
};

interface UpdateRoleDialogProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'User Management': <Users className="h-4 w-4" />,
  'Product Management': <Package className="h-4 w-4" />,
  'Order Management': <Package className="h-4 w-4" />,
  'System Settings': <Settings className="h-4 w-4" />,
  Default: <Shield className="h-4 w-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'User Management': 'bg-blue-500/10 text-blue-600 border-blue-200',
  'Product Management': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'Order Management': 'bg-purple-500/10 text-purple-600 border-purple-200',
  'System Settings': 'bg-amber-500/10 text-amber-600 border-amber-200',
  Default: 'bg-gray-500/10 text-gray-600 border-gray-200',
};

export function UpdateRoleDialog({ role, open, onOpenChange }: UpdateRoleDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [initialData, setInitialData] = useState<Role>(role);
  const queryClient = useQueryClient();

  // Fetch all permissions
  const { data: permissionResponse, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => PermissionAPI.getPermissions(),
    enabled: open,
  });

  const permissions = permissionResponse?.data || [];
  const totalPermissions = permissions.length;

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (data: UpdateRoleFormValues) => RoleAPI.updateRole(data, role.id),
    onSuccess: (data: BaseResponse<null>) => {
      if (data.success) {
        toast.success('Role updated successfully.');
        onOpenChange(false);
        void queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      } else {
        toast.error(data.status.message || 'Failed to update role');
      }
    },
    onError: (error: { message: string; status: number }) => {
      toast.error(error.message || 'Something went wrong!');
    },
  });

  const form = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      roleName: '',
      description: '',
      permissionIds: [],
    },
  });

  // Initialize form with role data when available
  useEffect(() => {
    if (role && permissions.length > 0) {
      const permissions = role.permissions || [];

      // Map permission IDs
      const permissionIds = permissions.map((p: Permission) => p.id);

      // Find full permission objects
      const selectedPerms = permissions.filter((p) => permissionIds.includes(p.id));

      setInitialData(role);
      setSelectedPermissions(selectedPerms);

      form.reset({
        roleName: role.name || '',
        description: role.description || '',
        permissionIds: permissionIds,
      });
    }
  }, [role, permissions, form]);

  const onSubmit = (data: UpdateRoleFormValues) => {
    updateRoleMutation.mutate(data);
  };

  // Watch permissionIds for better reactivity
  const permissionIds = form.watch('permissionIds') ?? [];
  const selectedCount = permissionIds.length;

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    const currentIds = form.getValues('permissionIds') ?? [];

    if (checked) {
      if (!currentIds.includes(permission.id)) {
        const newIds = [...currentIds, permission.id];
        form.setValue('permissionIds', newIds, { shouldValidate: true });
        setSelectedPermissions((prev) => [...prev, permission]);
      }
    } else {
      const newIds = currentIds.filter((id) => id !== permission.id);
      form.setValue('permissionIds', newIds, { shouldValidate: true });
      setSelectedPermissions((prev) => prev.filter((p) => p.id !== permission.id));
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce(
    (acc: Record<string, Permission[]>, permission) => {
      const category = permission.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Filter permissions based on search
  const filteredGroups = Object.entries(groupedPermissions).reduce(
    (acc, [category, perms]) => {
      const filtered = perms.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get category stats
  const getCategoryStats = (category: string) => {
    const perms = groupedPermissions[category] || [];
    const selectedInCategory = perms.filter((p) => permissionIds.includes(p.id)).length;
    return { total: perms.length, selected: selectedInCategory };
  };

  const coveragePercentage = totalPermissions > 0 ? (selectedCount / totalPermissions) * 100 : 0;

  // Quick select all permissions
  const handleSelectAll = () => {
    const allIds = permissions.map((p) => p.id);
    form.setValue('permissionIds', allIds, { shouldValidate: true });
    setSelectedPermissions(permissions);
  };

  // Clear all selections
  const handleClearAll = () => {
    form.setValue('permissionIds', [], { shouldValidate: true });
    setSelectedPermissions([]);
  };

  // Reset to initial state
  const handleReset = () => {
    if (initialData) {
      const rolePermissions = initialData.permissions || [];
      const permissionIds = rolePermissions.map((p: Permission) => p.id);
      const selectedPerms = permissions.filter((p) => permissionIds.includes(p.id));

      form.reset({
        roleName: initialData.name || '',
        description: initialData.description || '',
        permissionIds: permissionIds,
      });
      setSelectedPermissions(selectedPerms);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          form.reset();
          setSelectedPermissions([]);
          setSearchQuery('');
          setExpandedCategories({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sidebar-menu">
              <Shield className="h-5 w-5 text-sidebar-menu-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg">Update Role</DialogTitle>
              <DialogDescription className="text-sm">
                Modify role details and permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-3">
              {/* Loading state */}
              {isLoadingPermissions && (
                <div className="h-40 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-3 text-muted-foreground">Loading role data...</p>
                </div>
              )}

              {!isLoadingPermissions && (
                <>
                  {/* Role Information Section */}
                  <div className="flex flex-col gap-5">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="roleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <span>Role Name</span>
                              <Badge variant="outline" className="text-[10px]">
                                Required
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Administrator"
                                {...field}
                                className="h-10 text-xs"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea rows={3} className="resize-none min-h-[60px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Permissions Header with Search */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-md font-semibold">Update Permissions</h3>
                        <p className="text-xs text-muted-foreground">
                          Modify permissions for this role
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleReset}
                          className="h-8 text-[12px]"
                          disabled={!initialData}
                        >
                          Reset
                        </Button>
                        {selectedCount > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearAll}
                            className="h-8 text-[12px]"
                          >
                            Clear All
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                          className="h-8 text-[12px]"
                        >
                          Select All
                        </Button>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10"
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setSearchQuery('')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Selected Permissions Summary */}
                    {selectedCount > 0 && (
                      <Card className={'py-4'}>
                        <CardContent className="px-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-[14px]">Selected Permissions</span>
                              <Badge variant="secondary" className="ml-2 text-[10px]">
                                {selectedCount}
                              </Badge>
                              {initialData?.permissions && (
                                <Badge variant="outline" className="text-[10px]">
                                  Originally: {initialData.permissions.length}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[12px] text-muted-foreground">
                              {coveragePercentage.toFixed(0)}% coverage
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>
                                {selectedCount}/{totalPermissions}
                              </span>
                            </div>
                            <Progress value={coveragePercentage} className="h-1.5" />
                          </div>

                          {/* Selected Permissions Tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedPermissions.slice(0, 5).map((permission) => (
                              <Badge
                                key={permission.id}
                                variant="outline"
                                className="pl-2 pr-1 py-1 bg-sidebar-menu text-sidebar-menu-foreground"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Tag className="h-3 w-3" />
                                  <span className="text-[10.5px]">{permission.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => handlePermissionToggle(permission, false)}
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              </Badge>
                            ))}
                            {selectedPermissions.length > 5 && (
                              <Badge variant="outline" className="pl-2 pr-2 py-1">
                                <span className="text-xs">
                                  +{selectedPermissions.length - 5} more
                                </span>
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-4">
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {Object.entries(filteredGroups).map(([category, perms]) => {
                          const stats = getCategoryStats(category);
                          const isExpanded = expandedCategories[category] ?? true;

                          return (
                            <div key={category} className="border rounded-lg overflow-hidden">
                              {/* Category Header */}
                              <div
                                className={cn(
                                  'p-2 cursor-pointer text-sm transition-colors hover:bg-accent/50',
                                  CATEGORY_COLORS[category] || CATEGORY_COLORS['Default']
                                )}
                                onClick={() => toggleCategory(category)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-background">
                                      {CATEGORY_ICONS[category] || (
                                        <Shield className="h-3.5 w-3.5" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm">{category}</h4>
                                      <p className="text-xs text-muted-foreground">
                                        {stats.selected} of {stats.total} selected
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16">
                                      <Progress
                                        value={(stats.selected / stats.total) * 100}
                                        className="h-1.5"
                                      />
                                    </div>
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Permissions List */}
                              {isExpanded && (
                                <div className="p-3 bg-background space-y-2">
                                  {perms.map((permission) => {
                                    const isSelected = permissionIds.includes(permission.id);
                                    const wasOriginallySelected = initialData?.permissions?.some(
                                      (p: Permission) => p.id === permission.id
                                    );

                                    return (
                                      <div
                                        key={permission.id}
                                        className={cn(
                                          'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors relative',
                                          isSelected
                                            ? 'bg-sidebar-menu border border-primary/20'
                                            : 'hover:bg-accent/50',
                                          wasOriginallySelected &&
                                            !isSelected &&
                                            'border-l-4 border-l-amber-500'
                                        )}
                                        onClick={() =>
                                          handlePermissionToggle(permission, !isSelected)
                                        }
                                      >
                                        {/* Change indicator */}
                                        {wasOriginallySelected !== isSelected && (
                                          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
                                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                          </div>
                                        )}

                                        <div
                                          className={cn(
                                            'h-4 w-4 rounded border flex items-center justify-center transition-colors flex-shrink-0',
                                            isSelected
                                              ? 'bg-primary border-primary'
                                              : 'bg-background border-input'
                                          )}
                                        >
                                          {isSelected && (
                                            <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <span className="font-medium text-xs truncate">
                                              {permission.name}
                                            </span>
                                            <div className="flex items-center gap-1">
                                              {wasOriginallySelected !== isSelected && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-[10px] h-5 px-1.5 bg-amber-500/10 text-amber-700 border-amber-200"
                                                >
                                                  {wasOriginallySelected ? 'Removed' : 'Added'}
                                                </Badge>
                                              )}
                                              {isSelected && (
                                                <Badge
                                                  variant="secondary"
                                                  className="text-xs h-5 px-1.5"
                                                >
                                                  Selected
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          {permission.description && (
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                              {permission.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {Object.keys(filteredGroups).length === 0 && (
                          <div className="text-center py-12">
                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                              <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h4 className="font-medium">No permissions found</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchQuery
                                ? `No results for "${searchQuery}"`
                                : 'No permissions available'}
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 border-t bg-background p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {isLoadingPermissions ? (
                    'Loading role data...'
                  ) : selectedCount === 0 ? (
                    'Select at least one permission to continue'
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>
                        Ready to update role with{' '}
                        <span className="font-medium">{selectedCount}</span> permission
                        {selectedCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={updateRoleMutation.isPending}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      updateRoleMutation.isPending || selectedCount === 0 || isLoadingPermissions
                    }
                    className="gap-2 text-sm"
                    variant={'custom'}
                    size="sm"
                  >
                    {updateRoleMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Update Role
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
