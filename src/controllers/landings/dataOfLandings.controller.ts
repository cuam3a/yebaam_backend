import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { dataOfLandingsServices } from '../../services/landings/dataOfLandings.services';
const dataOfLandingModel = require('../../models/landings/DataOfLandings.model')
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class DataOfLandingsController {
    public async useLanding(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.useLanding(body)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_SAVING_RECORD,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getDataLandingByID(req: Request, res: Response) {
        try {
            const id = req.body.dataLandingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getDataLanding = await dataOfLandingsServices.getDataLandingByID(id)
            res.send({
                error: getDataLanding ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getDataLanding ? true : false,
                data: getDataLanding ? getDataLanding : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async updateDataLandingUse(req: Request, res: Response) {
        try {
            const id = req.body.dataLandingID
            const use = req.body.use
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.updateLandingUse(id, use)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_UPDATING_RECORD,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async assignMeDataOfLandingsFree(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.assignMeDataOfLandingsFree(body)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_SAVING_RECORD,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async updateDataOfLandings(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.updateDataOfLandings(body)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_UPDATING_RECORD,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async getDataLandingsByTrademarkID(req: Request, res: Response) {
        try {
            const id = req.body.trademarkID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLand = await dataOfLandingsServices.getLandingByTrademarkID(id)
            res.send({
                error: getLand ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLand ? true : false,
                data: getLand ? getLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getDataLandingByIDS(req: Request, res: Response) {
        try {
            const trademarkID = req.body.trademarkID
            const landingID = req.body.landingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLanding = await dataOfLandingsServices.getLandingByIDS(trademarkID, landingID)
            res.send({
                error: getLanding ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLanding ? true : false,
                data: getLanding ? getLanding : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async deleteMyDataLanding(req: Request, res: Response) {
        try {
            const id = req.body.dataLandingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.deleteMyLanding(id)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_TO_DELETE_REGISTER,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async removeMyDataLanding(req: Request, res: Response) {
        try {
            const id = req.body.dataLandingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const useLand = await dataOfLandingsServices.removeMyLanding(id)
            res.send({
                error: useLand ? null : ConstantsRS.ERROR_TO_DELETE_REGISTER,
                success: useLand ? true : false,
                data: useLand ? useLand : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getAllLandingsMovil(req: Request, res: Response) {
        try {
            const trademarkID = req.body.trademarkID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLandings = await dataOfLandingsServices.getAllLandingsMovil(trademarkID)
            res.send({
                error: getLandings.length > 0 ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLandings.length > 0 ? true : false,
                data: getLandings.length > 0 ? getLandings : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
}

export const dataOfLandingsController = new DataOfLandingsController();