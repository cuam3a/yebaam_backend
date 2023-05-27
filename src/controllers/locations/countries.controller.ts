import { ConstantsRS } from '../../utils/constants';
import { Request, Response } from 'express';
import { countriesCreatorServices } from '../../services/locations/countriesCreator.service';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class CountriesController {
    public async createCountry(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const systemActionSaved = await countriesCreatorServices.createCountry(body)
            if (!systemActionSaved.code) {
                responses.success(req, res, systemActionSaved);
            } else {
                responses.error(req, res, systemActionSaved);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getAllCountries(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const countries = await countriesCreatorServices.getAll()
            if (!countries.code) {
                responses.success(req, res, countries);
            } else {
                responses.error(req, res, countries);
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

export const countriesController = new CountriesController();