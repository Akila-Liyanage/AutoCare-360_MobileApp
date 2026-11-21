import { ENV } from '../config/env.js';
import {
  RegisterUserInput,
  KeycloakUserRepresentation,
  KeycloakTokenResponse,
  KeycloakIntrospectResponse,
} from '../types/auth.types.js';

class KeycloakService {
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  /**
   * Helper to get secure Keycloak Admin API token using client credentials grant
   */
  async getSecureApiToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    // Reuse cached service account token if still valid for at least 30 more seconds
    if (this.cachedToken && this.tokenExpiresAt - now > 30) {
      return this.cachedToken;
    }

    const tokenUrl = `${ENV.KEYCLOAK_URL}/realms/${ENV.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: ENV.KEYCLOAK_SERVICE_ACCOUNT_CLIENT,
      client_secret: ENV.KEYCLOAK_SERVICE_ACCOUNT_SECRET,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to authenticate backend service account with Keycloak (Status: ${response.status}): ${errorText}`
        );
      }

      const data = (await response.json()) as KeycloakTokenResponse;
      this.cachedToken = data.access_token;
      this.tokenExpiresAt = now + (data.expires_in || 300);
      return this.cachedToken;
    } catch (err: unknown) {
      this.cachedToken = null;
      this.tokenExpiresAt = 0;
      throw err;
    }
  }

  /**
   * Create a new user in Keycloak via Admin API
   */
  async createUser(userData: RegisterUserInput): Promise<{ id?: string; message: string }> {
    const secureToken = await this.getSecureApiToken();
    const adminUsersUrl = `${ENV.KEYCLOAK_URL}/admin/realms/${ENV.KEYCLOAK_REALM}/users`;

    const normalizedEmail = userData.email.trim().toLowerCase();
    const username = (userData.username || normalizedEmail).trim();

    const payload: KeycloakUserRepresentation = {
      username,
      email: normalizedEmail,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: userData.password,
          temporary: false,
        },
      ],
    };

    const response = await fetch(adminUsersUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secureToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      // Keycloak returns 201 Created and sends new user's URL in the Location header
      const location = response.headers.get('location') || '';
      const userId = location ? location.split('/').pop() : undefined;
      return {
        id: userId,
        message: 'User created securely in Keycloak!',
      };
    }

    // Handle error responses
    let errorMessage = 'Failed to create user in Keycloak';
    try {
      const errorJson = (await response.json()) as { errorMessage?: string; error?: string };
      errorMessage = errorJson.errorMessage || errorJson.error || errorMessage;
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }

    if (response.status === 409) {
      throw new Error(`User with email/username "${normalizedEmail}" already exists`);
    }

    throw new Error(`Keycloak user creation failed (Status ${response.status}): ${errorMessage}`);
  }

  /**
   * Validate access token using Keycloak Token Introspection (RFC 7662)
   */
  async introspectToken(token: string): Promise<KeycloakIntrospectResponse> {
    const introspectUrl = `${ENV.KEYCLOAK_URL}/realms/${ENV.KEYCLOAK_REALM}/protocol/openid-connect/token/introspect`;
    const body = new URLSearchParams({
      client_id: ENV.KEYCLOAK_SERVICE_ACCOUNT_CLIENT,
      client_secret: ENV.KEYCLOAK_SERVICE_ACCOUNT_SECRET,
      token,
    });

    const response = await fetch(introspectUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token introspection failed (Status ${response.status})`);
    }

    const data = (await response.json()) as KeycloakIntrospectResponse;
    if (!data.active) {
      throw new Error('Keycloak access token is expired or inactive');
    }

    return data;
  }
}

export const keycloakService = new KeycloakService();
