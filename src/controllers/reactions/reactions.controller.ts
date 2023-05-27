import { Request, Response } from 'express';

// models
const reactionsModel = require('../../models/reactions/Reactions.model');

// classes
import { ConstantsRS } from '../../utils/constants';
import { reactionsServices } from '../../services/reactions/reactions.services';
import { responses } from '../../controllers/utils/response/response';

// middlewares
import { middlewares } from '../../middlewares/middleware';

class ReactionsController {
    public async createReaction(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const reactionToRegister = await reactionsModel.findOne({ name: body.name }).exec();
            if (!reactionToRegister) {
                let reaction = await reactionsServices.createReaction(body)
                res.send(reaction)
            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_ALREDY_EXISTS);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async getallReactions(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const reactions = await reactionsModel.find({})

            res.send({
                error: null,
                success: true,
                data: reactions
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getReactionById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const reaction = await reactionsModel.findOne({ _id: req.body.id })
            res.send({
                error: null,
                success: true,
                data: reaction
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async deleteReactionById(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const reaction = await reactionsModel.findOne({ _id: body.id }).exec()
            if (reaction != null) {
                await reactionsModel.deleteOne({ _id: body.id }).then(() => {
                    responses.success(req, res, 'Registro eliminado satisfactoriamente');
                }).catch((error: any) => {
                    responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
                });

            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async updateReactionById(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */

            const reactionUpdate = await reactionsModel.updateOne({ _id: body.id }, req.body);

            res.send({
                error: null,
                success: true,
                data: reactionUpdate
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }
}

export const reactionsController = new ReactionsController();