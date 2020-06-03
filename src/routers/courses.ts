import express from 'express';
import CourseController from '~/controllers/courses';
import { asyncHandler } from '~/middlewares/async';
import { protect, authorize } from '~/middlewares/auth';

const router = express.Router({ mergeParams: true });
const controller = new CourseController();

// Public
router.get('/', asyncHandler(controller.getCourses));
router.get(`/:id`, asyncHandler(controller.get))

// Protected
router.post('/', protect, authorize('publisher', 'admin'), asyncHandler(controller.post));
router.put(`/:id`, protect, authorize('publisher', 'admin'), asyncHandler(controller.put));
router.delete(`/:id`, protect, authorize('publisher', 'admin'), asyncHandler(controller.delete));


export default router;