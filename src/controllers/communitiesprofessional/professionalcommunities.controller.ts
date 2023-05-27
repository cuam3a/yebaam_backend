import { Request, Response } from 'express';
import { professionalCommunitiesServices } from '../../services/communitiesprofessionales/professionalcommunities.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ProfessionalCommunitiesController {
    public async getCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getCommunity = await professionalCommunitiesServices.getCommunityByID(body);
            res.send({
                error: getCommunity == ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCommunity : null,
                success: getCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? true : false,
                data: getCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async getCommunityByName(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getCommunity = await professionalCommunitiesServices.getCommunityByName(body.name);

            res.send({
                error: getCommunity == ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCommunity : null,
                success: getCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? true : false,
                data: getCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async deleteCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deleteClassified = await professionalCommunitiesServices.deleteCommunityByID(body.id);
            res.send({
                error: deleteClassified ? null : ConstantsRS.ERROR_TO_DELETE_REGISTER,
                success: deleteClassified ? true : false,
                data: []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }
    public async updateCommunity(req: any, res: Response) {
        try {
            const body = req.body;
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateCommunitied = await professionalCommunitiesServices.updateCommunity(body, file);
            res.send({
                error: updateCommunitied ? null : ConstantsRS.ERROR_UPDATING_RECORD,
                success: updateCommunitied ? true : false,
                data: updateCommunitied ? updateCommunitied : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }
    public async createCommunity(req: any, res: Response) {
        try {
            const body = req.body;
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const saveCommunity = await professionalCommunitiesServices.createCommunity(body, file);
            res.send({
                error: saveCommunity == false ? saveCommunity : null,
                success: saveCommunity != false ? true : false,
                data: saveCommunity ? saveCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getCommunitiesByCategoryId(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const commnities = await professionalCommunitiesServices.getCommunitiesByCategory(body);
            responses.success(req, res, commnities);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async searchCommunityEnabled(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const result = await professionalCommunitiesServices.searchCommunityByNameEnabled(body);
            responses.success(req, res, result);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getCommunityByProfessionalId(req: Request, res: Response) {
        try {
            const { professionalId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const communities = await professionalCommunitiesServices.getCommunityByProfessionalId(professionalId);
            responses.success(req, res, communities);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getCommunityByNotProfessionalId(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const communities = await professionalCommunitiesServices.getCommunityByNotProfessionalId(body);
            responses.success(req, res, communities);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async searchCommunityAndCategoryEnabled(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const result = await professionalCommunitiesServices.searchCommunityByNameAndCategoryEnabled(body);
            responses.success(req, res, result);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getInformationVisitor(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const result = await professionalCommunitiesServices.getInformationVisitor(body);
            responses.success(req, res, result);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
}

export const professionalCommunitiesController = new ProfessionalCommunitiesController();