// lib/utils/user-utils.ts
import { UserResponse } from '@/lib/types/auth';

// Get user initials for avatar fallback
export const getUserInitials = (user?: UserResponse | null): string => {
  if (!user) return '';

  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return ''; // Return empty string instead of 'U'
};

// Get full name
export const getFullName = (user?: UserResponse | null): string => {
  if (!user) return '';

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.email || '';
};

export function getAvatarColor(name: string) {
  if (!name) return 'bg-gray-500'; // Default color for empty names

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-orange-500',
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getTextColor(bgColor: string) {
  const lightBackgrounds = ['bg-yellow-500', 'bg-cyan-500', 'bg-teal-500'];
  return lightBackgrounds.includes(bgColor)
    ? 'text-gray-900'
    : 'text-white';
}

// 🎯 NEW: Check if user data is complete
export const isUserDataComplete = (user?: UserResponse | null): boolean => {
  if (!user) return false;
  return !!(user.email || (user.firstName && user.lastName));
};