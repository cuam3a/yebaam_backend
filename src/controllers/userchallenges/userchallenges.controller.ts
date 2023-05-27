import { Request, Response } from 'express';
import { userChallengeServices } from '../../services/userchallenges/userchallenges.services';
import { responses } from '../../controllers/utils/response/response';

// classes
import { ConstantsRS } from '../../utils/constants';
import { middlewares } from '../../middlewares/middleware';

class UserChallengesController {
    public async getUserChallengesByUserID(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const userChallenges = await userChallengeServices.getUserChallengesByUserID(body);
            if (!userChallenges.code) {
                responses.success(req, res, userChallenges);
            } else {
                responses.error(req, res, userChallenges);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            console.log("E:", error)
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const userChallengesController = new UserChallengesController();