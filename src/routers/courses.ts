import express from 'express';
import CourseController from '~/controllers/courses';
import { asyncHandler } from '~/middlewares/async';
import { protect } from '~/middlewares/auth';

const router = express.Router({ mergeParams: true });
const controller = new CourseController();

// Public
router.get('/', asyncHandler(controller.getCourses));
router.get(`/:id`, asyncHandler(controller.get))

// Protected
router.post('/', protect, asyncHandler(controller.post));
router.put(`/:id`, protect, asyncHandler(controller.put));
router.delete(`/:id`, protect, asyncHandler(controller.delete));


export default router;