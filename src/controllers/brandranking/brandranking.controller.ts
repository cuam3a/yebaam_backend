import { Request, Response } from 'express';
import { brandRankingServices } from '../../services/brandranking/brandranking.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class BrandRankingController {
    public async getRankingBrands(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const brands = await brandRankingServices.getRankingBrands(body);
            responses.success(req, res, brands.rankingBrands, 200, brands.nextSkip);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            console.log("E: ", error)
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const brandRankingController = new BrandRankingController();