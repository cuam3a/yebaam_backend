import { Request, Response } from 'express';
import { trendsServices } from '../../services/trends/trends.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class TrendController {

    public async getAllTrends(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const allTrends = await trendsServices.getAllTrends()
            res.status(200).send({
                error: null,
                success: true,
                data: allTrends.length ? allTrends : "vacio"
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }

    }
}

export const trendController = new TrendController();