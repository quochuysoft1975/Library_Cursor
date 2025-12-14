import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema
} from '../validations/category.validation.js';

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

// GET /api/categories - Get all categories (accessible to all authenticated users for viewing)
router.get('/', getAllCategories);

// POST /api/categories - Create category (only librarians and admins)
router.post(
  '/',
  authorize('librarian', 'admin'),
  validate(createCategorySchema),
  createCategory
);

// PATCH /api/categories/:id - Update category (only librarians and admins)
router.patch(
  '/:id',
  authorize('librarian', 'admin'),
  validate(updateCategorySchema),
  updateCategory
);

// DELETE /api/categories/:id - Delete category (only librarians and admins)
router.delete(
  '/:id',
  authorize('librarian', 'admin'),
  deleteCategory
);

export default router;

