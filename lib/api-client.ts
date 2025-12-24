import { getAccessToken } from '@/lib/utils/cookies';
import { refreshAccessToken } from '@/lib/utils/refresh';

class ApiClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ) {
    const token = await getAccessToken();
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`/api/proxy/${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    });

    // 🔁 AUTO REFRESH ON 401
    if (res.status === 401 && retry) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Retry original request ONCE
        return this.fetchWithAuth(endpoint, options, false);
      }

      // Refresh failed → logout required
      throw {
        status: 401,
        message: 'Session expired',
      };
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid server response');
    }

    // Only throw for REAL system failures
    if (!res.ok && res.status >= 500) {
      throw {
        status: res.status,
        message: data?.status?.message || 'Server error',
      };
    }

    return data;
  }
}

export const HttpClient = new ApiClient();
