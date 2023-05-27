import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// model
const userReactionsModel = require('../../models/userreactions/UserReactions.model');
const postModel = require('../../models/post/Posts.model');
const commentModel = require('../../models/comments/Comments.model');
const replyToCommentModel = require('../../models/replytocomments/ReplyToComments.model');
const userModel = require('../../models/user/Users.model');
const professionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');

// Services
import { userReactionsServices } from '../../services/userreactions/userreactions.services';
import { similarServices } from '../../services/similarservices/similar.services';

class UserReactionsController {
    public async createReact(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let body = req.body
            let model: any

            const content = await similarServices.identifyPostCommentResponseByID(body.contentID)

            if (!content.code) {
                switch (content.type) {
                    case "post":
                        body.postID = body.contentID
                        model = postModel
                        break;
                    case "comment":
                        body.commentID = body.contentID
                        model = commentModel
                        break;
                    case "replytocomment":
                        body.replyToCommentID = body.contentID
                        model = replyToCommentModel
                        break;
                    case "professionalpost":
                        body.professionalPostID = body.contentID
                        model = professionalPostModel
                        break;
                    default:
                        body.postID = body.contentID
                        model = postModel
                        break;
                }

                const entity = await similarServices.identifyUserBrandOrCommunity(body.entityID)
                if (!entity.code) {
                    switch (entity.type) {
                        case "user":
                            body.userID = body.entityID
                            break;
                        case "marks":
                            body.trademarkID = body.entityID
                            break;
                        case "professional":
                            body.professionalProfileID = body.entityID
                            break;
                        default:
                            body.userID = body.entityID
                            break;
                    }
                    const reactionSaved = await userReactionsServices.saveUserReaction({ ...body, entity }, model, body.contentID);

                    res.send(reactionSaved)
                    /* if (reactionSaved) {
                        userReactionSaved = reactionSaved
                    } else {
                        reactionSavedError = ConstantsRS.ERROR_SAVING_RECORD
                    }

                    res.send({
                        error: reactionSavedError ? reactionSavedError : null,
                        success: userReactionSaved ? true : false,
                        data: userReactionSaved
                    }); */
                } else {
                    res.send({
                        error: ConstantsRS.USER_DOES_NOT_EXIST,
                        success: false,
                        data: null
                    });
                }
            } else {
                res.send({
                    error: ConstantsRS.THE_RECORD_DOES_NOT_EXIST,
                    success: false,
                    data: null
                });
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async getReactionsByIdEntity(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let body = req.body
            let model: any, reactions

            const entity = await similarServices.identifyPostCommentResponseByID(body.entityID)
            if (entity.model) {
                switch (entity.model) {
                    case "post":
                        body.postID = body.entityID
                        model = postModel
                        break;
                    case "comment":
                        body.commentID = body.entityID
                        model = commentModel
                        break;
                    case "replytocomment":
                        body.replyToCommentID = body.entityID
                        model = replyToCommentModel
                        break;
                    default:
                        body.postID = body.entityID
                        model = postModel
                        break;
                }

                reactions = await userReactionsServices.getReactions(model, body.entityID)
                res.send(reactions)
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
}

export const userReactionsController = new UserReactionsController();