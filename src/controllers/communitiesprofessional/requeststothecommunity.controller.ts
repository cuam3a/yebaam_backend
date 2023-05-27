import { Request, Response } from 'express';
import { requestToTheCommunityService } from '../../services/communitiesprofessionales/requeststothecommunity.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class RequestToTheCommunityController {

    public async createRequest(req: Request, res: Response) {
        try {
            const { professionalId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const requestCreated = await requestToTheCommunityService.createRequest(professionalId, communityId);
            if (requestCreated.code == undefined) {
                responses.success(req, res, requestCreated);
            } else {
                responses.error(req, res, requestCreated);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async acceptRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateRequest = await requestToTheCommunityService.acceptRequest(requestId);
            responses.success(req, res, updateRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async refuseRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.refuseRequest(requestId);
            responses.success(req, res, refuseRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async blockedRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.blockedRequest(requestId);
            responses.success(req, res, refuseRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async blockedUserRequest(req: Request, res: Response) {
        try {
            const { professionalId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.blockedUserRequest(professionalId, communityId);
            responses.success(req, res, refuseRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async getRequestById(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateRequest = await requestToTheCommunityService.getRequestById(requestId);
            responses.success(req, res, updateRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async deleteRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateRequest = await requestToTheCommunityService.deleteRequest(requestId);
            responses.success(req, res, updateRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }
    public async deleteUserRequest(req: Request, res: Response) {
        try {
            const { professionalId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            if (!professionalId && !communityId) throw { ...ConstantsRS.FIELD_NOT_EXISTS, field: ["professionalId", "communityId"] }

            const updateRequest = await requestToTheCommunityService.deleteUserRequest(professionalId, communityId);
            responses.success(req, res, updateRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getAllRefuseRequest(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.getAllrefuseRequest();
            responses.success(req, res, refuseRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllPendingRequest(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const pendingRequest = await requestToTheCommunityService.getAllPendingRequest();
            responses.success(req, res, pendingRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllAcceptedRequest(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const acceptedRequest = await requestToTheCommunityService.getAllAcceptedRequest();
            responses.success(req, res, acceptedRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
    public async updateRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.body;
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updatedRequest = await requestToTheCommunityService.updateRequest(requestId, body);
            responses.success(req, res, updatedRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    //communities
    public async getAllrefuseRequestByCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.getAllrefuseRequestByCommunity(communityId);
            responses.success(req, res, refuseRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllPendingRequestByCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const pendingRequest = await requestToTheCommunityService.getAllPendingRequestByCommunity(communityId);
            responses.success(req, res, pendingRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllAcceptedRequestByCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const acceptedRequest = await requestToTheCommunityService.getAllAcceptedRequestByCommunity(communityId);
            responses.success(req, res, acceptedRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllBlockedRequestByCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const acceptedRequest = await requestToTheCommunityService.getAllBlockedRequestByCommunity(communityId);
            responses.success(req, res, acceptedRequest);
            /* } else {
                   responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
               }
           }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getAllUsersAcceptedRequestByCommunity(req: Request, res: Response) {
        try {
            const { communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const acceptedRequest = await requestToTheCommunityService.getAllUsersAcceptedRequestByCommunity(communityId);
            responses.success(req, res, acceptedRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async acceptRequestOther(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updateRequest = await requestToTheCommunityService.acceptRequestOther(body);
            responses.success(req, res, updateRequest);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async toUnlockedUserRequest(req: Request, res: Response) {
        try {
            const { userId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await requestToTheCommunityService.toUnlockUserRequest(userId, communityId);
            if (refuseRequest.code == undefined) {
                responses.success(req, res, refuseRequest);
            } else {
                responses.error(req, res, refuseRequest);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }
}

export const requestToTheCommunityController = new RequestToTheCommunityController();