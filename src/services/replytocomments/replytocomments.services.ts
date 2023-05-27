import { ConstantsRS } from '../../utils/constants';
const commentsModel = require('../../models/comments/Comments.model');
const replyToCommentModel = require('../../models/replytocomments/ReplyToComments.model');

// services
import { similarServices } from '../../services/similarservices/similar.services';
import { notificationsServices } from '../notifications/notifications.services';
import Server from '../../app';
import { postSevices } from '../post/post.services';
import { professionalPostServices } from '../professionalpost/professionalpost.services';
import { socialServices } from '../social/social.services';
import { socialProfessionalServices } from '../social/socialprofessional.services';

class ReplyToCommentServices {
    public async saveReplyComment(body: any) {
        try {
            let rta, rtaError, model
            const server = Server.instance;
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
                }

                body.commentingUser = {
                    _id: entity._id,
                    name: entity.name,
                    profilePicture: entity.profilePicture
                }
                const comment = await commentsModel.findOne({ _id: body.commentID, isEnabled: true })
                if (comment) {
                    const replyCommentToSave = new replyToCommentModel(body);
                    if (comment.postID != undefined) {
                        replyCommentToSave.postID = comment.postID
                    } else if (comment.professionalPostID != undefined) {
                        replyCommentToSave.professionalPostID = comment.professionalPostID
                    }
                    const replyCommentSaved = await replyCommentToSave.save()
                    if (replyCommentSaved) {
                        let addressee: any, notification = 'Notificación por respuesta al comentario', whoIsNotified, verifyEntity, professionalOrOthers;
                        if (comment.userID != undefined) {
                            addressee = await similarServices.identifyUserBrandOrCommunity(comment.userID)
                            whoIsNotified = 'U4'
                            verifyEntity = comment.userID
                            professionalOrOthers = 0
                        } else if (comment.trademarkID != undefined) {
                            addressee = await similarServices.identifyUserBrandOrCommunity(comment.trademarkID)
                            whoIsNotified = 'M4'
                            verifyEntity = comment.trademarkID
                            professionalOrOthers = 0
                        } else if (comment.professionalProfileID != undefined) {
                            addressee = await similarServices.identifyUserBrandOrCommunity(comment.professionalProfileID)
                            whoIsNotified = 'P4'
                            verifyEntity = comment.professionalProfileID
                            professionalOrOthers = 1
                        }
                        const payload = {
                            from: entity,
                            bodyReplyComment: replyCommentSaved,
                        };
                        await server.io
                            .in(addressee.socketID)
                            .emit("reply-comment", payload);
                        const commentUpdate = new commentsModel(comment);
                        commentUpdate.replyCommentsIDS.push(replyCommentSaved.id)
                        commentUpdate.responses = (comment.responses + 1)
                        const commentToUpdate = await commentsModel.updateOne({ _id: body.commentID }, commentUpdate);
                        if (commentToUpdate.nModified == 1) {
                            rta = await replyToCommentModel.findById(replyCommentSaved.id)
                                .populate({
                                    path: 'userID',
                                    model: 'Users',
                                    populate: {
                                        path: 'rankID',
                                        model: 'Ranks',
                                    }
                                })
                            let post
                            if (rta.postID != undefined) {
                                post = await postSevices.postByID(rta.postID)
                            } else if (rta.professionalPostID != undefined) {
                                post = await professionalPostServices.postByID(rta.professionalPostID)
                            }
                            if (post.disableNotifications != undefined && post.disableNotifications == false) {
                                let notifyComment = { replycomment: replyCommentSaved, notification: notification, whoIsNotified: whoIsNotified }
                                if (entity.id != verifyEntity) {
                                    if (professionalOrOthers == 0) {
                                        const canInotifyValidate = await socialServices.canINotify({ firstID: entity.id, secondID: verifyEntity })
                                        if (!canInotifyValidate) {
                                            await notificationsServices.sendNotificationReplyComment(notifyComment)
                                        }
                                    } else if (professionalOrOthers == 1) {
                                        const canInotifyValidate = await socialProfessionalServices.canINotify({ firstID: entity.id, secondID: verifyEntity })
                                        if (!canInotifyValidate) {
                                            await notificationsServices.sendNotificationReplyComment(notifyComment)
                                        }
                                    }
                                }
                            }
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }

            return {
                error: rtaError ? rtaError : null,
                success: rta ? true : false,
                data: rta ? rta : null
            }
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async deleteReplyCommentById(body: any) {
        let rta: any, rtaError, success = false, response = {}
        await replyToCommentModel.findOne({ _id: body.id })
            .then(async (reply: any) => {
                const replyCommentUpdate = await replyToCommentModel.updateOne({ _id: body.id }, { isEnabled: false })
                if (replyCommentUpdate) {
                    /* await commentsModel.updateOne(
                        { _id: reply.commentID },
                        { $pull: { replyCommentsIDS: body.id } },
                        { new: true }
                    ).then(async () => {
                        success = true
                        rta = 'Comentario eliminado satisfactoriamente'
                    }) */
                    let comment = await commentsModel.findOne({ _id: reply.commentID })
                    if (comment) {
                        const commentUpdate = await commentsModel.updateOne({ _id: reply.commentID }, { responses: (comment.responses - 1) });
                        if (commentUpdate) {
                            success = true
                            rta = 'Comentario eliminado satisfactoriamente'
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    } else {
                        rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                    }
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                    rta = null
                }
                /* }).catch(() => {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                    rta = null
                }) */
            })
        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta
        };
    }
}

export const replyToCommentServices = new ReplyToCommentServices();