'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: number;
  name: string;
  avatar: string;
  project: string;
  time: string;
  status: 'read' | 'unread';
}

const notifications: Notification[] = [
  {
    id: 1,
    name: 'Terry Franci',
    avatar: '/avatars/1.jpg',
    project: 'Project - Nganter App',
    time: '5 min ago',
    status: 'unread',
  },
  {
    id: 2,
    name: 'Alena Franci',
    avatar: '/avatars/2.jpg',
    project: 'Project - Nganter App',
    time: '8 min ago',
    status: 'unread',
  },
  {
    id: 3,
    name: 'Jocelyn Kenter',
    avatar: '/avatars/3.jpg',
    project: 'Project - Nganter App',
    time: '15 min ago',
    status: 'unread',
  },
  {
    id: 4,
    name: 'Brandon Philips',
    avatar: '/avatars/4.jpg',
    project: 'Project - Nganter App',
    time: '1 hr ago',
    status: 'read',
  },
  {
    id: 5,
    name: 'Terry Franci',
    avatar: '/avatars/1.jpg',
    project: 'Project - Nganter App',
    time: '5 min ago',
    status: 'unread',
  },
  {
    id: 6,
    name: 'Alena Franci',
    avatar: '/avatars/2.jpg',
    project: 'Project - Nganter App',
    time: '8 min ago',
    status: 'unread',
  },
  {
    id: 7,
    name: 'Jocelyn Kenter',
    avatar: '/avatars/3.jpg',
    project: 'Project - Nganter App',
    time: '15 min ago',
    status: 'unread',
  },
  {
    id: 8,
    name: 'Brandon Philips',
    avatar: '/avatars/4.jpg',
    project: 'Project - Nganter App',
    time: '1 hr ago',
    status: 'read',
  },
];

export function Notification() {
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full ring-0 focus:ring-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 rounded-full h-4 w-4 p-0 text-[0.625rem] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 max-h-96 p-2 rounded-lg flex flex-col overflow-hidden"
        side="bottom"
      >
        <h3 className="text-md font-semibold px-3 py-2">Notification</h3>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {notifications.map((n, index) => (
            <React.Fragment key={n.id}>
              {index === 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem className="flex items-start gap-3 p-3 hover:bg-muted cursor-pointer">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={n.avatar} />
                  <AvatarFallback>
                    {n.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    <span className="font-medium">{n.name}</span> requests permission to change{' '}
                    <span className="font-semibold">{n.project}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span
                className={`h-2 w-2 rounded-full ${n.status === 'unread' ? 'bg-green-500' : 'bg-red-500'}`}
              />
                    <span>{n.time}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              {index < notifications.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 sticky bottom-0 bg-background"
          onClick={() => console.log('View All Notifications')}
        >
          View All Notifications
        </Button>
      </DropdownMenuContent>

    </DropdownMenu>
  );
}
