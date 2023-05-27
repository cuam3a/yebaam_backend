import { Request, Response } from 'express';
const experienceModel = require('../../models/experience/Experiences.model');
import { experienceServices } from '../../services/experiences/experiences.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// classes
import { ConstantsRS } from '../../utils/constants';

class ExperienceController {
    public async createExperience(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const experienceToSave = await experienceServices.saveExperience(body)
            res.send(experienceToSave)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async updateExperienceByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const experienceToUpdate = await experienceServices.updateExperience(body)
            res.send(experienceToUpdate)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async deleteExperienceByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const experienceToDelete = await experienceServices.deleteExperience(body)
            res.send(experienceToDelete)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getExperienceByID(req: Request, res: Response) {
        try {
            let rta, rtaError
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const experience = await experienceModel.findOne({ _id: body.id, isEnabled: true })
                .populate({
                    path: 'certificateIDS',
                    model: 'Certificates',
                    match: { isEnabled: true },
                    populate: {
                        path: 'certificateClassID',
                        model: 'ClassOfCertificates',
                    }
                })

            if (experience) {
                responses.success(req, res, experience);
            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getExperiencesByProfessionalID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const experiences = await experienceServices.getExperiencesByProfessional(body)
            res.send(experiences)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getUnfinishedExperiencesByProfessionalID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const unfinishedExperiences = await experienceServices.getUnfinishedExperiences(body)
            res.send(unfinishedExperiences)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const experienceController = new ExperienceController();