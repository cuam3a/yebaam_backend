import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { landingsServices } from '../../services/landings/landings.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class LandingsController {
    public async createLanding(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const createLanding = await landingsServices.createLanding(body, file)
            res.send({
                error: createLanding.code != undefined ? createLanding : createLanding ? null : ConstantsRS.ERROR_SAVING_RECORD,
                success: createLanding.code != undefined ? false : createLanding ? true : false,
                data: createLanding.code != undefined ? [] : createLanding ? createLanding : []
            })
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getAllLandings(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getAllLanddings = await landingsServices.getAllLandings()
            res.send({
                error: getAllLanddings ? null : ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: getAllLanddings ? true : false,
                data: getAllLanddings ? getAllLanddings : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllLandingsMovil(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getAllLanddings = await landingsServices.getAllLandingsMovil(body)
            res.send({
                error: getAllLanddings ? null : ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: getAllLanddings ? true : false,
                data: getAllLanddings ? getAllLanddings : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getLandingByID(req: Request, res: Response) {
        try {
            const id = req.body.landingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLandingID = await landingsServices.getLandingByID(id)
            res.send({
                error: getLandingID ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLandingID ? true : false,
                data: getLandingID ? getLandingID : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getLandingByName(req: Request, res: Response) {
        try {
            const name = req.body.name
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLandingName = await landingsServices.getLandingByName(name)
            res.send({
                error: getLandingName ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLandingName ? true : false,
                data: getLandingName ? getLandingName : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getLandingDefault(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getLandingDefault = await landingsServices.getLandingDefault()
            res.send({
                error: getLandingDefault ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getLandingDefault ? true : false,
                data: getLandingDefault ? getLandingDefault : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async updateLanding(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const updateLanding = await landingsServices.updateLanding(body, file)
            res.send({
                error: updateLanding ? null : ConstantsRS.ERROR_UPDATING_RECORD,
                success: updateLanding ? true : false,
                data: updateLanding ? updateLanding : []
            })
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async deleteLanding(req: Request, res: Response) {
        try {
            const id = req.body.landingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const deleteLandingID = await landingsServices.deleteLanding(id)
            if (deleteLandingID.code == undefined) {
                responses.success(req, res, deleteLandingID);
              } else {
                  responses.error(req, res, deleteLandingID);
              }
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async deleteLandingAdmin(req: Request, res: Response) {
        try {
            const id = req.body.landingID
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const deleteLandingID = await landingsServices.deleteLandingAdmin(id)
            res.send({
                error: deleteLandingID ? null : ConstantsRS.ERROR_TO_DELETE_REGISTER,
                success: deleteLandingID ? true : false,
                data: deleteLandingID ? deleteLandingID : []
            })
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

}

export const landingsController = new LandingsController();