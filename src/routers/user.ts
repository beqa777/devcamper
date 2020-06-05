import express from 'express';
import UserController from '../controllers/user';
import { asyncHandler } from '../middlewares/async';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router({ mergeParams: true });
const controller = new UserController();

router.use(protect);
router.use(authorize('admin'));

// Protected
router.get('/', asyncHandler(controller.getUsers));
router.get(`/:id`, asyncHandler(controller.get))
router.post('/', asyncHandler(controller.post));
router.put(`/:id`, asyncHandler(controller.put));
router.delete(`/:id`, asyncHandler(controller.delete));


export default router;