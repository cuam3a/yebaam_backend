import { Request, Response } from 'express';

class Responses {

    public success(req: Request, res: Response, data: any, status?: number, nextSkip?: number) {

        let statusCode = status || 200;

        if (nextSkip != undefined) {
            res.status(statusCode).send({
                error: null,
                success: true,
                data,
                nextSkip
            })
        } else {
            res.status(statusCode).send({
                error: null,
                success: true,
                data
            })
        }
    }

    public error(req: Request, res: Response, error: any, status?: number) {
        let statusCode = status || 500;

        res.status(statusCode).send({
            error,
            success: false,
            data: null
        })
    }
}

export const responses = new Responses();