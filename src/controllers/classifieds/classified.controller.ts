import { Request, Response } from 'express';
import { classifiedServices } from '../../services/classifieds/classified.services';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ClassifiedController {
    public async createClassified(req: any, res: Response) {
        try {
            const body = req.body;
            const files = req.files;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const saveClassified = await classifiedServices.createClassified(body, files);
            if (!saveClassified.code) {
                responses.success(req, res, saveClassified);
            } else {
                responses.error(req, res, saveClassified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async updateClassifiedByID(req: any, res: Response) {
        try {
            const body = req.body;
            const files = req.files;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateClassified = await classifiedServices.updateClassifiedByID(body, files);
            if (!updateClassified.code) {
                responses.success(req, res, updateClassified);
            } else {
                responses.error(req, res, updateClassified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CANNOT_UPDATE_RECORD, error: error });
        }
    }

    public async getClassifiedByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const classified = await classifiedServices.getClassifiedByID(body.id, body.visitorID);
            if (!classified.code) {
                responses.success(req, res, classified);
            } else {
                responses.error(req, res, classified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async deleteClassifiedByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deleteClassified = await classifiedServices.deleteClassifiedByID(body.id);
            if (!deleteClassified.code) {
                responses.success(req, res, deleteClassified);
            } else {
                responses.error(req, res, deleteClassified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getMxStates(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const statesList = await classifiedServices.getMxStates();
            responses.success(req, res, statesList);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getMxMunicipalitiesByState(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const statesList = await classifiedServices.getMxMunicipalitiesByState(body.state);
            responses.success(req, res, statesList);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getCoDepartmentsNCities(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const departmentList = await classifiedServices.getCoDepartmentsNCities();
            responses.success(req, res, departmentList);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllClassifieds(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const classifieds = await classifiedServices.getAllClassifieds(body);
            responses.success(req, res, classifieds.response, 200, classifieds.nextSkip);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async deleteClassifiedPictureByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deleteClassified = await classifiedServices.deletePictureByID(body);
            if (!deleteClassified.code) {
                responses.success(req, res, deleteClassified);
            } else {
                responses.error(req, res, deleteClassified);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getClassifiedByCriteria(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const classifieds = await classifiedServices.getClassifiedsByCriteria(body);
            responses.success(req, res, classifieds.response, 200, classifieds.nextSkip);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getClassifiedByUserID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const classifieds = await classifiedServices.getClassifiedsByUserID(body);
            if (!classifieds.code) {
                responses.success(req, res, classifieds);
            } else {
                responses.error(req, res, classifieds);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const classifiedController = new ClassifiedController();