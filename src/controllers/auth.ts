import UserModel, { UserSchemaType } from '~/models/User';
import { ErrorResponse } from "~/utils/errorResponse";
import { NextFunction, Request, Response } from "../types";
import { sendEmail } from '~/utils/sendEmail';
import { api } from '~/globals';
import crypto from 'crypto';

class AuthController {

    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    /** register user */
    async register(req: Request, res: Response, next: NextFunction) {

        const { name, password, email, role } = req.body;

        // Create user

        const user = await UserModel.create({
            name,
            email,
            password,
            role
        });
        await this.sendTokenResponse(res, user, 201);
    }

    /** login */
    async login(req: Request, res: Response, next: NextFunction) {
        const { password, email } = req.body;

        // Validate email and password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // Check for user
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Email not found', 401));
        }

        // Check if password matches
        const isMatch = await user.marchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Incorrect password', 401));
        }

        await this.sendTokenResponse(res, user, 201);
    }

    /** get current user */
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        res.status(200).json({ success: true, data: user })
    }

    /** forgot password */
    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorResponse('There is no user with that email', 404));
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false })

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}${api}/auth/reset/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has 
        requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                text: message
            })
            res.status(200).json({ success: true, data: 'Email sent' })
        } catch (error) {
            console.error(error);
            // @ts-ignore: Unreachable code error
            user.resetPasswordExpired = undefined;
            // @ts-ignore: Unreachable code error
            user.resetPasswordToken = undefined;
            await user.save({ validateBeforeSave: false })
            return next(new ErrorResponse('Email could not sent', 500))
        }

    }


    /** get current user */
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpired: { $gt: Date.now() }
        })

        if (!user) {
            return next(new ErrorResponse('Invalid token', 400))
        }

        // Set new password
        user.password = req.body.password;
        // @ts-ignore: Unreachable code error
        user.resetPasswordExpired = undefined;
        // @ts-ignore: Unreachable code error
        user.resetPasswordToken = undefined;

        await user.save();
        this.sendTokenResponse(res, user, 200);
    }


    async sendTokenResponse(res: Response, user: UserSchemaType, statusCode: number) {
        // Create token
        const token = user.getSignJwtToken();

        let cookieExpire: string | number = process.env.JWT_COOKIE_EXPIRE ? `${process.env.JWT_COOKIE_EXPIRE}` : '0';
        cookieExpire = parseInt(cookieExpire.toString()) * 24 * 60 * 60 * 1000;

        const options = {
            expires: new Date(Date.now() + cookieExpire),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        res
            .status(statusCode)
            .cookie('token', token, options)
            .json({ success: true, token })
    }

}

export default AuthController;