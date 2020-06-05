import express from 'express';
import AuthController from '~/controllers/auth';
import courseRouter from '~/routers/courses';
import { asyncHandler } from '~/middlewares/async';
import { protect } from '~/middlewares/auth';


const router = express.Router();
const controller = new AuthController();


//Re-route into other resource routers

// Public
router.post('/register', asyncHandler(controller.register));
router.post('/login', asyncHandler(controller.login));
router.post('/forget', asyncHandler(controller.forgotPassword));
router.put('/reset/:token', asyncHandler(controller.resetPassword));

// Protected
router.get('/current', protect, asyncHandler(controller.getCurrentUser))
router.get('/logout', protect, asyncHandler(controller.logOut))
router.put('/updateDetails', protect, asyncHandler(controller.updateUserDetails))
router.put('/updatePassword', protect, asyncHandler(controller.updateUserPassword))


export default router;