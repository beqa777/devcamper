import express from 'express';
import BootcampsController from '~/controllers/bootcamps';
import courseRouter from '~/routers/courses';
import { asyncHandler } from '~/middlewares/async';


const router = express.Router();
const controller = new BootcampsController();


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.get('/', asyncHandler(controller.all));

router.post('/', asyncHandler(controller.post));

router.get(`/:id`, asyncHandler(controller.get))

router.put(`/:id`, asyncHandler(controller.put));

router.delete(`/:id`, asyncHandler(controller.delete));

router.get(`/radius/:zipcode/:distance`, asyncHandler(controller.getBootcampInRadius));

router.put(`/:id/photo`, asyncHandler(controller.bootcampPhotoUpload));


export default router;