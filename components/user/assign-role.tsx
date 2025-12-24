import { User } from 'next-auth';
import { Role } from '@/lib/types/role';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Shield } from 'lucide-react';
import React from 'react';
import { UserResponse } from '@/lib/types/user';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignRoles: (userId: number, roleIds: number[]) => Promise<void>;
  user: UserResponse;
  roles: Role[];
  isLoading: boolean;
}

export default function AssignRoleDialog({
  open,
  onOpenChange,
  onAssignRoles,
  roles,
  user,
  isLoading,
}: AssignRoleDialogProps) {
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Reset selected roles when user changes
  React.useEffect(() => {
    if (user) {
      // Assuming user.roles is an array of role IDs or role objects
      const userRoleIds = Array.isArray(user.roles) ? user.roles.map((role) => role.id) : [];
      setSelectedRoleIds(userRoleIds);
    }
  }, [user]);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoleIds.length === filteredRoles.length) {
      // Deselect all
      setSelectedRoleIds([]);
    } else {
      // Select all filtered
      setSelectedRoleIds(filteredRoles.map((role) => role.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await onAssignRoles(user.id, selectedRoleIds);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign roles:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sidebar-menu">
                <Shield className="h-5 w-5 text-sidebar-menu-foreground" />
              </div>
              <div className={'space-y-2'}>
                <DialogTitle>Assign Roles to User</DialogTitle>
                <DialogDescription>
                  Assign roles to <span className={'font-semi-bold'}>{user.fullName}</span>
                </DialogDescription>

              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Roles Count Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label>Selected: </Label>
                <Badge variant="secondary">{selectedRoleIds.length} roles</Badge>
              </div>
              {filteredRoles.length > 0 && (
                <Button type="button" variant="custom" size="sm" onClick={handleSelectAll}>
                  {selectedRoleIds.length === filteredRoles.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </div>

            {/* Roles List */}
            <ScrollArea className="h-[350px] rounded-md border p-4">
              <div className="space-y-3">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start space-x-3 rounded-lg border p-3 "
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`role-${role.id}`} className="font-medium cursor-pointer">
                          {role.name}
                        </Label>
                        <Badge variant="outline" className="text-xs bg-green-500 text-white">
                          {role.permissions?.length || 0} permissions
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                      {role.permissions && role.permissions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission.id} variant="secondary" className="text-xs bg-sidebar-menu text-sidebar-menu-foreground">
                              {permission.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-sidebar-menu text-sidebar-menu-foreground">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredRoles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2" />
                  <p>No roles found matching &#34;${searchQuery}&#34;</p>
                </div>
              )}
            </ScrollArea>

            {/* Selected Roles Preview */}
            {selectedRoleIds.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Roles Preview:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRoleIds.map((roleId) => {
                    const role = roles.find((r) => r.id === roleId);
                    return role ? (
                      <Badge key={roleId} variant="default" className={'bg-sidebar-menu text-sidebar-menu-foreground text-xs'}>
                        {role.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className={'text-sm'}
            >
              Cancel
            </Button>
            <Button type="submit" size={'sm'} variant={'custom'} className={'text-sm'} disabled={isLoading || selectedRoleIds.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign {selectedRoleIds.length > 0 ? `(${selectedRoleIds.length})` : ''} Roles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
