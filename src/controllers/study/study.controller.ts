import { Request, Response } from 'express';
const studyModel = require('../../models/studies/Studies.model');
import { studyServices } from '../../services/studies/study.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// classes
import { ConstantsRS } from '../../utils/constants';

class StudyController {
    public async createStudy(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const studyToSave = await studyServices.saveStudy(body)
            res.send(studyToSave)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async updateStudyByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const studyToUpdate = await studyServices.updateStudy(body)
            res.send(studyToUpdate)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deleteStudyByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const studyToDelete = await studyServices.deleteStudy(body)
            res.send(studyToDelete)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async getStudyByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const study = await studyModel.findOne({ _id: body.id, isEnabled: true })
                .populate({
                    path: 'certificateIDS',
                    model: 'Certificates',
                    match: { isEnabled: true },
                    populate: {
                        path: 'certificateClassID',
                        model: 'ClassOfCertificates',
                    }
                })

            if (study) {
                responses.success(req, res, study);
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

    public async getStudiesByProfessionalID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const studies = await studyServices.getStudiesByProfessional(body)
            res.send(studies)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getUnfinishedStudiesByProfessionalID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const unfinishedExperiences = await studyServices.getUnfinishedStudies(body)
            res.send(unfinishedExperiences)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const studyController = new StudyController();