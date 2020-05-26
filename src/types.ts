import express from 'express';
import * as core from "express-serve-static-core";

export interface Express extends core.Express { }
export interface Request extends core.Request { }
export interface Response extends core.Response { }
export interface NextFunction extends core.NextFunction { }