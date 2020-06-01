import express from 'express';
import CourseController from '~/controllers/courses';
import { asyncHandler } from '~/middlewares/async';


const router = express.Router({ mergeParams: true });
const controller = new CourseController();


router.get('/', asyncHandler(controller.getCourses));

router.post('/', asyncHandler(controller.post));

router.get(`/:id`, asyncHandler(controller.get))

router.put(`/:id`, asyncHandler(controller.put));

router.delete(`/:id`, asyncHandler(controller.delete));


export default router;