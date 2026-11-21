import { Response, NextFunction } from 'express';
import { keycloakService } from '../services/keycloak.service.js';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/auth.types.js';

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  try {
    const introspect = await keycloakService.introspectToken(token);

    const user: AuthenticatedUser = {
      id: introspect.sub || '',
      email: introspect.email || '',
      username: introspect.preferred_username || introspect.username || introspect.email || '',
      name:
        introspect.name ||
        `${introspect.given_name || ''} ${introspect.family_name || ''}`.trim() ||
        introspect.preferred_username ||
        '',
      roles: introspect.realm_access?.roles || [],
      raw: introspect,
    };

    req.user = user;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid or expired Keycloak token';
    res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }
};
