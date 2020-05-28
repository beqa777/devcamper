export interface ErrorResponseType extends Error {
    statusCode?: number | undefined,
    value?: String,
    code?: number,
    keyValue?: Object,
    errors?: Object
}

export class ErrorResponse extends Error implements ErrorResponseType {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}