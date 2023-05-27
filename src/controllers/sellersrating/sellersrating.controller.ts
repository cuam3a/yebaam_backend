import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// Services
import { sellersRatingServices } from '../../services/sellersrating/sellersrating.service';

class SellersRatingController {
    public async createSellerRating(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const saveClassified = await sellersRatingServices.saveSellerRating(body);
            if (!saveClassified.code) {
                responses.success(req, res, saveClassified);
            } else {
                responses.error(req, res, saveClassified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async getRatingCounter(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const saveClassified = await sellersRatingServices.getRatingBySellerID(body);
            responses.success(req, res, saveClassified);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const sellersRatingController = new SellersRatingController();