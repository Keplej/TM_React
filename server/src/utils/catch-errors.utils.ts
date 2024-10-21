import { NextFunction, Request, Response } from "express"

// Custom type for async
type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const catchErrors = (controller: AsyncController):AsyncController => 
    async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch(e) {
            next(e);
        }
    }

export default catchErrors;