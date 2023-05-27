import { ConstantsRS } from '../../utils/constants';
import { Request, Response } from 'express';
import { citiesCreatorServices } from '../../services/locations/citiesCreator.service';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class CitiesController {
    public async createCity(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const stateSaved = await citiesCreatorServices.createCity(body)
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

    public async getCitiesByStateID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const cities = await citiesCreatorServices.getByStateID(body)
            if (!cities.code) {
                responses.success(req, res, cities);
            } else {
                responses.error(req, res, cities);
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

export const citiesController = new CitiesController();