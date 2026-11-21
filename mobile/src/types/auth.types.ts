export type AuthRole = 'owner' | 'garage' | 'admin';

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type: string;
  id_token?: string;
  scope?: string;
  session_state?: string;
}

export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  username?: string;
  name: string;
  fullName?: string;
  phone?: string;
  role: AuthRole;
  roles: string[];
  status?: 'active' | 'pending' | 'suspended';
  displayName?: string;
  profileImage?: string;
  city?: string;
  country?: string;
}

export interface LoginCredentials {
  username: string; // or email
  password: string;
  role?: AuthRole;
  selectedRole?: AuthRole;
  rememberDevice?: boolean;
}

export interface RegisterCredentials {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'owner' | 'garage';
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  tokens: KeycloakTokenResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyTokenWithBackend: () => Promise<{ success: boolean; data?: any; error?: string }>;
}
