import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { rolCommunitiesServices } from '../../services/communities/rolcommunities.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class RolCommunitiesServicesController {
    public async getRolCommunityByName(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getCategory = await rolCommunitiesServices.getRolCommunityByName(body.name);
            res.send({
                error: getCategory == ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCategory : null,
                success: getCategory != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? true : false,
                data: getCategory != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getCategory : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async getRolCommunityByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getRolCommunity = await rolCommunitiesServices.getRolCommunityByID(body.id);
            res.send({
                error: getRolCommunity == ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getRolCommunity : null,
                success: getRolCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? true : false,
                data: getRolCommunity != ConstantsRS.THE_RECORD_DOES_NOT_EXIST ? getRolCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }
    public async createRolCommunity(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getRolCommunity = await rolCommunitiesServices.createRolCommunity(body);
            res.send({
                error: getRolCommunity == ConstantsRS.THE_RECORD_ALREDY_EXISTS ? getRolCommunity : null,
                success: getRolCommunity != ConstantsRS.THE_RECORD_ALREDY_EXISTS ? true : false,
                data: getRolCommunity != ConstantsRS.THE_RECORD_ALREDY_EXISTS ? getRolCommunity : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }
    public async deleteRolCommunityByName(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deleteClassified = await rolCommunitiesServices.deleteRolCommunityByName(body.name);
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
    public async updateRolCommunity(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let err = "Error al actualizar";
            let updateSuccess = "Exito al actualizar";
            const updateClassified = await rolCommunitiesServices.updateRolCommunity(body);
            res.send({
                error: updateClassified ? null : err,
                success: updateClassified ? updateSuccess : false,
                data: updateClassified
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async assignRolCommunity(req: Request, res: Response) {
        try {
            const { userId, rolId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const rolAssign = await rolCommunitiesServices.assignRolToUser(userId, rolId, communityId)
            responses.success(req, res, rolAssign);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

}
export const rolCommunitiesServicesController = new RolCommunitiesServicesController();