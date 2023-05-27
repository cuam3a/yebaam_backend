import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// Services
import { postRequestServices } from '../../services/postrequests/postrequests.service';

class PostRequestController {
    public async changeStateRequest(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const requestUpdated = await postRequestServices.updateState(body);
            if (!requestUpdated.code) {
                responses.success(req, res, requestUpdated);
            } else {
                responses.error(req, res, requestUpdated);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async getRequestsByAnyCommunityID(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const requests = await postRequestServices.getRequestsByCommunityID(body);
            if (!requests.code) {
                responses.success(req, res, requests);
            } else {
                responses.error(req, res, requests);
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

export const postRequestController = new PostRequestController();