import { Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { keycloakService } from '../services/keycloak.service.js';
import { AuthenticatedRequest, RegisterUserInput } from '../types/auth.types.js';
import { ENV } from '../config/env.js';
import User from '../models/User.js';

const generateToken = (userId: string, role: string, email: string): string => {
  const secret: Secret = ENV.JWT_SECRET || 'autocare360_ayuni_dev_secret_2026_change_later';
  const options: SignOptions = {
    expiresIn: (ENV.JWT_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign({ id: userId, role, email }, secret, options);
};

export const handleLogin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, username, password, role, selectedRole } = req.body;
  const loginIdentifier = (email || username || '').trim().toLowerCase();

  if (!loginIdentifier || !password) {
    res.status(400).json({
      success: false,
      error: 'BadRequest',
      message: 'Please provide both email/username and password.',
    });
    return;
  }

  const requestedRole = (role || selectedRole || '').trim().toLowerCase();

  try {
    // 1. First attempt: Authenticate against MongoDB User collection (matches AutoCare 360 Web Backend)
    const dbUser = await User.findOne({
      $or: [{ email: loginIdentifier }, { fullName: new RegExp(`^${loginIdentifier}$`, 'i') }],
    });

    if (dbUser) {
      const isMatch = await dbUser.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid credentials. Incorrect password.',
        });
        return;
      }

      // Check role matching if requested
      if (requestedRole && dbUser.role !== requestedRole) {
        res.status(403).json({
          success: false,
          error: 'RoleMismatch',
          message: `Role mismatch. Your account is registered as '${dbUser.role}', but you attempted to sign in as '${requestedRole}'.`,
        });
        return;
      }

      if (dbUser.status === 'suspended') {
        res.status(403).json({
          success: false,
          error: 'AccountSuspended',
          message: 'Your account has been suspended. Please contact support.',
        });
        return;
      }

      const token = generateToken(dbUser._id.toString(), dbUser.role, dbUser.email);

      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: {
          user: {
            _id: dbUser._id,
            id: dbUser._id,
            fullName: dbUser.fullName,
            name: dbUser.fullName,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            roles: [dbUser.role],
            status: dbUser.status,
            displayName: dbUser.displayName || dbUser.fullName,
            profileImage: dbUser.profileImage,
          },
          token,
        },
      });
      return;
    }

    // 2. Fallback: Authenticate directly against Keycloak IAM if configured
    try {
      const tokenUrl = `${ENV.KEYCLOAK_URL}/realms/${ENV.KEYCLOAK_REALM}/protocol/openid-connect/token`;
      const kcBody = new URLSearchParams({
        client_id: ENV.KEYCLOAK_SERVICE_ACCOUNT_CLIENT,
        client_secret: ENV.KEYCLOAK_SERVICE_ACCOUNT_SECRET,
        grant_type: 'password',
        username: loginIdentifier,
        password,
      });

      const kcResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: kcBody.toString(),
      });

      if (kcResponse.ok) {
        const tokenData = (await kcResponse.json()) as any;
        res.status(200).json({
          success: true,
          message: 'Keycloak IAM authentication successful.',
          data: {
            user: {
              email: loginIdentifier,
              name: loginIdentifier,
              role: requestedRole || 'owner',
              roles: [requestedRole || 'owner'],
            },
            token: tokenData.access_token,
            tokens: tokenData,
          },
        });
        return;
      }
    } catch {
      // Keycloak fallback error suppressed
    }

    // If neither succeeded
    res.status(401).json({
      success: false,
      error: 'InvalidCredentials',
      message: 'Invalid credentials. No account found with this email.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error during authentication';
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message,
    });
  }
};

export const handleSignup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, firstName, lastName, fullName, phone, password, username, role } = req.body as Partial<
    RegisterUserInput & { fullName?: string; phone?: string; role?: string }
  >;

  const assignedRole = role === 'garage' ? 'garage' : 'owner';
  const resolvedEmail = (email || '').trim().toLowerCase();
  const resolvedName = (fullName || `${firstName || ''} ${lastName || ''}`).trim();

  // Input validation
  if (!resolvedEmail) {
    res.status(400).json({ success: false, error: 'BadRequest', message: 'Email is required' });
    return;
  }
  if (!resolvedName) {
    res.status(400).json({ success: false, error: 'BadRequest', message: 'Full name is required' });
    return;
  }
  if (!password || password.length < 6) {
    res.status(400).json({
      success: false,
      error: 'BadRequest',
      message: 'Password is required and must be at least 6 characters long',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(resolvedEmail)) {
    res.status(400).json({ success: false, error: 'BadRequest', message: 'Invalid email address format' });
    return;
  }

  try {
    // Check if user already exists in MongoDB
    const existing = await User.findOne({ email: resolvedEmail });
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const newUser = await User.create({
      fullName: resolvedName,
      email: resolvedEmail,
      phone: phone?.trim() || '0770000000',
      password,
      role: assignedRole,
      status: assignedRole === 'garage' ? 'pending' : 'active',
    });

    const token = generateToken(newUser._id.toString(), newUser.role, newUser.email);

    // Also attempt registering in Keycloak in background if available
    keycloakService
      .createUser({
        email: resolvedEmail,
        firstName: firstName?.trim() || resolvedName.split(' ')[0] || resolvedName,
        lastName: lastName?.trim() || resolvedName.split(' ').slice(1).join(' ') || 'User',
        password,
        username: username?.trim() || resolvedEmail,
      })
      .catch(() => {});

    res.status(201).json({
      success: true,
      message:
        assignedRole === 'garage'
          ? 'Garage partner account created and pending verification.'
          : 'Vehicle owner account registered successfully.',
      data: {
        user: {
          _id: newUser._id,
          id: newUser._id,
          fullName: newUser.fullName,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          status: newUser.status,
        },
        token,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    res.status(400).json({ success: false, error: 'SignupFailed', message });
  }
};

export const handleGetMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user) {
    res.status(200).json({
      success: true,
      authenticated: true,
      data: {
        user: req.user,
      },
    });
    return;
  }

  // Check Bearer JWT from header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET || 'autocare360_ayuni_dev_secret_2026_change_later') as any;
      const user = await User.findById(decoded.id);
      if (user) {
        res.status(200).json({
          success: true,
          authenticated: true,
          data: {
            user: {
              _id: user._id,
              id: user._id,
              fullName: user.fullName,
              name: user.fullName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              status: user.status,
            },
          },
        });
        return;
      }
    } catch {
      // Token verify failed
    }
  }

  res.status(401).json({ success: false, error: 'Unauthorized', message: 'Not authenticated' });
};

export const handleAuthStatus = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await keycloakService.getSecureApiToken();
    res.status(200).json({
      status: 'Connected',
      keycloak: {
        serverUrl: ENV.KEYCLOAK_URL,
        realm: ENV.KEYCLOAK_REALM,
        serviceAccountClient: ENV.KEYCLOAK_SERVICE_ACCOUNT_CLIENT,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Keycloak connection error';
    res.status(200).json({
      status: 'Degraded',
      keycloak: 'Offline',
      database: 'Connected',
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
};
