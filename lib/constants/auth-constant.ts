// Authentication constants
export const COOKIE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const;


export const AUTH_ERRORS = {
    UNAUTHORIZED: 'Unauthorized',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    NO_REFRESH_TOKEN: 'No refresh token available or expired',
} as const;