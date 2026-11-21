import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthContextType,
  AuthUser,
  KeycloakTokenResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';
import {
  login as apiLogin,
  registerUser as apiRegister,
  verifyWithBackend,
} from '../services/auth.service';
import { storage } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<KeycloakTokenResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and restore saved session from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedTokens = await storage.getTokens();
        const savedUser = await storage.getUser();

        if (savedTokens && savedUser) {
          setTokens(savedTokens);
          setToken(savedTokens.access_token || null);
          setUser(savedUser);
        }
      } catch (err) {
        console.warn('Failed to restore session from storage', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { token: authToken, tokens: newTokens, user: newUser } = await apiLogin(credentials);

      setToken(authToken);
      setTokens(newTokens);
      setUser(newUser);

      if (credentials.rememberDevice !== false) {
        await storage.saveTokens(newTokens);
        await storage.saveUser(newUser);
      }

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiRegister(credentials);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await storage.clearAuth();
      setTokens(null);
      setToken(null);
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const verifyTokenWithBackend = async (): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> => {
    const activeToken = token || tokens?.access_token;
    if (!activeToken) {
      return { success: false, error: 'No active access token' };
    }

    try {
      const data = await verifyWithBackend(activeToken);
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tokens,
        isAuthenticated: !!(token || tokens?.access_token),
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        verifyTokenWithBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
