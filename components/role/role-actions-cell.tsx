
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
import { Role } from '@/lib/types/role';
import { UpdateRoleDialog } from '@/components/role/edit-role-dialog';

interface RoleActionsCellProps {
  role: Role;
}

export function RoleActionsCell({ role }: RoleActionsCellProps) {
  const [editRole, setEditRole] = useState<Role | null>(null);

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
          <DropdownMenuItem onClick={() => setEditRole(role)}>Edit Role</DropdownMenuItem>
          <DropdownMenuItem>View Category details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editRole && (
        <UpdateRoleDialog
          role={editRole}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditRole(null);
          }}
        />
      )}
    </>
  );
}
