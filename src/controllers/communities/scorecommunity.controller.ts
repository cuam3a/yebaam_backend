import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { scoreCommunityServices } from '../../services/communities/scorecommunity.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ScoreCommunityServicesController {
    public async getScoreCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getScoreCommunity = await scoreCommunityServices.getScoreCommunityByID(body.id);
            res.send({
                error: getScoreCommunity == false ? getScoreCommunity : null,
                success: getScoreCommunity != false ? true : false,
                data: getScoreCommunity != false ? getScoreCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async getScoreCommunityByUserID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getScoreCommunity = await scoreCommunityServices.getScoreCommunityByID(body.id);
            res.send({
                error: getScoreCommunity == false ? getScoreCommunity : null,
                success: getScoreCommunity != false ? true : false,
                data: getScoreCommunity != false ? getScoreCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async createScoreCommunity(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const createScoreCommunity = await scoreCommunityServices.createScoreCommunity(body.userID, body.communityID);
            res.send({
                error: createScoreCommunity == false ? createScoreCommunity : null,
                success: createScoreCommunity != false ? true : false,
                data: createScoreCommunity != false ? createScoreCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }
    public async updateScoreCommunity(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateScoreCommunity = await scoreCommunityServices.updateScoreCommunity(body);
            res.send({
                error: updateScoreCommunity == false ? updateScoreCommunity : null,
                success: updateScoreCommunity != false ? true : false,
                data: updateScoreCommunity != false ? updateScoreCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }
    public async deleteScoreCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const statusScore = await scoreCommunityServices.deleteScoreCommunityByID(body.id);
            res.send({
                error: statusScore == false ? statusScore : null,
                success: statusScore != false ? true : false,
                data: statusScore != false ? statusScore : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }
}
export const scoreCommunityServicesController = new ScoreCommunityServicesController();