import { Request, Response } from 'express';
import { similarServices } from '../../services/similarservices/similar.services';
import { trademarksBankpointsService } from '../../services/trademarks/trademarksBankPoints.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class TrademarksBankPointsController {

    public async registerPoints(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const { entityId } = req.body;
            if (!entityId) throw { ...ConstantsRS.FIELD_NOT_EXISTS, field: 'entityId' } //if not exist jump to error

            const entity = await similarServices.identifyUserBrandOrCommunity(entityId); //get type of entity

            const namefield = entity.type + 'Id'; //create field to save on bd

            const bodyCreate = { [namefield]: entityId };
            const dataPoint = { [namefield]: entityId, packageId: body.packageId };

            const pointsRegistered = await trademarksBankpointsService.addPoints(bodyCreate, dataPoint); //add points
            responses.success(req, res, pointsRegistered);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async substractPoints(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const { entityId, quantity } = req.body;
            const entity = await similarServices.identifyUserBrandOrCommunity(entityId);
            const namefield = entity.type + 'Id';
            const body = { [namefield]: entityId };
            const bodySubtrac = { quantity };

            const poointsSubtracted = await trademarksBankpointsService.substrackPoints(body, bodySubtrac);
            responses.success(req, res, poointsSubtracted);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async assingPointsToPost(req: Request, res: Response) {
        try {
            responses.success(req, res, 'daata');
        } catch (error) {
            responses.error(req, res, 'data');
        }
    }

    /* public async getAllPointsBanks(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const allBanks = await trademarksBankpointsService.getAllPointsBank();
            responses.success(req, res, allBanks);
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    } */

    /* public async deletePointsBankById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const { id } = req.body;
            const bankDeleted = await trademarksBankpointsService.deletePointBankById(id);
            responses.success(req, res, bankDeleted);
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    } */

    /* public async deactivatePointsBankById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const { id } = req.body;
            const bankDeleted = await trademarksBankpointsService.deactivatePointBankById(id);
            responses.success(req, res, bankDeleted);
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    } */

    /* public async updatePointsBankById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const body = req.body;
            const bankDeleted = await trademarksBankpointsService.updatePointBankById(body);
            responses.success(req, res, bankDeleted);
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    } */

    public async getPointsBankById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const { id } = req.body;
            const Bank = await trademarksBankpointsService.getPointsBankById(id);
            responses.success(req, res, Bank);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getPointsBankByUserMarkId(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const bank = await trademarksBankpointsService.getPointsBankByUserId(body);
            responses.success(req, res, bank);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const trademarksBankController = new TrademarksBankPointsController();