import { Request, Response } from 'express';
import { userRequestCommunityService } from '../../services/communities/userRequestCommunity.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class UserRequestCommunity {

    public async createRequest(req: Request, res: Response) {
        try {
            const { userId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const requestCreated = await userRequestCommunityService.createRequest(userId, communityId);
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
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const { requestId } = req.body;
            const updateRequest = await userRequestCommunityService.acceptRequest(requestId);
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
            const refuseRequest = await userRequestCommunityService.refuseRequest(requestId);
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
            const refuseRequest = await userRequestCommunityService.blockedRequest(requestId);
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
            const { userId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const refuseRequest = await userRequestCommunityService.blockedUserRequest(userId, communityId);
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
            const updateRequest = await userRequestCommunityService.getRequestById(requestId);
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
            const updateRequest = await userRequestCommunityService.deleteRequest(requestId);
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
            const { userId, communityId } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            if (!userId && !communityId) throw { ...ConstantsRS.FIELD_NOT_EXISTS, field: ["userId", "communityId"] }

            const updateRequest = await userRequestCommunityService.deleteUserRequest(userId, communityId);
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
            const refuseRequest = await userRequestCommunityService.getAllrefuseRequest();
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
            const pendingRequest = await userRequestCommunityService.getAllPendingRequest();
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
            const acceptedRequest = await userRequestCommunityService.getAllAcceptedRequest();
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
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const updatedRequest = await userRequestCommunityService.updateRequest(requestId, body);
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
            const refuseRequest = await userRequestCommunityService.getAllrefuseRequestByCommunity(communityId);
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
            const pendingRequest = await userRequestCommunityService.getAllPendingRequestByCommunity(communityId);
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
            const acceptedRequest = await userRequestCommunityService.getAllAcceptedRequestByCommunity(communityId);
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
            const acceptedRequest = await userRequestCommunityService.getAllBlockedRequestByCommunity(communityId);
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
            const acceptedRequest = await userRequestCommunityService.getAllUsersAcceptedRequestByCommunity(communityId);
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
            const updateRequest = await userRequestCommunityService.acceptRequestOther(body);
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
            const refuseRequest = await userRequestCommunityService.toUnlockUserRequest(userId, communityId);
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

export const userRequestCommunityController = new UserRequestCommunity();