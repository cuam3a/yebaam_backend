import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { middlewares } from '../../middlewares/middleware';
import { commentServices } from '../../services/comments/comments.services';
import { similarServices } from '../../services/similarservices/similar.services';
const commentModel = require('../../models/comments/Comments.model');
const postModel = require('../../models/post/Posts.model');
const userModel = require('../../models/user/Users.model');
import { responses } from '../utils/response/response';

class CommentsController {
    public async createComment(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const commentToSave = await commentServices.saveComment(body)
            if (!commentToSave.code) {
                responses.success(req, res, commentToSave);
            } else {
                responses.error(req, res, commentToSave);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async deleteCommentById(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const commentToDelete = await commentServices.deleteComment(body)
            if (!commentToDelete.code) {
                responses.success(req, res, commentToDelete);
            } else {
                responses.error(req, res, commentToDelete);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async getCommentsNRepliesNReactionsByPostID(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let comments: any = await commentServices.getCommentsNRepliesNReactionsByPost(body.contentID)

            if (!comments.code) {
                comments.filter((obj: any) => {
                    if (obj.reactionsIDS.length > 0) {
                        obj.reactionsIDS.filter((reacts: any) => {
                            if (reacts.userID != undefined) {
                                if (reacts.userID._id == body.entityID) {
                                    obj.myReaction = {
                                        userID: reacts.userID._id,
                                        value: reacts.value
                                    }
                                }
                            } else if (reacts.professionalProfileID != undefined) {
                                if (reacts.professionalProfileID._id == body.entityID) {
                                    obj.myReaction = {
                                        professionalProfileID: reacts.professionalProfileID._id,
                                        value: reacts.value
                                    }
                                }
                            }
                        })
                    }

                    if (obj.replyCommentsIDS.length > 0) {
                        obj.replyCommentsIDS.filter((responses: any) => {
                            if (responses.reactionsIDS.length > 0) {
                                responses.reactionsIDS.filter((reaction: any) => {
                                    if (reaction.userID != undefined) {
                                        if (reaction.userID._id == body.entityID) {
                                            responses.myReaction = {
                                                userID: reaction.userID._id,
                                                value: reaction.value
                                            }
                                        }
                                    } else if (reaction.professionalProfileID != undefined) {
                                        if (reaction.professionalProfileID._id == body.entityID) {
                                            responses.myReaction = {
                                                professionalProfileID: reaction.professionalProfileID._id,
                                                value: reaction.value
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                });

                responses.success(req, res, comments);
            } else {
                responses.error(req, res, comments);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async getCommentNRepliesNReactionsByID(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let comment: any
            comment = await commentServices.getCommentNRepliesNReactionsByComment(body.commentID)

            if (!comment.code) {
                if (comment.reactionsIDS.length > 0) {
                    comment.reactionsIDS.filter((reacts: any) => {
                        if (reacts.userID != undefined) {
                            if (reacts.userID._id == body.entityID) {
                                comment.myReaction = {
                                    userID: reacts.userID._id,
                                    value: reacts.value
                                }
                            }
                        } else if (reacts.professionalProfileID != undefined) {
                            if (reacts.professionalProfileID._id == body.entityID) {
                                comment.myReaction = {
                                    professionalProfileID: reacts.professionalProfileID._id,
                                    value: reacts.value
                                }
                            }
                        }
                    })
                }

                if (comment.replyCommentsIDS.length > 0) {
                    comment.replyCommentsIDS.filter((responses: any) => {
                        if (responses.reactionsIDS.length > 0) {
                            responses.reactionsIDS.filter((reaction: any) => {
                                if (reaction.userID != undefined) {
                                    if (reaction.userID._id == body.entityID) {
                                        responses.myReaction = {
                                            userID: reaction.userID._id,
                                            value: reaction.value
                                        }
                                    }
                                } else if (reaction.professionalProfileID != undefined) {
                                    if (reaction.professionalProfileID._id == body.entityID) {
                                        responses.myReaction = {
                                            professionalProfileID: reaction.professionalProfileID._id,
                                            value: reaction.value
                                        }
                                    }
                                }
                            })
                        }
                    })
                }

                responses.success(req, res, comment);
            } else {
                responses.error(req, res, comment);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async updateCommentById(req: Request, res: Response) {
        try {
            const body = req.body;
            let commentUpdated, token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const commentToUpdate = await similarServices.updateEntityContent(body, 'comment');
            if (commentToUpdate) {
                commentUpdated = await commentModel.findById({ _id: body.id })
            }

            responses.success(req, res, commentUpdated);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }
}

export const commentsController = new CommentsController()