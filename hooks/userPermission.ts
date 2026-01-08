import { useAuthentication } from '@/providers/AuthProvider';

export const usePermission = (permission: string) => {
  const { user, permissions } = useAuthentication();
  return permissions.map((p) => p.name.includes(permission)) ?? false;
};
