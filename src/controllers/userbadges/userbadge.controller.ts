import { Request, Response } from 'express';
import { userBadgeServices } from '../../services/userbadges/userbadges.service';
import { responses } from '../../controllers/utils/response/response';

// classes
import { ConstantsRS } from '../../utils/constants';
import { middlewares } from '../../middlewares/middleware';

class UserBadgeController {
    public async getUserBadgesByUserID(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const userBadges = await userBadgeServices.getUserBadgesByUserID(body);
            if (!userBadges.code) {
                responses.success(req, res, userBadges);
            } else {
                responses.error(req, res, userBadges);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const userBadgeController = new UserBadgeController();