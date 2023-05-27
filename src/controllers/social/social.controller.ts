import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { socialServices } from '../../services/social/social.services';
import { middlewares } from '../../middlewares/middleware';
import { responses } from '../utils/response/response';

class SocialController {
    public async actionsSocials(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let actionPerformed: any
            switch (body.type) {
                case 1:
                    actionPerformed = await socialServices.sendFriendRequest(body)
                    break;
                case 2:
                    actionPerformed = await socialServices.acceptRequest(body)
                    break;
                case 3:
                    actionPerformed = await socialServices.cancelRequest(body)
                    break;
                case 4:
                    actionPerformed = await socialServices.followFriend(body)
                    break;
                case 5:
                    actionPerformed = await socialServices.stopFollowing(body)
                    break;
                case 6:
                    actionPerformed = await socialServices.removeFriend(body)
                    break;
                case 7:
                    actionPerformed = await socialServices.blockFriend(body)
                    break;
                case 8:
                    actionPerformed = await socialServices.unblockFriend(body)
                    break;
                default:
                    break;
            }

            res.send({
                error: actionPerformed.error ? actionPerformed.error : null,
                success: actionPerformed.error ? false : true,
                data: actionPerformed.error ? [] : actionPerformed
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_ACTION, error: error })
        }
    }

    public async getSocialConnections(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let socialConnections

            socialConnections = await socialServices.getSocialConnections(body)
            res.send(socialConnections);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getFriendRequests(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let FriendRequests

            FriendRequests = await socialServices.getFriendRequests(body)
            res.send(FriendRequests);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getSocialConnectionByIDS(req: any, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const SocialConnection = await socialServices.getSocialConnectionByIDS(
                body.firstID, body.secondID
            );

            if (SocialConnection) {
                if (!SocialConnection.code) {
                    responses.success(req, res, SocialConnection);
                } else {
                    responses.error(req, res, SocialConnection);
                }
            } else {
                responses.success(req, res, SocialConnection);
            }
            
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getSocialConnectionsCount(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let socialConnectionsCount

            socialConnectionsCount = await socialServices.getSocialConnectionsCount(body)
            res.send(socialConnectionsCount);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async searchFrendsOrFollowers(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getFrendsOrFollowers = await socialServices.searchFrendsOrFollowers(body)
            responses.success(req, res, getFrendsOrFollowers)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async canINotify(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const canINotify = await socialServices.canINotify(body)
            responses.success(req, res, canINotify)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { error: error })
        }
    }

    public async disableNotificationsUser(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const disableNotificationsUser = await socialServices.disableNotificationsUser(body)
            responses.success(req, res, disableNotificationsUser)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { error: error })
        }
    }

    public async getUserNotificationsOptions(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getUserNotificationsOptions = await socialServices.getUserNotificationsOptions(body)
            responses.success(req, res, getUserNotificationsOptions)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { error: error })
        }
    }

}

export const socialController = new SocialController();