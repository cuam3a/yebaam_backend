import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { middlewares } from '../../middlewares/middleware';
import { replyToCommentServices } from '../../services/replytocomments/replytocomments.services';
import { similarServices } from '../../services/similarservices/similar.services';
import { responses } from '../../controllers/utils/response/response';

const commentsModel = require('../../models/comments/Comments.model');
const replyToCommentModel = require('../../models/replytocomments/ReplyToComments.model');

class ReplyToCommentsController {
    public async createReplyComment(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const replyCommentSaved = await replyToCommentServices.saveReplyComment(body)
            res.send(replyCommentSaved);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async updateReplyCommentById(req: Request, res: Response) {
        try {
            const body = req.body;
            let replyCommentUpdated
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const replyCommentToUpdate = await similarServices.updateEntityContent(body, 'replytocomment');
            if (replyCommentToUpdate) {
                replyCommentUpdated = await replyToCommentModel.findById({ _id: body.id })
            }

            responses.success(req, res, replyCommentUpdated);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deleteReplyCommentById(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const replyCommentDeleted = await replyToCommentServices.deleteReplyCommentById(body)
            res.send(replyCommentDeleted)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
}

export const replyToCommentController = new ReplyToCommentsController()