import jwt from 'jsonwebtoken';
import { ErrorResponse } from '~/utils/errorResponse';
import { asyncHandler } from '~/middlewares/async';
import UserModel from '~/models/User';
import { NextFunction, Request, Response } from '~/types';
import { Color } from '~/globals';

// Protect route
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // not yet
    // else if(req.cookies.token){
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route, token not sent', 401));
    }

    try {
        // Verify token
        const decoded: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if (typeof decoded !== 'string' && decoded.hasOwnProperty('id')) {
            req.user = await UserModel.findById(decoded.id);
        } else {
            throw new Error();
        }

        next();
    } catch (error) {
        return next(new ErrorResponse('Incorrect authentication header', 400));
    }
})

//Grant access to specific role
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(`${req.user?.role}`)) {
            return next(new ErrorResponse(`User role ${req.user?.role} is not authorized to access this route`, 403))
        }
        next();
    }
}