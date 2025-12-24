'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  KeyRound,
  LogOut,
  Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/providers/AuthProvider';
import { getAvatarColor, getFullName, getTextColor, getUserInitials } from '@/lib/utils/user-utils';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, signOut } = useAuthentication();
  const router = useRouter();
  console.log("user", user);

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
    router.refresh();
    console.log('Logged out!');
  };

  // Get avatar color based on name
  const avatarColor = getAvatarColor(getFullName(user));
  const textColor = getTextColor(avatarColor);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus:outline-none cursor-pointer
             ring-0 focus:ring-0 focus-visible:ring-0"
        >
          <Avatar className="h-9 w-9 rounded-3xl">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className={`${avatarColor} ${textColor}`}>
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{getFullName(user)}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>

          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={6}
        className="min-w-56 rounded-lg p-2"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className={`${avatarColor} ${textColor}`}>
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="grid text-sm">
              <span className="font-medium">{getFullName(user)}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className={'py-2'}>
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className={'py-2'}>
          <BadgeCheck className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>

        <DropdownMenuItem className={'py-2'}>
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenuItem>

        <DropdownMenuItem className={'py-2'}>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push('/setting/change-password')}
          className={'py-2'}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 py-2">
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
