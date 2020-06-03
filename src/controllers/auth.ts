import UserModel, { UserSchemaType } from '~/models/User';
import { ErrorResponse } from "~/utils/errorResponse";
// import { paginate, queryGenerator, relationsGenerator } from "~/utils/query";
import { NextFunction, Request, Response } from "../types";


class AuthController {

    constructor() {
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
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

    /** get current user */
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        res.status(200).json({ success: true, data: user })
    }

}

export default AuthController;