import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/auth.types.js';
import User from '../models/User.js';

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
    const decoded = jwt.verify(
      token,
      ENV.JWT_SECRET || 'autocare360_ayuni_dev_secret_2026_change_later'
    ) as { id: string };
    const dbUser = await User.findById(decoded.id);

    if (!dbUser) {
      res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
      return;
    }

    const user: AuthenticatedUser = {
      id: dbUser._id.toString(),
      email: dbUser.email,
      username: dbUser.email,
      name: dbUser.fullName,
      roles: [dbUser.role],
    };
    req.user = user;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid or expired token';
    res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }
};
