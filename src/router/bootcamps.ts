import express from 'express';
import BootcampsController from '~/controllers/bootcamps';

const router = express.Router();
const controller = new BootcampsController();


router.get('/', controller.all);

router.post('/', controller.post);

router.get(`/:id`, controller.get)

router.put(`/:id`, controller.put)

router.delete(`/:id`, controller.delete)

export default router;