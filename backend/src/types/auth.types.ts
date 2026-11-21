import { Request } from 'express';

export interface RegisterUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username?: string;
}

export interface KeycloakCredential {
  type: 'password';
  value: string;
  temporary: boolean;
}

export interface KeycloakUserRepresentation {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  credentials?: KeycloakCredential[];
  attributes?: Record<string, string[]>;
}

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type: string;
  scope?: string;
  session_state?: string;
}

export interface KeycloakIntrospectResponse {
  active: boolean;
  sub?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  username?: string;
  client_id?: string;
  exp?: number;
  iat?: number;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
  [key: string]: unknown;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  name: string;
  roles: string[];
  raw?: KeycloakIntrospectResponse;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
