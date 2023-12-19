import { Request, Response, NextFunction } from 'express'
import { DefaultError, UnhandledInternalError } from '../utils/Errors'

const errorHandler = async (err: DefaultError, req: Request, res: Response, next: NextFunction) => {
    // If it's not a DefaultError instance, it's an unhandled error
    if(!(err instanceof DefaultError)){
        err = UnhandledInternalError;
    }

    res.status(err.status).json({
        error: err.error
    })
}


// Mostly for handling errors in async functions (database errors, etc.)
export const errorWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Run controllers logic
            await fn(req, res, next);
        } catch (e) {
            // If an exception is raised, continue to the error handler
            next(e);
        }
    };
};

export default errorHandler;
