import { ConstantsRS } from '../../utils/constants';
import { Request, Response } from 'express';
import { statesCreatorServices } from '../../services/locations/statesCreator.service';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class StatesController {
    public async createState(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const stateSaved = await statesCreatorServices.createState(body)
            if (!stateSaved.code) {
                responses.success(req, res, stateSaved);
            } else {
                responses.error(req, res, stateSaved);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getStatesByCountryID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const states = await statesCreatorServices.getByCountryID(body)
            if (!states.code) {
                responses.success(req, res, states);
            } else {
                responses.error(req, res, states);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const statesController = new StatesController();