import { Request, Response } from 'express';
import { communitiesServices } from '../../services/communities/community.services';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class CommunityController {
    public async getCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getCommunity = await communitiesServices.getCommunityByID(body);
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
            const getCommunity = await communitiesServices.getCommunityByName(body.name);

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
            const deleteClassified = await communitiesServices.deleteCommunityByID(body.id);
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
            const updateCommunitied = await communitiesServices.updateCommunity(body, file);
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
            const saveCommunity = await communitiesServices.createCommunity(body, file);
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
            const commnities = await communitiesServices.getCommunitiesByCategory(body);
            responses.success(req, res, commnities);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async searchCommunityEnabled(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const result = await communitiesServices.searchCommunityByNameEnabled(body);
            responses.success(req, res, result);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getCommunityByUserID(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const communities = await communitiesServices.getCommunityByUserId(userId);
            responses.success(req, res, communities);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getCommunityByNotUserID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const communities = await communitiesServices.getCommunityByNotUserId(body);
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
            const result = await communitiesServices.searchCommunityByNameAndCategoryEnabled(body);
            responses.success(req, res, result);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            console.log("E: ", error)
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getInformationVisitor(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const result = await communitiesServices.getInformationVisitor(body);
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

export const communityController = new CommunityController();