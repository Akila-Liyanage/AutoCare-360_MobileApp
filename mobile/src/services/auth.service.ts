import { APP_CONFIG } from '../constants/config';
import {
  KeycloakTokenResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthRole,
} from '../types/auth.types';

export const decodeJwtPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let rawStr = '';
    const str = base64.replace(/=+$/, '');
    for (
      let bc = 0, bs = 0, buffer: number, idx = 0;
      (buffer = str.charCodeAt(idx++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (rawStr += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(String.fromCharCode(buffer));
    }

    return JSON.parse(decodeURIComponent(escape(rawStr)));
  } catch (error) {
    console.warn('Failed to parse JWT payload', error);
    return null;
  }
};

/**
 * 1. LOGIN: Send credentials to AutoCare 360 Backend REST API (/api/auth/login)
 * Supports role validation ('owner', 'garage', 'admin') matching Web App
 */
export const login = async (
  credentials: LoginCredentials
): Promise<{ token: string; tokens: KeycloakTokenResponse; user: AuthUser }> => {
  const { username, password, role, selectedRole } = credentials;
  const requestedRole = (selectedRole || role || 'owner') as AuthRole;
  const normalizedEmail = username.trim().toLowerCase();

  const primaryLoginUrl = `${APP_CONFIG.API_BASE_URL}/api/auth/login`;

  let networkError: Error | null = null;
  try {
    const response = await fetch(primaryLoginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        username: normalizedEmail,
        password,
        role: requestedRole,
        selectedRole: requestedRole,
      }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data) {
      const token = data.data?.token || data.token;
      const rawUser = data.data?.user || data.user || {};

      const user: AuthUser = {
        id: rawUser._id || rawUser.id || 'usr-1',
        _id: rawUser._id || rawUser.id || 'usr-1',
        email: rawUser.email || normalizedEmail,
        name: rawUser.fullName || rawUser.name || rawUser.displayName || normalizedEmail,
        fullName: rawUser.fullName || rawUser.name,
        phone: rawUser.phone,
        role: (rawUser.role || requestedRole) as AuthRole,
        roles: rawUser.roles || [rawUser.role || requestedRole],
        status: rawUser.status || 'active',
        displayName: rawUser.displayName,
        profileImage: rawUser.profileImage,
        city: rawUser.city,
        country: rawUser.country,
      };

      const tokens: KeycloakTokenResponse = {
        access_token: token,
        expires_in: 604800,
        token_type: 'Bearer',
      };

      return { token, tokens, user };
    }

    // Handle authentication error responses from backend
    if (data?.message) {
      throw new Error(data.message);
    }
    if (response.status === 401) {
      throw new Error('Invalid credentials. Incorrect email or password.');
    }
    if (response.status === 403) {
      throw new Error(`Role mismatch. Your account cannot sign in as '${requestedRole}'.`);
    }
    throw new Error(`Login failed with status ${response.status}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      // If error message is from backend logic (e.g. invalid credentials or role mismatch), throw it immediately
      if (
        err.message.includes('Invalid credentials') ||
        err.message.includes('Role mismatch') ||
        err.message.includes('suspended') ||
        err.message.includes('Password') ||
        err.message.includes('account')
      ) {
        throw err;
      }
      networkError = err;
    }
  }

  // Fallback: If backend server is unreachable, attempt direct Keycloak IAM login
  try {
    const kcUrl = `${APP_CONFIG.KEYCLOAK_URL}/realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.append('client_id', APP_CONFIG.KEYCLOAK_CLIENT_ID);
    body.append('grant_type', 'password');
    body.append('username', normalizedEmail);
    body.append('password', password);

    const kcResponse = await fetch(kcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (kcResponse.ok) {
      const tokens: KeycloakTokenResponse = await kcResponse.json();
      const payload = decodeJwtPayload(tokens.access_token) || {};
      const user: AuthUser = {
        id: payload.sub || 'kc-user',
        _id: payload.sub || 'kc-user',
        email: payload.email || normalizedEmail,
        username: payload.preferred_username || normalizedEmail,
        name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim() || normalizedEmail,
        fullName: payload.name,
        role: requestedRole,
        roles: payload.realm_access?.roles || [requestedRole],
        status: 'active',
      };
      return { token: tokens.access_token, tokens, user };
    }
  } catch {
    // Keycloak fallback also failed
  }

  throw new Error(
    networkError?.message ||
      'Unable to connect to AutoCare 360 backend. Please check your network connection and ensure the backend is running.'
  );
};

/**
 * 2. SIGN UP: Send registration payload to AutoCare 360 backend
 */
export const registerUser = async (
  payload: RegisterCredentials
): Promise<{ success: boolean; message: string; user?: any; token?: string }> => {
  const url = `${APP_CONFIG.API_BASE_URL}/api/auth/register`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: payload.fullName || `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone || '0770000000',
      password: payload.password,
      role: payload.role || 'owner',
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'Registration failed';
    throw new Error(errorMsg);
  }

  return {
    success: true,
    message: data?.message || 'Account registered successfully!',
    user: data?.data?.user || data?.user,
    token: data?.data?.token || data?.token,
  };
};

/**
 * 3. Token Verification with Backend (/api/auth/me)
 */
export const verifyWithBackend = async (accessToken: string): Promise<any> => {
  const url = `${APP_CONFIG.API_BASE_URL}/api/auth/me`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend verification failed (${response.status}): ${errorText}`);
  }

  return await response.json();
};

export default {
  login,
  registerUser,
  verifyWithBackend,
};
