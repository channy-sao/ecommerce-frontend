'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AssignRoleToUserRequest, UserResponse } from '@/lib/types/user';
import DeleteUserDialog from '@/components/user/delete-user-dialog';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserAPI, USERS_QUERY_KEY } from '@/lib/api/user';
import UpdateStatusUser from '@/components/user/update-status-user';
import { BaseResponse } from '@/lib/types/base-response';
import AssignRoleDialog from '@/components/user/assign-role';
import { Role } from '@/lib/types/role';
import { RoleAPI, ROLES_QUERY_KEY } from '@/lib/api/role';
import { UpdateUserDialog } from '@/components/user/update-user-dialog';

interface UserActionsCellProps {
  user: UserResponse;
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UserResponse | null>(null);
  const [userForAssign, setUserForAssign] = useState<UserResponse | null>(null);

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => UserAPI.deleteUser(userId),
    onSuccess: (data: BaseResponse<null>) => {
      if (data.success) {
        toast.success('User deleted successfully.');
        setDeleteUser(null); // close dialog
        queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      } else {
        toast.error(data.status.message);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete user');
    },
  });

  const { data: rolesResponse } = useQuery<BaseResponse<Role[]>>({
    queryFn: () => RoleAPI.getRoles(),
    queryKey: [ROLES_QUERY_KEY],
  });

  const changeStatusUserMutation = useMutation({
    mutationFn: async ({ status, userId }: { status: boolean; userId: number }) =>
      UserAPI.updateStatus(status, userId),
    onSuccess: (data: BaseResponse<null>, variables) => {
      const statusText = variables.status ? 'Enabled' : 'Disabled';
      if (data.success) {
        toast.success(`User ${statusText} successfully.`);
        setUpdateStatus(null); // close dialog
        queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        return;
      } else {
        toast.error(`User ${statusText} Failed. ${data.status.message}`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete user');
    },
  });

  const handleDelete = () => {
    if (deleteUser) deleteUserMutation.mutate(deleteUser.id);
  };

  const handleChangeStatus = () => {
    if (updateStatus)
      changeStatusUserMutation.mutate({ status: !updateStatus.isActive, userId: updateStatus.id });
  };

  // Assign roles mutation
  const assignRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds }: { userId: number; roleIds: number[] }) =>
      UserAPI.assignRole({ roleIds: roleIds } as AssignRoleToUserRequest, userId),
    onSuccess: (data, variables) => {
      toast.success(`Assigned ${variables.roleIds.length} role(s) successfully`);
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error, variables) => {
      console.error('Failed to assign roles:', error);
      toast.error(`Failed to assign ${variables.roleIds.length} role(s)`);
    },
  });

  const handleAssignRoles = async (userId: number, roleIds: number[]) => {
    await assignRolesMutation.mutateAsync({ userId, roleIds });
    setUserForAssign(null); // Close dialog on success
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant={'custom-blue'} onClick={() => setEditUser(true)}>
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem variant={'custom-blue'} onClick={() => setUserForAssign(user)}>
            Assign Role
          </DropdownMenuItem>
          <DropdownMenuItem variant={'custom-blue'}>User details</DropdownMenuItem>
          <DropdownMenuItem variant={'custom-blue'} onClick={() => setUpdateStatus(user)}>
            {user.isActive ? 'Disable User' : 'Enable User'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={'custom-blue'}
            onClick={() => {
              setDeleteUser(user);
            }}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateUserDialog
        open={editUser}
        onOpenChange={setEditUser}
        user={user}
      />

      {deleteUser && (
        <DeleteUserDialog
          userName={deleteUser.fullName!}
          open={true}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setDeleteUser(null);
            }
          }}
          onDelete={handleDelete}
        />
      )}

      {userForAssign && (
        <AssignRoleDialog
          open={true}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setUserForAssign(null);
            }
          }}
          onAssignRoles={handleAssignRoles}
          user={userForAssign!}
          isLoading={assignRolesMutation.isPending}
          roles={rolesResponse?.data || []}
        />
      )}

      {updateStatus && (
        <UpdateStatusUser
          open={true}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setUpdateStatus(null);
            }
          }}
          onTrigger={handleChangeStatus}
        />
      )}
    </>
  );
}
