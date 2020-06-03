import express from 'express';
import * as core from "express-serve-static-core";
import { UserSchemaType } from './models/User';

export interface Express extends core.Express { }
export interface Request extends core.Request {
    user?: UserSchemaType | null;
}
export interface Response extends core.Response { }
export interface NextFunction extends core.NextFunction { }