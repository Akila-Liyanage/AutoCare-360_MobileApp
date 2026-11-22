import { Request } from 'express';

export interface RegisterUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  name: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
