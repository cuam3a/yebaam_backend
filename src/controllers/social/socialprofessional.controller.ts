import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { socialServices } from '../../services/social/social.services';
import { middlewares } from '../../middlewares/middleware';
import { socialProfessionalServices } from '../../services/social/socialprofessional.services';
import { responses } from '../utils/response/response';
const socialProfessionalModel = require('../../models/socialprofessional/SocialProfessional.model')

class SocialProfessionalController {
    public async actionsSocialProfessional(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let actionPerformed: any
            switch (body.type) {
                case 1:
                    actionPerformed = await socialProfessionalServices.sendFriendRequest(body)
                    break;
                case 2:
                    actionPerformed = await socialProfessionalServices.acceptRequest(body)
                    break;
                case 3:
                    actionPerformed = await socialProfessionalServices.cancelRequest(body)
                    break;
                case 4:
                    actionPerformed = await socialProfessionalServices.removeContact(body)
                    break;
                case 5:
                    actionPerformed = await socialProfessionalServices.blockContact(body)
                    break;
                case 6:
                    actionPerformed = await socialProfessionalServices.unblockContact(body)
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

    public async getSocialProfessionalConnections(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let socialConnections

            socialConnections = await socialProfessionalServices.getSocialConnections(body)
            res.send(socialConnections);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getContacsRequests(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let FriendRequests

            FriendRequests = await socialProfessionalServices.getContactsRequests(body)
            res.send(FriendRequests);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getSocialProfessionalConnectionByIDS(req: any, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const SocialConnection = await socialProfessionalModel.findOne(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.body.firstID },
                                { secondID: req.body.secondID }
                            ]
                        },
                        {
                            $and: [
                                { firstID: req.body.secondID },
                                { secondID: req.body.firstID }
                            ]
                        }
                    ]
                }
            )


            res.send({
                error: SocialConnection ? null : ConstantsRS.THE_RECORD_DOES_NOT_EXIST,
                success: SocialConnection ? true : false,
                data: SocialConnection ? SocialConnection : []
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getSocialProfessionalConnectionsCount(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let socialConnectionsCount

            socialConnectionsCount = await socialProfessionalServices.getSocialConnectionsCount(body)
            res.send(socialConnectionsCount);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async searchContacts(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const contacts = await socialProfessionalServices.searchContacts(body)
            responses.success(req, res, contacts)
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
            const canINotify = await socialProfessionalServices.canINotify(body)
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
            const disableNotificationsUser = await socialProfessionalServices.disableNotificationsProfesional(body)
            responses.success(req, res, disableNotificationsUser)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { error: error })
        }
    }

    public async getProfessionalNotificationsOptions(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getProfessionalNotificationsOptions = await socialProfessionalServices.getProfessionalNotificationsOptions(body)
            responses.success(req, res, getProfessionalNotificationsOptions)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { error: error })
        }
    }
}

export const socialProfessionalController = new SocialProfessionalController();