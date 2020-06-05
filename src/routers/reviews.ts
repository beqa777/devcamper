import express from 'express';
import ReviewController from '../controllers/review';
import { asyncHandler } from '../middlewares/async';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router({ mergeParams: true });
const controller = new ReviewController();

// Public
router.get('/', asyncHandler(controller.getReviews));
router.get(`/:id`, asyncHandler(controller.get))

// Protected
router.post('/', protect, authorize('user', 'admin'), asyncHandler(controller.post));
router.put(`/:id`, protect, authorize('user', 'admin'), asyncHandler(controller.put));
router.delete(`/:id`, protect, authorize('user', 'admin'), asyncHandler(controller.delete));


export default router;