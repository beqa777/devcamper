import express from 'express';
import BootcampsController from '../controllers/bootcamps';
import { asyncHandler } from '../middlewares/async';
import { protect, authorize } from '../middlewares/auth';
import courseRouter from '../routers/courses';
import reviewRouter from '../routers/reviews';


const router = express.Router();
const controller = new BootcampsController();


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

// Public
router.get('/', asyncHandler(controller.all));
router.get(`/:id`, asyncHandler(controller.get));
router.get(`/radius/:zipcode/:distance`, asyncHandler(controller.getBootcampInRadius));

// Protected
router.post('/', protect, authorize('publisher', 'admin'), asyncHandler(controller.post));
router.put(`/:id`, protect, authorize('publisher', 'admin'), asyncHandler(controller.put));
router.delete(`/:id`, protect, authorize('publisher', 'admin'), asyncHandler(controller.delete));
router.put(`/:id/photo`, protect, authorize('publisher', 'admin'), asyncHandler(controller.bootcampPhotoUpload));


export default router;