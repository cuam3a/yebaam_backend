import { Request, Response } from 'express';
import { professionalCommunityUsersService } from '../../services/communitiesprofessionales/professionalcommunityusers.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ProfessionalCommunityUsersController {

    public async createProfessionalCommunityUser(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const manager = await professionalCommunityUsersService.createProfessionalCommunityUser(body);
            responses.success(req, res, manager);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT, error: error });
        }
    }

    public async updateProfessionalCommunityUser(req: Request, res: Response) {
        try {
            const { id } = req.body;
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateManager = await professionalCommunityUsersService.updateProfessionalCommunityUser(id, body);
            responses.success(req, res, updateManager);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async deleteProfessionalCommunityUser(req: Request, res: Response) {
        try {
            const { id } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const managerDelete = await professionalCommunityUsersService.deleteProfessionalCommunityUser(id);
            responses.success(req, res, managerDelete);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getAllProfessionalCommunityUsers(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const managers = await professionalCommunityUsersService.getAllProfessionalCommunityUsers();
            responses.success(req, res, managers);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllProfessionalCommunityUserOnCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            if (!communityId) throw { ...ConstantsRS.FIELD_NOT_EXISTS, field: communityId };

            const managers = await professionalCommunityUsersService.getAllProfessionalCommunityUserOnCommunity(communityId);
            responses.success(req, res, managers);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getProfessionalCommunityUserById(req: Request, res: Response) {
        try {
            const { id } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            if (!id) throw { ...ConstantsRS.FIELD_NOT_EXISTS, field: id };

            const managers = await professionalCommunityUsersService.getProfessionalCommunityUserById(id);
            responses.success(req, res, managers);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async asignRoleToProfessional(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const manager = await professionalCommunityUsersService.asignRoleToProfessional(body);
            responses.success(req, res, manager);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async getMembersCommunity(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const members = await professionalCommunityUsersService.getMembersCommunity(body);
            responses.success(req, res, members);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const professionalCommunityUsersController = new ProfessionalCommunityUsersController();