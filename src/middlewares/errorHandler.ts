import { Request, Response, NextFunction } from "~/types";
import { Color } from "~/globals";
import { ErrorResponseType, ErrorResponse } from "~/utils/errorResponse";

export const errorHandler = (err: ErrorResponseType, req: Request, res: Response, next: NextFunction) => {

    let error = { ...err };
    let info;
    error.message = err.message;

    // Mongoose incorrect id 
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key 
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
        info = err.keyValue;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = 'Validation failed';
        let errorInfo: any = {};
        Object.values(err.errors || {}).forEach((v) => {
            errorInfo[v.path] = v.properties.message;
        });

        info = errorInfo;
        error = new ErrorResponse(message, 400);

    }

    console.log(Color.FgRed, err);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
        info
    })
}