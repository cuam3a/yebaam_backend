import { Request, Response } from 'express';
import { pqrsService } from "../../services/pqrs/pqrs.service";
import { responses } from "../utils/response/response";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from "../../middlewares/middleware";

class PqrsController {

    public async sendPQRS(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const pqrs = await pqrsService.sendPqrs(body);

            if (!pqrs.code) {
                responses.success(req, res, pqrs);
            } else {
                responses.error(req, res, pqrs);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT, error: error })
        }
    }

    public async getPqrs(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const pqrs = await pqrsService.getPqrs(body);
            responses.success(req, res, pqrs);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getPqrsByType(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const pqrs = await pqrsService.getPqrsByType(body);
            responses.success(req, res, pqrs);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async disablePqrs(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async (rta) => {
                if (rta.success) { */
            const pqrs = await pqrsService.disablePQRS(body);

            if (!pqrs.code) {
                responses.success(req, res, pqrs);
            } else {
                responses.error(req, res, pqrs);
            }
            /*     } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }
}

export const pqrsController = new PqrsController();