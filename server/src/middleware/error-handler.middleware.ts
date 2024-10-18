import { ErrorRequestHandler } from "express";


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
}

export default errorHandler;