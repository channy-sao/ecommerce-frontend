import { useAuthentication } from '@/providers/AuthProvider';

export const useRole = (role: string) => {
  const { roles } = useAuthentication();
  return roles.map((r) => r.name.includes(role)) ?? false;
};
