import { Request, Response } from 'express';
const professionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');
import { professionalProfileServices } from '../../services/professionalprofile/professionalprofile.services';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// classes
import { ConstantsRS } from '../../utils/constants';

class ProffesionalPorifleController {
    public async createProfessionalProfile(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professionalProfileToSave = await professionalProfileServices.saveProfessionalProfile(body)
            res.send(professionalProfileToSave)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async updateProfessionalProfileByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professionalProfileToUpdate = await professionalProfileServices.updateProfessionalProfile(body)
            res.send(professionalProfileToUpdate)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deleteProfessionalProfileByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professionalProfileToDelete = await professionalProfileServices.deleteProfessionalProfile(body)
            res.send(professionalProfileToDelete)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async getProfessionalProfileByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professional = await professionalProfileModel.findOne({ _id: body.id, isEnabled: true })

            if (professional) {
                responses.success(req, res, professional);
            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getAllProfessionalProfile(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getAllPrfessional = await professionalProfileServices.getAllProfessionalProfile()
            res.send({
                error: getAllPrfessional ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: getAllPrfessional ? true : false,
                data: getAllPrfessional ? getAllPrfessional : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async searchForProfessionals(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professionals = await professionalProfileServices.getProfessionalsProfilesByCriteria(body)
            res.send(professionals)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async deleteProfessionalByIDOnlyDev(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const professionalToDelete: any = await professionalProfileServices.deleteProfessionalByIDOnlyDev(body)
            if (!professionalToDelete.code) {
                responses.success(req, res, professionalToDelete);
            } else {
                responses.error(req, res, professionalToDelete);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
}

export const proffesionalPorifleController = new ProffesionalPorifleController();