import { Router } from 'express';
import { handleSignup, handleLogin, handleGetMe, handleAuthStatus } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Login endpoints (both /login and /api/auth/login are supported)
router.post('/login', handleLogin);
router.post('/api/auth/login', handleLogin);

// Registration endpoints (both /signup and /api/auth/signup, /api/auth/register are supported)
router.post('/signup', handleSignup);
router.post('/api/auth/signup', handleSignup);
router.post('/api/auth/register', handleSignup);

// Authenticated user profile endpoint
router.get('/api/auth/me', handleGetMe);

// Diagnostic status endpoint
router.get('/api/auth/status', handleAuthStatus);

export default router;
