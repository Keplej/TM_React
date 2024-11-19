import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/appError.utils";
import {clearAuthCookies, REFRESH_PATH} from "../utils/cookies.utils";

const handleZodError = (res:Response, error:z.ZodError) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message
    }))

    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors
    });
};

// defining handleAppError
const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  })
  return;
}


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH ${req.path}`, error);

    // all cookies will be cleared when on this path
    if (req.path === REFRESH_PATH) {
        clearAuthCookies(res);
    }

    if (error instanceof z.ZodError) {
      handleZodError(res, error);
      return;
    }

    if (error instanceof AppError) {
      return handleAppError(res, error)
    }

    res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
    return;
  };

export default errorHandler;