import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profile.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validations/profile.validation.js';

const router = express.Router();

// All profile routes require authentication and reader role
router.use(authenticate);
router.use(authorize('reader'));

// Get profile
router.get('/', getProfile);

// Update profile
router.put('/', validate(updateProfileSchema), updateProfile);

// Change password
router.put('/password', validate(changePasswordSchema), changePassword);

export default router;



