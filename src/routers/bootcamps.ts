import express from 'express';
import BootcampsController from '~/controllers/bootcamps';
import { asyncHandler } from '~/middlewares/async';
import { protect } from '~/middlewares/auth';
import courseRouter from '~/routers/courses';


const router = express.Router();
const controller = new BootcampsController();


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

// Public
router.get('/', asyncHandler(controller.all));
router.get(`/:id`, asyncHandler(controller.get))
router.get(`/radius/:zipcode/:distance`, asyncHandler(controller.getBootcampInRadius));

// Protected
router.post('/', protect, asyncHandler(controller.post));
router.put(`/:id`, protect, asyncHandler(controller.put));
router.delete(`/:id`, protect, asyncHandler(controller.delete));
router.put(`/:id/photo`, protect, asyncHandler(controller.bootcampPhotoUpload));


export default router;