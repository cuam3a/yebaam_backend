import { similarServices } from '../similarservices/similar.services';
import { ConstantsRS } from '../../utils/constants';
import Server from '../../app';
import { adminUsersServices } from '../Admin/usersManagement/adminUsers.service';
import e from 'express';
import { postSevices } from '../post/post.services';
import { professionalPostServices } from '../professionalpost/professionalpost.services';
import { commentServices } from '../comments/comments.services';
import { communitiesServices } from '../communities/community.services';
import { professionalCommunitiesServices } from '../communitiesprofessionales/professionalcommunities.service';
import { postRequestServices } from '../postrequests/postrequests.service';
import { userSettingsServices } from '../usersettings/usersettings.service';
var _ = require("lodash");

//#region models
const NotificationsRequestsUsersModel = require('../../models/notifications/NotificationsRequestsUsers.model')
const NotificationsRequestsProfessionalsModel = require('../../models/notifications/NotificationsRequestsProfessionals.model')
const NotificationsAuthenticationModel = require('../../models/notifications/NotificationsAuthentication.model')
const SocialNetworkNotificationsModel = require('../../models/notifications/SocialNetworkNotifications')
const ProfessionalNetworkNotificationsModel = require('../../models/notifications/ProfessionalNetworkNotifications.model')
const ColorChangenotificationModel = require('../../models/notifications/ColorChangenotification.model')
const CommunityNotificationsModel = require('../../models/notifications/CommunityNotifications.model')
const NotificationsProfessionalCommunityModel = require('../../models/notifications/NotificationsProfessionalCommunity.model')
const RoleAssignNotificationsCommunityModel = require('../../models/notifications/RoleAssignNotificationsCommunity.model')
const RoleAssignNotificationsProfessionalCommunityModel = require('../../models/notifications/RoleAssignNotificationsProfessionalCommunity.model')
const NotificationsAwardsOrBadgesModel = require('../../models/notifications/NotificationsAwardsOrBadges.model')
const CommunityPostRequestNotificationsModel = require('../../models/notifications/CommunityPostRequestNotifications.model')
const ProfessionalCommunityPostRequestNotificationsModel = require('../../models/notifications/ProfessionalCommunityPostRequestNotifications.model')
const PqrsNotitcationsModel = require('../../models/notifications/PqrsNotitcations.model')
//#endregion

class NotificationsServices {

    public async getAnyNotificationById(notificationId: any) {
        try {
            let getNotification
            const notifications = await NotificationsRequestsUsersModel.findOne({
                $and: [{ _id: notificationId }, { isEnabled: true }]
            })
            if (notifications) {
                getNotification = notifications
            } else {
                const notifications1 = await NotificationsRequestsProfessionalsModel.findOne({
                    $and: [{ _id: notificationId }, { isEnabled: true }]
                })
                if (notifications1) {
                    getNotification = notifications1
                } else {
                    const notifications2 = await NotificationsAuthenticationModel.findOne({
                        $and: [{ _id: notificationId }, { isEnabled: true }]
                    })
                    if (notifications2) {
                        getNotification = notifications2
                    } else {
                        const notifications3 = await SocialNetworkNotificationsModel.findOne({
                            $and: [{ _id: notificationId }, { isEnabled: true }]
                        })
                        if (notifications3) {
                            getNotification = notifications3
                        } else {
                            const notifications4 = await ProfessionalNetworkNotificationsModel.findOne({
                                $and: [{ _id: notificationId }, { isEnabled: true }]
                            })
                            if (notifications4) {
                                getNotification = notifications4
                            } else {
                                const notifications5 = await ColorChangenotificationModel.findOne({
                                    $and: [{ _id: notificationId }, { isEnabled: true }]
                                })
                                if (notifications5) {
                                    getNotification = notifications5
                                } else {
                                    const notifications6 = await CommunityNotificationsModel.findOne({
                                        $and: [{ _id: notificationId }, { isEnabled: true }]
                                    })
                                    if (notifications6) {
                                        getNotification = notifications6
                                    } else {
                                        const notifications7 = await CommunityPostRequestNotificationsModel.findOne({
                                            $and: [{ _id: notificationId }, { isEnabled: true }]
                                        })
                                        if (notifications7) {
                                            getNotification = notifications7
                                        } else {
                                            const notifications8 = await NotificationsAwardsOrBadgesModel.findOne({
                                                $and: [{ _id: notificationId }, { isEnabled: true }]
                                            })
                                            if (notifications8) {
                                                getNotification = notifications8
                                            } else {
                                                const notifications9 = await NotificationsProfessionalCommunityModel.findOne({
                                                    $and: [{ _id: notificationId }, { isEnabled: true }]
                                                })
                                                if (notifications9) {
                                                    getNotification = notifications9
                                                } else {
                                                    const notifications10 = await PqrsNotitcationsModel.findOne({
                                                        $and: [{ _id: notificationId }, { isEnabled: true }]
                                                    })
                                                    if (notifications10) {
                                                        getNotification = notifications10
                                                    } else {
                                                        const notifications11 = await ProfessionalCommunityPostRequestNotificationsModel.findOne({
                                                            $and: [{ _id: notificationId }, { isEnabled: true }]
                                                        })
                                                        if (notifications11) {
                                                            getNotification = notifications11
                                                        } else {
                                                            const notifications12 = await RoleAssignNotificationsCommunityModel.findOne({
                                                                $and: [{ _id: notificationId }, { isEnabled: true }]
                                                            })
                                                            if (notifications12) {
                                                                getNotification = notifications12
                                                            } else {
                                                                const notifications13 = await ProfessionalCommunityPostRequestNotificationsModel.findOne({
                                                                    $and: [{ _id: notificationId }, { isEnabled: true }]
                                                                })
                                                                if (notifications13) {
                                                                    getNotification = notifications13
                                                                } else {
                                                                    getNotification
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return getNotification
        } catch (error) {
            console.log(error);
        }
    }

    //#region sendNotification
    public async sendNotificationCertificate(body: any) {
        try {
            let model, rta;
            const server = Server.instance;
            if (body.typeForNotiFy != undefined) {
                let sender
                if (body.userID != undefined) {
                    sender = body.userID
                } else if (body.professionalProfileID != undefined) {
                    sender = body.professionalProfileID
                } else if (body.trademarkID != undefined) {
                    sender = body.trademarkID
                }
                let notify
                const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(sender)
                const admins = await adminUsersServices.getAdminUsersByCodeOfRole({ code: 'ADM004' })

                if (admins.length > 0) {
                    for await (let admin of admins) {
                        notify = {
                            senderID: sender,
                            addresseeID: admin.id,
                            certificateId: body.id,
                            infoSender: senderNotify,
                            infoAddressee: admin,
                            notification: body.notification,
                            whoIsNotified: body.whoIsNotified
                        }
                        model = new NotificationsAuthenticationModel(notify)
                        const bodyNotify = await model.save()
                        if (bodyNotify) {
                            const getNotify = await NotificationsAuthenticationModel.findOne({ _id: bodyNotify.id })
                            .populate('certificateId')
                            const payload = {
                                from: sender,
                                bodyNotification: getNotify
                            }
                            await server.io.in(admin.socketID).emit('notification', payload)
                        }
                    }
                    rta = {
                        error: null,
                        success: true,
                        message: 'Notificación enviada'
                    }
                }
                return rta
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationTaggedUsers(body: any) {
        try {
            let model, rta, whoIsNotified;
            const server = Server.instance;
            
            if (body.taggedUsers != undefined && body.taggedUsers.length > 0) {
                let sender
                if (body.userID != undefined) {
                    sender = body.userID
                    whoIsNotified = 'U2'
                } else if (body.trademarkID != undefined) {
                    sender = body.trademarkID
                    whoIsNotified = 'M2'
                }

                let notify
                const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(sender)
                
                for await (let userTagged of body.taggedUsers) {
                    let tagged = await similarServices.identifyUserBrandOrCommunityMessages(userTagged.id)
                    console.log('que retorna esto: ', tagged );
                    
                    if (tagged.disableAnyNotification != undefined) {
                        const getConfig = await userSettingsServices.getUserSettingsByEntityId({entityId:userTagged.id})
                        if (getConfig) {
                            if (getConfig.entityId == userTagged.id) {
                                if (getConfig.isDisabledNotificactionOfTagged == false) {
                                    notify = {
                                        senderID: sender,
                                        addresseeID: userTagged.id,
                                        postId: body.id,
                                        infoSender: senderNotify,
                                        infoAddressee: tagged,
                                        notification: 'Notificación usuario etiquetado',
                                        whoIsNotified: whoIsNotified
                                    }
                                    model = new SocialNetworkNotificationsModel(notify)
                                    const bodyNotify = await model.save()
                                    if (bodyNotify) {
                                        const getNotify = await SocialNetworkNotificationsModel.findOne({ _id: bodyNotify.id })
                                        .populate('postId')
                                        .populate('commentId')
                                        .populate('replyToCommentId')
                                        .populate('reactionId')
                                        const payload = {
                                            from: sender,
                                            bodyNotification: getNotify
                                        }
                                        await server.io.in(tagged.socketID).emit('notification', payload)
                                    }
                                }
                            }
                        }
                    }
                }
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationProffesionalTaggedUsers(body: any) {
        try {
            let model, rta;
            const server = Server.instance;
            if (body.taggedUsers != undefined && body.taggedUsers > 0) {
                let notify
                const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(body.professionalProfileID)
                for await (let userTagged of body.taggedUsers) {
                    let tagged = await similarServices.identifyUserBrandOrCommunityMessages(userTagged)
                    const getConfig = await userSettingsServices.getUserSettingsByEntityId({entityId:userTagged})
                    if (getConfig) {
                        if (getConfig.entityId == userTagged) {
                            if (getConfig.isDisabledNotificactionOfTagged == false) {
                                if (tagged.disableAnyNotification.beTagged == false) {
                                    notify = {
                                        senderID: body.professionalProfileID,
                                        addresseeID: userTagged,
                                        ProfessionalPostsId: body.id,
                                        infoSender: senderNotify,
                                        infoAddressee: tagged,
                                        notification: 'Notificación usuario etiquetado',
                                        whoIsNotified: 'P2'
                                    }
                                    model = new ProfessionalNetworkNotificationsModel(notify)
                                    const bodyNotify = await model.save()
                                    if (bodyNotify) {
                                        const getNotify = await ProfessionalNetworkNotificationsModel.findOne({ _id: bodyNotify.id })
                                        .populate('ProfessionalPostsId')
                                        .populate('commentId')
                                        .populate('replyToCommentId')
                                        .populate('reactionId')
                                        const payload = {
                                            from: body.professionalProfileID,
                                            bodyNotification: getNotify
                                        }
                                        await server.io.in(tagged.socketID).emit('notification', payload)
                                    }
                                }
                            }
                        }
                    }
                }
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationComment(body: any) {
        try {
            let model, rta, sender, addressee, notify, getModel: any;
            const server = Server.instance;
            if (body.comment.userID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.comment.userID)
                const getPost = await postSevices.postByID(body.comment.postID)
                addressee = await similarServices.identifyUserBrandOrCommunity(getPost.userID.id)
                //addressee = getPost.userID                
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    postId: body.comment.postID,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.comment.id,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new SocialNetworkNotificationsModel(notify)
                getModel = SocialNetworkNotificationsModel
            } else if (body.comment.professionalProfileID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.comment.professionalProfileID)
                    const getPost = await professionalPostServices.postByID(body.comment.professionalPostID)
                    addressee = await similarServices.identifyUserBrandOrCommunity(getPost.professionalProfileID.id)
                    //addressee = getPost.professionalProfileID
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    ProfessionalPostsId: body.comment.professionalPostID,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.comment.id,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new ProfessionalNetworkNotificationsModel(notify)
                getModel = ProfessionalNetworkNotificationsModel
            }

            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                .populate('postId')
                .populate('ProfessionalPostsId')
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationReplyComment(body: any) {
        try {
            let model, rta, sender, addressee, notify, getModel: any;
            const server = Server.instance;
            const getComment = await commentServices.getCommentById(body.replycomment.commentID)

            if (body.replycomment.userID != undefined && getComment.userID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.replycomment.userID)
                addressee = await similarServices.identifyUserBrandOrCommunity(getComment.userID)
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    replyToCommentId: body.replycomment.id,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.replycomment.commentID,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new SocialNetworkNotificationsModel(notify)
                getModel = SocialNetworkNotificationsModel
            } else if (body.replycomment.userID != undefined && getComment.trademarkID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.replycomment.userID)
                addressee = await similarServices.identifyUserBrandOrCommunity(getComment.trademarkID)
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    replyToCommentId: body.replycomment.id,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.replycomment.commentID,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new SocialNetworkNotificationsModel(notify)
                getModel = SocialNetworkNotificationsModel
            } else if (body.replycomment.trademarkID != undefined && getComment.userID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.replycomment.trademarkID)
                addressee = await similarServices.identifyUserBrandOrCommunity(getComment.userID)
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    replyToCommentId: body.replycomment.id,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.replycomment.commentID,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new SocialNetworkNotificationsModel(notify)
                getModel = SocialNetworkNotificationsModel
            } else if (body.replycomment.professionalProfileID != undefined && getComment.professionalProfileID != undefined) {
                sender = await similarServices.identifyUserBrandOrCommunity(body.replycomment.professionalProfileID)
                addressee = await similarServices.identifyUserBrandOrCommunity(getComment.professionalProfileID)
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    replyToCommentId: body.replycomment.id,
                    infoSender: sender,
                    infoAddressee: addressee,
                    commentId: body.replycomment.commentID,
                    notification: body.notification,
                    whoIsNotified: body.whoIsNotified
                }
                model = new ProfessionalNetworkNotificationsModel(notify)
                getModel = ProfessionalNetworkNotificationsModel
            }

            if (model) {
                const bodyNotify = await model.save()
                if (bodyNotify) {
                    const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                    .populate('postId')
                    .populate('ProfessionalPostsId')
                    .populate('commentId')
                    .populate('replyToCommentId')
                    .populate('reactionId')
                    const payload = {
                        from: sender,
                        bodyNotification: getNotify
                    }
                    await server.io.in(addressee.socketID).emit('notification', payload)
                    rta = {
                        error: null,
                        success: true,
                        message: 'Notificación enviada'
                    }
                }
                return rta
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationReaction(senderId: any, body: any, reaction: any) {
        try {
            let sender, model, getModel, notify, addressee, rta, notification = 'Notificación por reacción', whoIsNotified;
            const server = Server.instance;
            sender = await similarServices.identifyUserBrandOrCommunity(senderId)
            if (body.userID != undefined) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.userID)
                whoIsNotified = 'U5'
            } else if (body.professionalProfileID != undefined) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.professionalProfileID)
                whoIsNotified = 'P5'
            }  else if (body.trademarkID != undefined) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.professionalProfileID)
                whoIsNotified = 'T5'
            }
            switch (body.type) {
                case "post":
                    notify = {
                        senderID: sender.id,
                        addresseeID: addressee.id,
                        reactionId: reaction.id,
                        postId: body.id,
                        infoSender: sender,
                        infoAddressee: addressee,
                        notification: notification,
                        whoIsNotified: whoIsNotified
                    }
                    model = new SocialNetworkNotificationsModel(notify)
                    getModel = SocialNetworkNotificationsModel
                    break;
                case "comment":
                    if (body.postID != undefined) {
                        notify = {
                            senderID: sender.id,
                            addresseeID: addressee.id,
                            reactionId: reaction.id,
                            postId: body.PostID,
                            infoSender: sender,
                            infoAddressee: addressee,
                            commentId: body.id,
                            notification: notification,
                            whoIsNotified: whoIsNotified
                        }
                        model = new SocialNetworkNotificationsModel(notify)
                        getModel = SocialNetworkNotificationsModel
                    } else if (body.professionalPostID != undefined) {
                        notify = {
                            senderID: sender.id,
                            addresseeID: addressee.id,
                            reactionId: reaction.id,
                            ProfessionalPostsId: body.professionalPostID,
                            infoSender: sender,
                            infoAddressee: addressee,
                            commentId: body.id,
                            notification: notification,
                            whoIsNotified: whoIsNotified
                        }
                        model = new ProfessionalNetworkNotificationsModel(notify)
                        getModel = ProfessionalNetworkNotificationsModel
                    }
                    break;
                case "replytocomment":
                    if (body.postID != undefined) {
                        notify = {
                            senderID: sender.id,
                            addresseeID: addressee.id,
                            reactionId: reaction.id,
                            postId: body.PostID,
                            infoSender: sender,
                            infoAddressee: addressee,
                            commentId: body.commentID,
                            replyToCommentId: body.id,
                            notification: notification,
                            whoIsNotified: whoIsNotified
                        }
                        model = new SocialNetworkNotificationsModel(notify)
                        getModel = SocialNetworkNotificationsModel
                    } else if (body.professionalPostID != undefined) {
                        notify = {
                            senderID: sender.id,
                            addresseeID: addressee.id,
                            reactionId: reaction.id,
                            ProfessionalPostsId: body.professionalPostID,
                            infoSender: sender,
                            infoAddressee: addressee,
                            commentId: body.commentID,
                            replyToCommentId: body.id,
                            notification: notification,
                            whoIsNotified: whoIsNotified
                        }
                        model = new ProfessionalNetworkNotificationsModel(notify)
                        getModel = ProfessionalNetworkNotificationsModel
                    }
                    break;
                case "professionalpost":
                    notify = {
                        senderID: sender.id,
                        addresseeID: addressee.id,
                        reactionId: reaction.id,
                        ProfessionalPostsId: body.id,
                        infoSender: sender,
                        infoAddressee: addressee,
                        notification: notification,
                        whoIsNotified: whoIsNotified
                    }
                    model = new ProfessionalNetworkNotificationsModel(notify)
                    getModel = ProfessionalNetworkNotificationsModel
                    break;
            }
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                .populate('postId')
                .populate('ProfessionalPostsId')
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationSharePost(body: any, sender: any) {
        try {
            let model, rta, addresseid, notification = 'Notificación por publicación compartida', whoIsNotified;
            const server = Server.instance;
            if (body.userID != undefined) {
                addresseid = body.userID
                whoIsNotified = 'U6'
            } else if (body.trademarkID != undefined) {
                addresseid = body.trademarkID
                whoIsNotified = 'M6'
            }
            let notify
            const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(sender)
            let addresse = await similarServices.identifyUserBrandOrCommunityMessages(addresseid)
            notify = {
                senderID: sender,
                addresseeID: addresseid,
                postId: body.id,
                infoSender: senderNotify,
                infoAddressee: addresse,
                notification: notification,
                whoIsNotified: whoIsNotified
            }
            model = new SocialNetworkNotificationsModel(notify)
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await SocialNetworkNotificationsModel.findOne({ _id: bodyNotify.id })
                .populate('postId')
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addresse.socketID).emit('notification', payload)
            }
            rta = {
                error: null,
                success: true,
                message: 'Notificación enviada'
            }

            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationSharePostProfessional(body: any, sender: any) {
        try {
            let model, rta, addresseid;
            const server = Server.instance;
            addresseid = body.professionalProfileID
            let notify
            const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(sender)
            let addresse = await similarServices.identifyUserBrandOrCommunityMessages(addresseid)
            notify = {
                senderID: sender,
                addresseeID: addresseid,
                ProfessionalPostsId: body.id,
                infoSender: senderNotify,
                infoAddressee: addresse,
                notification: 'Notificación por publicación compartida',
                whoIsNotified: 'P6'
            }
            model = new ProfessionalNetworkNotificationsModel(notify)
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await ProfessionalNetworkNotificationsModel.findOne({ _id: bodyNotify.id })
                .populate('ProfessionalPostsId')
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addresse.socketID).emit('notification', payload)
            }
            rta = {
                error: null,
                success: true,
                message: 'Notificación enviada'
            }

            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async generateNotification(body: any) {
        try {
            let model, getModel, bodyNotify, flag = true, rta
            const server = Server.instance;
            if (body.typeForNotiFy != undefined) {
                bodyNotify = await this.sendNotificationCertificate(body)
                flag = false
            } else if (body.socialProfessionalId != undefined) {
                model = new NotificationsRequestsProfessionalsModel(body)
                getModel = NotificationsRequestsProfessionalsModel
            } else if (body.socialId != undefined || body.chatConnectionId != undefined) {                
                if (body.chatConnectionId != undefined) {
                    model = new NotificationsRequestsUsersModel(body)
                    model.notification = 'Notificaciones por solicitud a sala de chat'
                    model.whoIsNotified = 'U16'
                } else if (body.socialId != undefined) {
                    model = new NotificationsRequestsUsersModel(body)
                }
                getModel = NotificationsRequestsUsersModel
                flag = true
            }

            if (flag) {
                const sender = await similarServices.identifyUserBrandOrCommunityMessages(model.senderID)
                const addressee = await similarServices.identifyUserBrandOrCommunity(model.addresseeID)
                sender ? model.infoSender = sender : model.infoSender = []
                addressee ? model.infoAddressee = addressee : model.infoAddressee = []
                if (model.socialId != undefined) {
                    const getnotify = await NotificationsRequestsUsersModel.findOne({
                        $and:[{senderID:sender.id},{addresseeID:addressee.id},{socialId:{ $exists: true }},{isEnabled:true}]
                    })
                    if (getnotify) {
                        let update = {
                            $set: {
                                doYouSeeTheNotification: false,
                                isEnabled: true,
                                creationDate:new Date()
                            }
                          }
                        bodyNotify = await NotificationsRequestsUsersModel.findOneAndUpdate({_id:getnotify.id}, update,{new:true})
                    }else {
                        bodyNotify = await model.save()
                    }
                } else if (model.chatConnectionId != undefined) {
                    const getnotify = await NotificationsRequestsUsersModel.findOne({
                        $and:[{senderID:sender.id},{addresseeID:addressee.id},{chatConnectionId:{ $exists: true }},{isEnabled:true}]
                    })
                    if (getnotify) {
                        let update = {
                            $set: {
                                doYouSeeTheNotification: false,
                                isEnabled: true,
                                creationDate:new Date()
                            }
                          }
                        bodyNotify = await NotificationsRequestsUsersModel.findOneAndUpdate({_id:getnotify.id}, update,{new:true})
                    }else {
                        bodyNotify = await model.save()
                    }
                }else {
                    bodyNotify = await model.save()
                }
                if (bodyNotify) {
                    if (bodyNotify != undefined) {
                        if (bodyNotify.chatConnectionId != undefined) { 
                            const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                            .populate( {
                                path: 'chatConnectionId',
                                model: 'ChatConnections',
                                populate: [
                                    {
                                        path: 'chatID',
                                        model: 'ChatsRooms',
                                    }
                                ]
                            })
                            const payload = {
                                from: sender,
                                bodyNotification: getNotify
                            }
                            await server.io.in(addressee.socketID).emit('notification', payload)                          
                        } else{
                            const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                            const payload = {
                                from: sender,
                                bodyNotification: getNotify
                            }
                            await server.io.in(addressee.socketID).emit('notification', payload)
                        }
                    } else {
                        const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                        const payload = {
                            from: sender,
                            bodyNotification: getNotify
                        }
                        await server.io.in(addressee.socketID).emit('notification', payload)                   
                    }
                }
            }
            return bodyNotify ? rta = {    
                error: null,
                success: true,
                message: 'Notificación enviada'
            } : rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationColorChange(body: any) {
        try {
            let sender, model, getModel, notify, addressee, rta;
            const server = Server.instance;
            if (body.userID != undefined) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.userID)
            }
            notify = {
                addresseeID: addressee.id,
                postId: body.id,
                infoAddressee: addressee,
                notification: 'Notificación por cambio de color',
                whoIsNotified: 'U7'
            }
            model = new ColorChangenotificationModel(notify)
            getModel = ColorChangenotificationModel
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                .populate('postId')
                const payload = {
                    from: 'Platform',
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationRequestCommunities(body: any, flag: Boolean) {
        try {
            let sender, model, getModel, notify, addressee, rta, getCommunity;
            getCommunity = await communitiesServices.getCommunityByIDNotify(body.communityId)
            const server = Server.instance;
            if (flag) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.userId)
                if (getCommunity) {
                    sender = getCommunity.userID
                }
            } else {
                sender = await similarServices.identifyUserBrandOrCommunity(body.userId)
                if (getCommunity) {
                    addressee = getCommunity.userID
                }
            }
            notify = {
                senderID: sender.id,
                addresseeID: addressee.id,
                userRequestCommunityId: body.id,
                infoSender: sender,
                infoAddressee: addressee,
                notification: 'Notificación por solicitud a comunidad',
                whoIsNotified: 'U8'
            }
            model = new CommunityNotificationsModel(notify)
            getModel = CommunityNotificationsModel
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                .populate('userRequestCommunityId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationRequestProfessionalCommunities(body: any, flag: Boolean) {
        try {
            let sender, model, getModel, notify, addressee, rta, getCommunity;
            getCommunity = await professionalCommunitiesServices.getCommunityByIDNotify(body.communityId)
            const server = Server.instance;
            if (flag) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.professionalId)
                if (getCommunity) {
                    sender = getCommunity.professionalId
                }
            } else {
                sender = await similarServices.identifyUserBrandOrCommunity(body.professionalId)
                if (getCommunity) {
                    addressee = getCommunity.professionalId
                }
            }
            notify = {
                senderID: sender.id,
                addresseeID: addressee.id,
                RequestToTheCommunityId: body.id,
                infoSender: sender,
                infoAddressee: addressee,
                notification: 'Notificación por solicitud a comunidad profesional',
                whoIsNotified: 'P8'
            }
            model = new NotificationsProfessionalCommunityModel(notify)
            getModel = NotificationsProfessionalCommunityModel
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id })
                .populate('RequestToTheCommunityId')
                const payload = {
                    from: sender,
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationAssignRoleAnyCommunities(body: any, flag: Boolean) {
        try {
            let sender, model, getModel, notify, addressee, rta, getCommunity;
            const server = Server.instance;
            if (flag) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.assignedUserId)
                getCommunity = await communitiesServices.getCommunityByIDNotify(body.communityId)
                if (getCommunity) {
                    sender = getCommunity.userID
                }
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    communityId: body.communityId,
                    assignedRoleId: body.typeId,
                    infoSender: sender,
                    infoAddressee: addressee,
                    notification: 'Notificación por asignación de rol en la comunidad',
                    whoIsNotified: 'U9'
                }
                model = new RoleAssignNotificationsCommunityModel(notify)
                const bodyNotify = await model.save()
                if (bodyNotify) {
                    const getNotify = await RoleAssignNotificationsCommunityModel.findOne({ _id: bodyNotify.id }).populate('communityId').populate('assignedRoleId')
                    const payload = {
                        from: sender,
                        bodyNotification: getNotify
                    }
                    await server.io.in(addressee.socketID).emit('notification', payload)
                    rta = {
                        error: null,
                        success: true,
                        message: 'Notificación enviada'
                    }
                }
            } else {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.assignedUserId)
                getCommunity = await professionalCommunitiesServices.getCommunityByIDNotify(body.communityId)
                if (getCommunity) {
                    sender = getCommunity.professionalId
                }
                notify = {
                    senderID: sender.id,
                    addresseeID: addressee.id,
                    communityId: body.id,
                    assignedRoleId: body.roleCommunityId,
                    infoSender: sender,
                    infoAddressee: addressee,
                    notification: 'Notificación por asignación de rol en la comunidad',
                    whoIsNotified: 'P9'
                }
                model = new RoleAssignNotificationsProfessionalCommunityModel(notify)
                const bodyNotify = await model.save()
                if (bodyNotify) {
                    const getNotify = await RoleAssignNotificationsProfessionalCommunityModel.findOne({ _id: bodyNotify.id }).populate('communityId').populate('assignedRoleId')
                    const payload = {
                        from: sender,
                        bodyNotification: getNotify
                    }
                    await server.io.in(addressee.socketID).emit('notification', payload)
                    rta = {
                        error: null,
                        success: true,
                        message: 'Notificación enviada'
                    }
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationsAwardsOrBadges(body: any) {
        try {
            let sender, model, getModel, notify, addressee, rta;
            const server = Server.instance;
            if (body.userID != undefined) {
                addressee = await similarServices.identifyUserBrandOrCommunity(body.userID.id)
            }
            notify = {
                addresseeID: addressee.id,
                userBadgeId: body.id,
                userBadge: body,
                infoAddressee: addressee,
                notification: 'Notificaciones de premios o insignias',
                whoIsNotified: 'U10'
            }
            model = new NotificationsAwardsOrBadgesModel(notify)
            getModel = NotificationsAwardsOrBadgesModel
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await getModel.findOne({ _id: bodyNotify.id }).populate('userBadgeId')
                const payload = {
                    from: 'Platform Awards',
                    bodyNotification: getNotify
                }
                await server.io.in(addressee.socketID).emit('notification', payload)
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendPqrsNotificationsAdmin(body: any) {
        try {
            let model, rta;
            const server = Server.instance;
            let sender = body.entityId
            let notify
            const senderNotify = await similarServices.identifyUserBrandOrCommunityMessages(sender)
            const admins = await adminUsersServices.getAdminUsersByCodeOfRole({ code: 'ADM009' })
            if (admins.length > 0) {
                for await (let admin of admins) {
                    notify = {
                        senderID: senderNotify.id,
                        addresseeID: admin.id,
                        pqrsId: body.id,
                        pqrsData: body,
                        typePqrs: body.type,
                        infoSender: senderNotify,
                        infoAddressee: admin,
                        notification: 'Notificaciones pqrs administrador',
                        whoIsNotified: 'A11'
                    }
                    model = new PqrsNotitcationsModel(notify)
                    const bodyNotify = await model.save()
                    if (bodyNotify) {
                        const getNotify = await PqrsNotitcationsModel.findOne({ _id: bodyNotify.id })
                        const payload = {
                            from: senderNotify,
                            bodyNotification: getNotify
                        }
                        await server.io.in(admin.socketID).emit('notification', payload)
                    }
                }
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendPqrsNotificationsAnyUser(body: any) {
        try {
            let model, rta;
            const server = Server.instance;
            let sender, notify
            notify = {
                senderID: body.admin.id,
                addresseeID: body.addressee.id,
                pqrsId: body.pqrs.id,
                pqrsData: body.pqrs,
                typePqrs: body.pqrs.type,
                infoSender: body.admin,
                infoAddressee: body.addressee,
                notification: body.notification,
                whoIsNotified: body.whoIsNotified
            }
            model = new PqrsNotitcationsModel(notify)
            const bodyNotify = await model.save()
            if (bodyNotify) {
                const getNotify = await PqrsNotitcationsModel.findOne({ _id: bodyNotify.id })
                const payload = {
                    from: "Platform",
                    bodyNotification: getNotify
                }
                await server.io.in(body.addressee.socketID).emit('notification', payload)
            }
            rta = {
                error: null,
                success: true,
                message: 'Notificación enviada'
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationRequestPostAnyCommunity(body: any) {
        try {
            let model, getModel, rta;
            const server = Server.instance;
            let sender, notify, addressee
            const getRequest = await postRequestServices.getRequestPostsByID(body.id)
            if (getRequest) {
                if (getRequest.postID != undefined) {
                    sender = getRequest.postingUserID
                    addressee = getRequest.communityID.userID
                    notify = {
                        senderID: getRequest.postingUserID.id,
                        addresseeID: getRequest.communityID.userID.id,
                        postRequestId: getRequest.id,
                        infoSender: getRequest.postingUserID,
                        infoAddressee: getRequest.communityID.userID,
                        notification: 'Notificación por solicitud de la publicación',
                        whoIsNotified: 'AU13'
                    }
                    model = new CommunityPostRequestNotificationsModel(notify)
                    getModel = CommunityPostRequestNotificationsModel
                } else if (getRequest.professionalPostID != undefined) {
                    sender = getRequest.postingProfessionalID
                    addressee = getRequest.professionalCommunityID.professionalId.id
                    notify = {
                        senderID: getRequest.postingProfessionalID.id,
                        addresseeID: getRequest.professionalCommunityID.professionalId.id,
                        postRequestId: getRequest.id,
                        infoSender: getRequest.postingProfessionalID,
                        infoAddressee: getRequest.communityID.professionalId,
                        notification: 'Notificación por solicitud de la publicación',
                        whoIsNotified: 'AP13'
                    }
                    model = new ProfessionalCommunityPostRequestNotificationsModel(notify)
                    getModel = ProfessionalCommunityPostRequestNotificationsModel
                }
                const bodyNotify = await model.save()
                if (bodyNotify) {
                    const getNotify = await getModel.findOne({ _id: bodyNotify.id }).populate('postRequestId')
                    const payload = {
                        from: sender,
                        bodyNotification: getNotify
                    }
                    await server.io.in(addressee.socketID).emit('notification', payload)
                }
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async sendNotificationRequestPostAnyCommunityAdmin(body: any) {
        try {
            let model, getModel, rta;
            const server = Server.instance;
            let sender, notify, addressee
            const getRequest = await postRequestServices.getRequestPostsByID(body.id)
            if (getRequest) {
                if (getRequest.postID != undefined) {
                    sender = getRequest.communityID.userID
                    addressee = getRequest.postingUserID
                    notify = {
                        senderID: getRequest.communityID.userID.id,
                        addresseeID: getRequest.postingUserID.id,
                        postRequestId: getRequest.id,
                        infoSender: getRequest.communityID.userID,
                        infoAddressee: getRequest.postingUserID,
                        notification: 'Notificación por respuesta de la solicitud de publicación',
                        whoIsNotified: 'U13'
                    }
                    model = new CommunityPostRequestNotificationsModel(notify)
                    getModel = CommunityPostRequestNotificationsModel
                } else if (getRequest.professionalPostID != undefined) {
                    sender = getRequest.professionalCommunityID.professionalId
                    addressee = getRequest.postingProfessionalID
                    notify = {
                        senderID: getRequest.professionalCommunityID.professionalId.id,
                        addresseeID: getRequest.postingProfessionalID.id,
                        postRequestId: getRequest.id,
                        infoSender: getRequest.communityID.professionalId,
                        infoAddressee: getRequest.postingProfessionalID,
                        notification: 'Notificación por respuesta de la solicitud de publicación',
                        whoIsNotified: 'P13'
                    }
                    model = new ProfessionalCommunityPostRequestNotificationsModel(notify)
                    getModel = ProfessionalCommunityPostRequestNotificationsModel
                }
                const bodyNotify = await model.save()
                if (bodyNotify) {
                    const getNotify = await getModel.findOne({ _id: bodyNotify.id }).populate('postRequestId')
                    const payload = {
                        from: sender,
                        bodyNotification: getNotify
                    }
                    await server.io.in(addressee.socketID).emit('notification', payload)
                }
                rta = {
                    error: null,
                    success: true,
                    message: 'Notificación enviada'
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }
    //#endregion

    //#region Notifications User(user, mark and admin)
    public async getNotificationsRequestAndOthersUser(body: any) {
        try {
            let notify, orderedNotificactionsRequest:any = [], orderedNotificactionsOthers: any = []
            const getUser = await similarServices.identifyUserBrandOrCommunity(body.entityId)
            if (getUser.type == "professional") {
                const getNotificationsRequest = await this.getNotificationsRequestProfessional(body)
                const getNotificationsOthers = await this.getNotificationsOthersProfessional(body)
                
                if (getNotificationsRequest) {
                    orderedNotificactionsRequest = _.orderBy(getNotificationsRequest, ["creationDate"], ["desc"]);
                }
                if (getNotificationsOthers) {
                    orderedNotificactionsOthers = _.orderBy(getNotificationsOthers, ["creationDate"], ["desc"]);
                }
                notify = {
                    request: orderedNotificactionsRequest,
                    othersNotifications: orderedNotificactionsOthers
                }
            } else {
                const getNotificationsRequest = await this.getNotificationsRequestUser(body)
                const getNotificationsOthers = await this.getNotificationsOthersUser(body)

                if (getNotificationsRequest) {
                    orderedNotificactionsRequest = _.orderBy(getNotificationsRequest, ["creationDate"], ["desc"]);
                }
                if (getNotificationsOthers) {
                    orderedNotificactionsOthers = _.orderBy(getNotificationsOthers, ["creationDate"], ["desc"]);
                }
                notify = {
                    request: orderedNotificactionsRequest,
                    othersNotifications: orderedNotificactionsOthers
                }
            }
            return notify
        } catch (error) {
            console.log(error);
        }
    }

    //#region users

    public async getNotificationsRequestUser(body: any) {
        try {
            let getNotifications, groupNotifications: any = [], groupNotificationsFilter: any = [],
            groupNotificationsFilter1: any = [],groupNotificationsFilter2: any = []
            const getNotificationsRequestsUsers = await NotificationsRequestsUsersModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('socialId')
                .populate({
                    path: 'chatConnectionId',
                    model: 'ChatConnections',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'chatID',
                            model: 'ChatsRooms'
                        }]
                })
                .sort('-creationDate')
            if (getNotificationsRequestsUsers.length > 0) {
                groupNotificationsFilter = getNotificationsRequestsUsers.filter((x:any) =>{
                    if (x.socialId != undefined) {
                        if (x.socialId.areFriends != true){
                            return true
                        }else {
                            return false
                        }
                    } else if (x.chatConnectionId != undefined) {
                        if (x.chatConnectionId.isMember != true && x.chatConnectionId.cancelRequest != true){
                            return true
                        }else {
                            return false
                        }
                    }
                })
                groupNotifications = groupNotificationsFilter
            }
            const getCommunityNotifications = await CommunityNotificationsModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('userRequestCommunityId')
                .sort('-creationDate')
            if (getCommunityNotifications.length > 0) {
                groupNotificationsFilter1 = getCommunityNotifications.filter((x:any) => {
                    if (x.userRequestCommunityId != undefined) {
                        if (x.userRequestCommunityId.isAccepted != true && x.userRequestCommunityId.isDeclined != true) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
                groupNotifications = _.concat(groupNotifications, groupNotificationsFilter1)
            }
            const getCommunityPostRequestNotifications = await CommunityPostRequestNotificationsModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('postRequestId')
                .sort('-creationDate')
            if (getCommunityPostRequestNotifications.length > 0) {
                groupNotificationsFilter2 = getCommunityPostRequestNotifications.filter((x:any) => {
                    if (x.postRequestId != undefined) {
                        if (x.postRequestId.status != 2) {
                            return true
                        } else {
                         return false   
                        }
                    } else {
                        return false
                    }
                })
                groupNotifications = _.concat(groupNotifications, groupNotificationsFilter2)
            }
            if (groupNotifications.length > 0) {
                getNotifications = groupNotifications
            }
            return getNotifications
        } catch (error) {
            console.log(error);
        }
    }

    public async getNotificationsOthersUser(body: any) {
        try {
            let getNotifications, groupNotifications: any = []
            const getNotificationsSocial = await SocialNetworkNotificationsModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .populate({
                    path: 'postId',
                    model: 'Posts',
                    populate: [
                        {
                            path: 'userID',
                            model: 'Users'
                        },
                        {
                            path: 'taggedUsers',
                            model: 'Users'
                        },
                        {
                            path: 'taggedTrademarks',
                            model: 'Trademarks'
                        }
                    ]
                })
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                .sort('-creationDate')
            if (getNotificationsSocial.length > 0) {
                groupNotifications = getNotificationsSocial
            }
            const getNotificationsAuthentication = await NotificationsAuthenticationModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            }).populate('Certificates')
                .sort('-creationDate')
            if (getNotificationsAuthentication.length > 0) {
                groupNotifications = _.concat(groupNotifications, getNotificationsAuthentication)
            }
            const getColorChangenotification = await ColorChangenotificationModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            }).populate('postId')
                .sort('-creationDate')
            if (getColorChangenotification.length > 0) {
                groupNotifications = _.concat(groupNotifications, getColorChangenotification)
            }
            const getNotificationsAwardsOrBadges = await NotificationsAwardsOrBadgesModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
            .populate( {
                path: 'userBadgeId',
                model: 'UsersBadge',
                populate: [
                    {
                        path: 'userID',
                        model: 'Users',
                    },
                    {
                        path: 'awardID',
                        model: 'Award',
                    },
                    {
                        path: 'userChallengeID',
                        model: 'UserChallenges',
                    }
                ]
            })
                .sort('-creationDate')
            if (getNotificationsAwardsOrBadges.length > 0) {
                groupNotifications = _.concat(groupNotifications, getNotificationsAwardsOrBadges)
            }
            const getRoleAssignNotificationsCommunity = await RoleAssignNotificationsCommunityModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .populate('communityId')
                .populate('assignedRoleId')
                .sort('-creationDate')
            if (getRoleAssignNotificationsCommunity.length > 0) {
                groupNotifications = _.concat(groupNotifications, getRoleAssignNotificationsCommunity)
            }
            if (groupNotifications.length > 0) {
                getNotifications = groupNotifications
            }
            return getNotifications
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    //#region professional

    public async getNotificationsRequestProfessional(body: any) {
        try {
            let getNotifications: any = [], groupNotifications: any = [], groupNotificationsFilter: any = [],
            groupNotificationsFilter1: any = [], groupNotificationsFilter2: any = []
            const getNotificationsRequestsProfessionals = await NotificationsRequestsProfessionalsModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('socialProfessionalId')
                .sort('-creationDate')
            if (getNotificationsRequestsProfessionals.length > 0) {
                groupNotificationsFilter = getNotificationsRequestsProfessionals.filter((x:any) => {
                    if ( x.socialProfessionalId != undefined) {
                        if ( x.socialProfessionalId.areContacts != undefined && x.socialProfessionalId.areContacts != true) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
                groupNotifications = groupNotificationsFilter
            }
            const getNotificationsProfessionalCommunity = await NotificationsProfessionalCommunityModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('RequestToTheCommunityId')
                .sort('-creationDate')
            if (getNotificationsProfessionalCommunity.length > 0) {
                groupNotificationsFilter1 = getNotificationsProfessionalCommunity.filter((x:any) => {
                    if ( x.RequestToTheCommunityId != undefined) {
                        if (x.RequestToTheCommunityId.isAccepted != true && x.RequestToTheCommunityId.isDeclined != true){
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
                groupNotifications = _.concat(groupNotifications, groupNotificationsFilter1)
            }
            const getProfessionalCommunityPostRequestNotifications = await ProfessionalCommunityPostRequestNotificationsModel.find({
                $and: [{ addresseeID: body.entityId }, { doYouSeeTheNotification: false }, { isEnabled: true }]
            })
                .populate('postRequestId')
                .sort('-creationDate')
            if (getProfessionalCommunityPostRequestNotifications.length > 0) {
                groupNotificationsFilter2 = getProfessionalCommunityPostRequestNotifications.filter((x:any) => {
                    if ( x.postRequestId != undefined) {
                        if (x.postRequestId.status != 2 && x.postRequestId.status != undefined){
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
                groupNotifications = _.concat(groupNotifications, groupNotificationsFilter2)
            }
            if (groupNotifications.length > 0) {
                getNotifications = groupNotifications
            }            
            return getNotifications
        } catch (error) {
            console.log(error);
        }
    }

    public async getNotificationsOthersProfessional(body: any) {
        try {
            let getNotifications: any = [], groupNotifications: any = []
            const getNotificationsSocial = await ProfessionalNetworkNotificationsModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .populate({
                    path: 'ProfessionalPostsId',
                    model: 'ProfessionalPosts',
                    populate: [
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles'
                        },
                        {
                            path: 'taggedUsers',
                            model: 'ProfessionalProfiles'
                        }
                    ]
                })
                .populate('commentId')
                .populate('replyToCommentId')
                .populate('reactionId')
                .sort('-creationDate')
            if (getNotificationsSocial.length > 0) {
                groupNotifications = getNotificationsSocial
            }
            const getNotificationsAuthentication = await NotificationsAuthenticationModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .populate('Certificates')
                .sort('-creationDate')
            if (getNotificationsAuthentication.length > 0) {
                groupNotifications = _.concat(groupNotifications, getNotificationsAuthentication)
            }
            const RoleAssignNotificationsProfessionalCommunity = await RoleAssignNotificationsProfessionalCommunityModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .populate('communityId')
                .populate('assignedRoleId')
                .sort('-creationDate')
            if (RoleAssignNotificationsProfessionalCommunity.length > 0) {
                groupNotifications = _.concat(groupNotifications, RoleAssignNotificationsProfessionalCommunity)
            }
            if (groupNotifications.length > 0) {
                getNotifications = groupNotifications
            }
            return getNotifications
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    public async getNotificationsPQRS(body: any) {
        try {
            const getPqrsNotitcations = await PqrsNotitcationsModel.find({
                $and: [{ addresseeID: body.entityId }, { isEnabled: true }]
            })
                .sort('-creationDate')
            return getPqrsNotitcations
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion


    //#region functions

    public async deleteNotification(body: any) {
        try {
            let deleteNotification, model
            const getNotification = await this.getAnyNotificationById(body.notificationId)
            if (getNotification) {
                switch (getNotification.type) {
                    case 'socialUser':
                        model = SocialNetworkNotificationsModel
                        break;
                    case 'socialProfessional':
                        model = ProfessionalNetworkNotificationsModel
                        break;
                    case 'autenticationNotify':
                        model = NotificationsAuthenticationModel
                        break;
                    case 'requestProfessional':
                        model = NotificationsRequestsProfessionalsModel
                        break;
                    case 'requestUser':
                        model = NotificationsRequestsUsersModel
                        break;
                    case 'colorChangeNotify':
                        model = ColorChangenotificationModel
                        break;
                    case 'requesCommunitytUser':
                        model = CommunityNotificationsModel
                        break;
                    case 'requestPostCommunity':
                        model = CommunityPostRequestNotificationsModel
                        break;
                    case 'usersBadgeNotify':
                        model = NotificationsAwardsOrBadgesModel
                        break;
                    case 'requesCommunitytPrfessional':
                        model = NotificationsProfessionalCommunityModel
                        break;
                    case 'pqrsNotify':
                        model = PqrsNotitcationsModel
                        break;
                    case 'requestPostProfessionalCommunity':
                        model = ProfessionalCommunityPostRequestNotificationsModel
                        break;
                    case 'rolesCommunitytUser':
                        model = RoleAssignNotificationsCommunityModel
                        break;
                    case 'rolesProfessionalCommunitytUser':
                        model = RoleAssignNotificationsProfessionalCommunityModel
                        break;
                }
                deleteNotification = await model.findOneAndDelete({ _id: getNotification.id })
            }
            return deleteNotification
        } catch (error) {
            console.log(error);
        }
    }

    public async viewNotification(body: any) {
        try {
            let model, viewNotification;
            const getNotification = await this.getAnyNotificationById(body.notificationId)
            if (getNotification) {
                switch (getNotification.type) {
                    case 'socialUser':
                        model = SocialNetworkNotificationsModel
                        break;
                    case 'socialProfessional':
                        model = ProfessionalNetworkNotificationsModel
                        break;
                    case 'autenticationNotify':
                        model = NotificationsAuthenticationModel
                        break;
                    case 'requestProfessional':
                        model = NotificationsRequestsProfessionalsModel
                        break;
                    case 'requestUser':
                        model = NotificationsRequestsUsersModel
                        break;
                    case 'colorChangeNotify':
                        model = ColorChangenotificationModel
                        break;
                    case 'requesCommunitytUser':
                        model = CommunityNotificationsModel
                        break;
                    case 'requestPostCommunity':
                        model = CommunityPostRequestNotificationsModel
                        break;
                    case 'usersBadgeNotify':
                        model = NotificationsAwardsOrBadgesModel
                        break;
                    case 'requesCommunitytPrfessional':
                        model = NotificationsProfessionalCommunityModel
                        break;
                    case 'pqrsNotify':
                        model = PqrsNotitcationsModel
                        break;
                    case 'requestPostProfessionalCommunity':
                        model = ProfessionalCommunityPostRequestNotificationsModel
                        break;
                    case 'rolesCommunitytUser':
                        model = RoleAssignNotificationsCommunityModel
                        break;
                    case 'rolesProfessionalCommunitytUser':
                        model = RoleAssignNotificationsProfessionalCommunityModel
                        break;
                }
                viewNotification = await model.findOneAndUpdate({ _id: getNotification.id }, { doYouSeeTheNotification: true, notificationReviewDate: new Date() }, { new: true })
            }
            return viewNotification
        } catch (error) {
            console.log(error);
        }
    }

    public async disableOrEnablePostNotifications(body: any) {
        try {
            let disableOrEnable
            if (body.postId != undefined) {
                disableOrEnable = await postSevices.disableOrEnablePostNotificationsUser(body.postId, body.enable)
            } else if (body.professionalPostId != undefined) {
                disableOrEnable = await professionalPostServices.disableOrEnablePostNotificationsProfessional(body.professionalPostId, body.enable)
            }
            return disableOrEnable
        } catch (error) {
            console.log(error);
        }
    }

    public async disableOrEnableNotifications(body: any) {
        try {
            const getAbnyuser = await similarServices.disableNotifications(body)
            return getAbnyuser
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteNotificationToCancelRequest(body:String){
        try {
            const deleteNotify = await NotificationsRequestsUsersModel.findOneAndDelete({socialId:body})
            return deleteNotify
        } catch (error) {
            console.log(error);            
        }
    }
    //#endregion


}

export const notificationsServices = new NotificationsServices();
