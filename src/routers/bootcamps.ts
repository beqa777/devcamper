import express from 'express';
import BootcampsController from '~/controllers/bootcamps';
import { asyncHandler } from '~/middlewares/async';


const router = express.Router();
const controller = new BootcampsController();


router.get('/', asyncHandler(controller.all));

router.post('/', asyncHandler(controller.post));

router.get(`/:id`, asyncHandler(controller.get))

router.put(`/:id`, asyncHandler(controller.put));

router.delete(`/:id`, asyncHandler(controller.delete));

router.get(`/radius/:zipcode/:distance`, asyncHandler(controller.getBootcampInRadius));

export default router;