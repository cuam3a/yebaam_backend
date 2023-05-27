import { ConstantsRS } from '../../utils/constants';
import { notificationsServices } from '../../services/notifications/notifications.services';
import { similarServices } from '../similarservices/similar.services';
import { userChallengeServices } from '../userchallenges/userchallenges.services';
import { chatConnectionServices } from '../chats/chatConnection.services';
import { userRankServices } from '../userranks/userranks.service';
import { brandRankingServices } from '../brandranking/brandranking.service';
const socialModel = require('../../models/social/Social.model');
const userModel = require('../../models/user/Users.model');
const notificationModel = require('../../models/notifications/NotificationsRequestsUsers.model');

class SocialServices {
    public async getSocialConnectionByIDSWithOutRes(req: any) {
        try {
            const SocialConnection = await socialModel.findOne(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.firstID },
                                { secondID: req.secondID },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { firstID: req.secondID },
                                { secondID: req.firstID },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )

            return SocialConnection
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async sendFriendRequest(obj: any) {
        try {
            let socialSave, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)

            const firstEntity = await similarServices.identifyUserBrandOrCommunity(obj.firstID)
            const secondEntity = await similarServices.identifyUserBrandOrCommunity(obj.secondID)

            if (socialConnection) {
                if (socialConnection.sendRequestFirst || socialConnection.sendRequestSecond) {
                    if (socialConnection.requestStatus) {
                        error = ConstantsRS.YOUR_APPLICATION_HAS_ALREADY_BEEN_ACCEPTED
                    } else {
                        error = ConstantsRS.I_ALREADY_SEND_REQUEST
                    }
                } else {
                    if (obj.firstID == socialConnection.firstID) {
                        const socialToSave = new socialModel(socialConnection)
                        socialToSave.sendRequestFirst = true
                        socialToSave.isFollowerFirst = true
                        socialToSave.cancelRequest = false
                        socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                        const notificationSend = {
                            senderID: socialConnection.firstID,
                            addresseeID: socialConnection.secondID,
                            socialId: socialConnection.id,
                            notification: 'Notificaciones por solicitud de amistad',
                            whoIsNotified: 'U14'
                        }
                        await notificationsServices.generateNotification(notificationSend)

                        if (!firstEntity.code && !secondEntity.code) {
                            if (firstEntity.type == "user") {
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, obj.firstID, obj.secondID)
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, obj.firstID, obj.secondID)
                            }

                            if (secondEntity.type == "user") {
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.secondID, obj.firstID)
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.secondID, obj.firstID)
                            }
                        }
                    } else {
                        const socialToSave = new socialModel(socialConnection)
                        socialToSave.sendRequestSecond = true
                        socialToSave.isFollowerSecond = true
                        socialToSave.cancelRequest = false
                        socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                        const notificationSend = {
                            senderID: socialConnection.secondID,
                            addresseeID: socialConnection.firstID,
                            socialId: socialConnection.id,
                            notification: 'Notificaciones por solicitud de amistad',
                            whoIsNotified: 'U14'
                        }
                        await notificationsServices.generateNotification(notificationSend)

                        if (!firstEntity.code && !secondEntity.code) {
                            if (firstEntity.type == "user") {
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.firstID, obj.secondID)
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.firstID, obj.secondID)
                            }

                            if (secondEntity.type == "user") {
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code,obj.secondID, obj.firstID)
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, obj.secondID, obj.firstID)
                            }
                        }
                    }

                    if (socialSave.nModified == 1) {
                        message = "Solicitud de amistad enviada correctamente"
                        social = await socialModel.findById({ _id: socialConnection.id })
                    } else {
                        error = ConstantsRS.FAILED_ACTION
                    }
                }
            } else {
                const socialToSave = new socialModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.sendRequestFirst = true
                socialToSave.isFollowerFirst = true
                socialSave = await socialToSave.save()
                const notificationSend = {
                    senderID: obj.firstID,
                    addresseeID: obj.secondID,
                    socialId: socialSave.id,
                    notification: 'Notificaciones por solicitud de amistad',
                    whoIsNotified: 'U14'
                }
                await notificationsServices.generateNotification(notificationSend)

                if (socialSave) {
                    if (!firstEntity.code && !secondEntity.code) {
                        if (firstEntity.type == "user") {
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, obj.firstID, obj.secondID)
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, obj.firstID, obj.secondID)
                        }

                        if (secondEntity.type == "user") {
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.secondID, obj.firstID)
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.secondID, obj.firstID)
                        }
                    }

                    message = "Solicitud de amistad enviada correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async followFriend(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null

            const firstEntity = await similarServices.identifyUserBrandOrCommunity(obj.firstID)
            const secondEntity = await similarServices.identifyUserBrandOrCommunity(obj.secondID)

            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)

            if (!firstEntity.code && !secondEntity.code) {
                if (socialConnection) {
                    if (obj.firstID == socialConnection.firstID) {
                        const socialToUpdate = new socialModel(socialConnection)
                        socialToUpdate.isFollowerFirst = true
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToUpdate, { new: true })
                    } else {
                        const socialToUpdate = new socialModel(socialConnection)
                        socialToUpdate.isFollowerSecond = true
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToUpdate, { new: true })
                    }

                    if (socialSave) {
                        message = "Ahora sigues esta cuenta"
                        social = socialSave

                        if (obj.firstID == socialConnection.firstID) {
                            if (firstEntity.type == "user") { // Usuario
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                            } else if (firstEntity.type == "marks") { // Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                            }

                            if (secondEntity.type == "user") {// Usuario
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            } else if (secondEntity.type == "marks") { // Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            }
                        } else {
                            if (secondEntity.type == "user") {// Usuario
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                            } else if (secondEntity.type == "marks") {// Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                            }

                            if (firstEntity.type == "user") {// Usuario
                                // Sumar avance de retos
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                            } else if (firstEntity.type == "marks") {// Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                            }
                        }
                    } else {
                        error = ConstantsRS.FAILED_ACTION
                    }
                } else {
                    const socialToSave = new socialModel()
                    socialToSave.firstID = obj.firstID
                    socialToSave.secondID = obj.secondID
                    socialToSave.isFollowerFirst = true
                    socialSave = await socialToSave.save()

                    if (socialSave) {
                        message = "Ahora sigues esta cuenta"
                        social = socialSave

                        if (firstEntity.type == "user") { // Usuario
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                        } else if (firstEntity.type == "marks") { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                        }

                        if (secondEntity.type == "user") {// Usuario
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                        } else if (secondEntity.type == "marks") { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                        }
                    } else {
                        error = ConstantsRS.FAILED_ACTION
                    }
                }
            } else {
                error = ConstantsRS.NO_RECORDS
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async stopFollowing(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.isFollowerFirst = false
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                } else {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.isFollowerSecond = false
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                }

                if (socialSave) {
                    message = "Dejaste de seguir esta cuenta"
                    social = socialSave

                    const firstEntity = await similarServices.identifyUserBrandOrCommunity(social.firstID)
                    const secondEntity = await similarServices.identifyUserBrandOrCommunity(social.secondID)
                    if (!firstEntity.code && !secondEntity.code) {
                        if (obj.firstID == socialConnection.firstID) {
                            if (firstEntity.type == "user") { //Usuario
                                // Restar avance de retos
                                await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                                // Restar avance de ranking
                                await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                            } else if (firstEntity.type == "marks") { //Marca
                                // Restar avance de ranking
                                await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.firstID, social.secondID)
                            }

                            if (secondEntity.type == "user") {//Usuario
                                // Restar avance de retos
                                await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                                // Restar avance de ranking
                                await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            } else if (secondEntity.type == "marks") {//Marca
                                // Restar avance de ranking
                                await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            }
                        } else {
                            if (secondEntity.type == "user") {//Usuario
                                // Restar avance de retos
                                await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                                // Restar avance de ranking
                                await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                            } else if (secondEntity.type == "marks") {//Marca
                                // Restar avance de ranking
                                await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code, social.secondID, social.firstID)
                            }

                            if (firstEntity.type == "user") {//Usuario
                                // Restar avance de retos
                                await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                                // Restar avance de ranking
                                await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                            } else if (firstEntity.type == "marks") {//Marca
                                // Restar avance de ranking
                                await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                            }
                        }
                    }
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.NO_FOLLOWING_USERS
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async acceptRequest(obj: any) {
        try {

            let socialSave, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.areFriends = true
                    socialToSave.isFollowerFirst = true
                    socialToSave.requestStatus = true
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    const notificationSend = {
                        senderID: socialConnection.secondID,
                        addresseeID: socialConnection.firstID,
                        socialId: socialConnection.id,
                        notification: 'Notificaciones por solicitud de amistad',
                        whoIsNotified: 'U15'
                    }
                    await notificationsServices.generateNotification(notificationSend)
                } else {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.areFriends = true
                    socialToSave.isFollowerSecond = true
                    socialToSave.requestStatus = true
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    const notificationSend = {
                        senderID: socialConnection.secondID,
                        addresseeID: socialConnection.firstID,
                        socialId: socialConnection.id,
                        notification: 'Notificaciones por solicitud de amistad',
                        whoIsNotified: 'U15'
                    }
                    await notificationsServices.generateNotification(notificationSend)
                }

                if (socialSave) {
                    message = "Solicitud de amistad aceptada correctamente"
                    social = socialSave

                    const firstEntity = await similarServices.identifyUserBrandOrCommunity(social.firstID)
                    const secondEntity = await similarServices.identifyUserBrandOrCommunity(social.secondID)
                    if (!firstEntity.code && !secondEntity.code) {
                        if (firstEntity.type == "user") {
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, social.firstID, social.secondID)
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.firstID, social.secondID)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, social.firstID, social.secondID)
                        }

                        if (secondEntity.type == "user") {
                            // Sumar avance de retos
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, social.secondID, social.firstID)
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, social.secondID, social.firstID)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, social.secondID, social.firstID)
                        }
                    }
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async cancelRequest(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = true
                    socialToSave.isFollowerFirst = true
                    await notificationsServices.deleteNotificationToCancelRequest(socialConnection.id)
                    socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                } else {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = true
                    socialToSave.isFollowerSecond = true
                    await notificationsServices.deleteNotificationToCancelRequest(socialConnection.id)
                    socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                }

                if (socialSave.nModified == 1) {
                    message = "Solicitud de amistad cancelada correctamente"
                    social = await socialModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async removeFriend(obj: any) {
        try {
            let socialSave, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.areFriends = false
                    socialToSave.isFollowerFirst = false
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = false
                    socialToSave.requestStatus = false
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                } else {
                    const socialToSave = new socialModel(socialConnection)
                    socialToSave.areFriends = false
                    socialToSave.isFollowerSecond = false
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = false
                    socialToSave.requestStatus = false
                    socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                }

                if (socialSave) {
                    message = "Amigo eliminado correctamente"
                    social = socialSave

                    const firstEntity = await similarServices.identifyUserBrandOrCommunity(obj.firstID)
                    if (!firstEntity.code) {
                        if (firstEntity.type == "user") {
                            // Restar avance de retos
                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, obj.firstID, obj.secondID)
                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.firstID, obj.secondID)
                            // Restar avance de ranking
                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, obj.firstID, obj.secondID)
                        }
                    }

                    const secondEntity = await similarServices.identifyUserBrandOrCommunity(obj.secondID)
                    if (!secondEntity.code) {
                        if (secondEntity.type == "user") {
                            // Restar avance de retos
                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, obj.secondID, obj.firstID)
                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code, obj.secondID, obj.firstID)
                            // Restar avance de ranking
                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code, obj.secondID, obj.firstID)
                        }
                    }
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async blockFriend(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                const socialToSave = new socialModel(socialConnection)
                if (obj.firstID == socialConnection.firstID) {
                    socialToSave.isBlockerFirst = true
                } else {
                    socialToSave.isBlockerSecond = true
                }
                socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })

                if (socialSave.nModified == 1) {
                    message = "Usuario bloqueado correctamente"
                    social = await socialModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                const socialToSave = new socialModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.isBlockerFirst = true
                socialSave = await socialToSave.save()

                if (socialSave) {
                    message = "Usuario bloqueado correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async unblockFriend(obj: any) {
        try {

            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                const socialToSave = new socialModel(socialConnection)
                if (obj.firstID == socialConnection.firstID) {
                    socialToSave.isBlockerFirst = false
                } else {
                    socialToSave.isBlockerSecond = false
                }
                socialSave = await socialModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })

                if (socialSave.nModified == 1) {
                    message = "Usuario desbloqueado correctamente"
                    social = await socialModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                const socialToSave = new socialModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.isBlockerFirst = true
                socialSave = await socialToSave.save()

                if (socialSave) {
                    message = "Usuario desbloqueado correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    /* public async getSocialConnectionsByID(req: any) {
        try {
            const SocialConnections = await socialModel.find(
                {
                    $or: [
                        { $or: [{ firstID: req.idUser }, { secondID: req.idUser }] }
                    ]
                }
            )
            return SocialConnections
        } catch (error) {
            console.log(error);
            return []
        }
    } */

    public async getSocialFriends(req: any) {
        try {
            const socialFriends = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { areFriends: true },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { areFriends: true },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            return socialFriends
        } catch (error) {
            console.log(error);
            return []
        }
    }

    /* public async getSocialFriendsForPosts(entityID: string) {
        try {
            let socialFriends
            if (entityID.match(/^[0-9a-fA-F]{24}$/)) {
                socialFriends = await socialModel.find({ 
                    firstID: entityID 
                })
              }
           
            return socialFriends
        } catch (error) {
            console.log(error);
            return []
        }
    } */
    public async getSocialFriendsForPosts(id: string) {
        try {
            const socialFriends = await socialModel.find(
                {
                    $or: [
                        {
                            //Friendship connections
                            $and: [
                                { firstID: id },
                                { areFriends: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }, {
                            //Follower connections
                            $and: [
                                { firstID: id },
                                { isFollowerFirst: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            //Friendship connections
                            $and: [
                                { secondID: id },
                                { areFriends: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            //Follower connections
                            $and: [
                                { secondID: id },
                                { isFollowerSecond: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }

                    ]
                }
            )
            return socialFriends
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getSocialFollowed(req: any) {
        try {
            const socialFollowed = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { isFollowerFirst: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { isFollowerSecond: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            return socialFollowed
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getSocialFollowers(req: any) {
        try {
            const socialFollowers = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { isFollowerSecond: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { isFollowerFirst: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            return socialFollowers
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getSocialBlocked(req: any) {
        try {
            const socialBlocked = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { isBlockerFirst: true },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { isBlockerSecond: true },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            return socialBlocked
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async separateUsers(socialConnections: any, idUser: any) {
        let usersIDS: any = []
        socialConnections.filter((obj: any) => {
            if (obj.firstID == idUser) {
                usersIDS.push({ userID: obj.secondID, socialData: obj })
            } else if (obj.secondID == idUser) {
                usersIDS.push({ userID: obj.firstID, socialData: obj })
            }
        })
        return usersIDS
    }

    public async separateUsersPostsHome(socialConnections: any, id: string) {
        let iDS: any = []
        socialConnections.filter((obj: any) => {
            if (obj.firstID == id) {
                iDS.push(obj.secondID)
            } else if (obj.secondID == id) {
                iDS.push(obj.firstID)
            }
        })
        return iDS
    }

    public async obtainSocialData(socialUsers: any) {
        let obj: any = {}
        for await (let item of socialUsers) {
            let entityData = await similarServices.identifyUserBrandOrCommunity(item.userID)
            if (entityData) {
                if (!entityData.code) {
                    let key = item.userID
                    obj[key] = { user: entityData, social: item.socialData }
                }
            }
        }
        return obj
    }

    public async obtainApplicantsData(socialUsers: any) {
        let obj: any = {}
        for await (let item of socialUsers) {
            let entityData = await similarServices.identifyUserBrandOrCommunity(item.userID)
            if (entityData) {
                if (!entityData.code) {
                    let key = item.userID
                    obj[key] = { _id: entityData._id, name: entityData.name, profilePicture: entityData.profilePicture }
                }
            }
        }
        return obj
    }

    public async getSocialConnections(req: any) {
        try {
            let rta, rtaError, success = false, objSorted: any = {}
            switch (req.type) {
                case 1: // Amigos
                    const socialFriends = await this.getSocialFriends(req)
                    if (socialFriends.length > 0) {
                        rta = await this.separateUsers(socialFriends, req.idUser)
                        success = true
                        rta = await this.obtainSocialData(rta);
                        if (Object.keys(rta).length === 0) {
                            rtaError = ConstantsRS.NO_FRIENDS_FOUND
                        }
                    } else {
                        rtaError = ConstantsRS.NO_FRIENDS_FOUND
                    }
                    break;
                case 2: // Seguidos
                    const socialFollowed = await this.getSocialFollowed(req)
                    if (socialFollowed.length > 0) {
                        rta = await this.separateUsers(socialFollowed, req.idUser)
                        success = true
                        rta = await this.obtainSocialData(rta);
                        if (Object.keys(rta).length === 0) {
                            rtaError = ConstantsRS.NO_FOLLOWED_FOUND
                        }
                    } else {
                        rtaError = ConstantsRS.NO_FOLLOWED_FOUND
                    }
                    break;
                case 3: // Seguidores
                    const socialFollowers = await this.getSocialFollowers(req)
                    if (socialFollowers.length > 0) {
                        rta = await this.separateUsers(socialFollowers, req.idUser)
                        success = true
                        rta = await this.obtainSocialData(rta);
                        if (Object.keys(rta).length === 0) {
                            rtaError = ConstantsRS.NO_FOLLOWERS_FOUND
                        }
                    } else {
                        rtaError = ConstantsRS.NO_FOLLOWERS_FOUND
                    }
                    break;
                case 4: // Bloqueados
                    const socialBlocked = await this.getSocialBlocked(req)
                    if (socialBlocked.length > 0) {
                        rta = await this.separateUsers(socialBlocked, req.idUser)
                        success = true
                        rta = await this.obtainSocialData(rta);
                        if (Object.keys(rta).length === 0) {
                            rtaError = ConstantsRS.NO_BLOCKED_FOUND
                        }
                    } else {
                        rtaError = ConstantsRS.NO_BLOCKED_FOUND
                    }
                    break;
            }

            // Ordenamiento alfabético
            if (rta) {
                let entries = Object.entries(rta);
                entries.sort(function (o1: any, o2: any) {
                    if (o1[1].user.name > o2[1].user.name) { //comparación lexicogŕafica
                        return 1;
                    } else if (o1[1].user.name < o2[1].user.name) {
                        return -1;
                    }
                    return 0;
                });

                entries.forEach(function (item: any) {
                    objSorted[item[0]] = item[1]
                })
            }

            return {
                error: null,
                success: objSorted ? true : false,
                data: objSorted ? objSorted : []
            }
        } catch (error) {
            return {
                error: ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: false,
                data: []
            }
        }
    }

    public async getFriendRequestsByID(req: any) {
        try {
            const friendRequests = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { sendRequestSecond: true },
                                { requestStatus: false },
                                { cancelRequest: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { sendRequestFirst: true },
                                { requestStatus: false },
                                { cancelRequest: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            return friendRequests
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async separateApplicants(friendRequests: any, idUser: any) {
        let usersIDS: any = []
        friendRequests.filter((obj: any) => {
            if (obj.firstID == idUser) {
                usersIDS.push({ userID: obj.secondID })
            } else if (obj.secondID == idUser) {
                usersIDS.push({ userID: obj.firstID })
            }
        })
        return usersIDS
    }

    public async getFriendRequests(req: any) {
        const friendRequests = await this.getFriendRequestsByID(req)
        let rta, rtaError, success = false, response = {}
        if (friendRequests) {
            rta = await this.separateApplicants(friendRequests, req.idUser)
            success = true
            rta = await this.obtainApplicantsData(rta);
            if (Object.keys(rta).length === 0) {
                rtaError = ConstantsRS.NO_FRIEND_REQUEST
            }
        } else {
            success = true
            rtaError = ConstantsRS.NO_FRIEND_REQUEST
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        }
    }

    public async getCountFriends(req: any) {
        try {
            const countFriends = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.id },
                                { areFriends: true },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.id },
                                { areFriends: true },
                                { isBlockerFirst: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            if (countFriends.length > 0) {
                const countFriendsFine = this.count(countFriends, req.id)
                return countFriendsFine
            } else {
                return 0
            }
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getCountFollowed(req: any) {
        try {
            const countFriends = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.id },
                                { isFollowerFirst: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.id },
                                { isFollowerSecond: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            if (countFriends.length > 0) {
                const countFriendsFine = this.count(countFriends, req.id)
                return countFriendsFine
            } else {
                return 0
            }
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getCountFollowers(req: any) {
        try {
            const countFriends = await socialModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.id },
                                { isFollowerSecond: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.id },
                                { isFollowerFirst: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }
                    ]
                }
            )
            if (countFriends.length > 0) {
                const countFriendsFine = this.count(countFriends, req.id)
                return countFriendsFine
            } else {
                return 0
            }
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getSocialConnectionsCount(req: any) {
        let rta, success = false
        const countFriends = await this.getCountFriends(req)
        const countFollowed = await this.getCountFollowed(req)
        const countFollowers = await this.getCountFollowers(req)
        success = true;

        rta = {
            "countFriends": countFriends,
            "countFollowed": countFollowed,
            "countFollowers": countFollowers
        }

        return rta
    }

    public async count(countFriends: any, id: string) {
        let cont = 0
        const ids = await this.separateUsersPostsHome(countFriends, id)
        for await (let user of ids) {
            const userIsEnabled = await similarServices.identifyUserBrandOrCommunity(user)
            if (userIsEnabled) {
                cont += 1;
            }
        }
        return cont
    }

    public async searchFrendsOrFollowers(bodySearch: any) {

        let results: any = [], ids: any = [], entityId: any, followersOrFriends

        const entity = await similarServices.identifyUserBrandOrCommunity(bodySearch.entityId)

        if (entity) {
            switch (entity.type) {
                case 'user':
                    entityId = entity.id
                    if (bodySearch.followers != undefined && bodySearch.followers == true) {
                        followersOrFriends = await this.getSocialFollowers({ idUser: bodySearch.entityId })
                    } else if (bodySearch.followed != undefined && bodySearch.followed == true) {
                        followersOrFriends = await this.getSocialFollowed({ idUser: bodySearch.entityId })
                    } else {
                        followersOrFriends = await this.getSocialFriends({ idUser: bodySearch.entityId })
                    }
                    break;
                case 'marks':
                    entityId = entity.id
                    followersOrFriends = await this.getSocialFollowers({ idUser: bodySearch.entityId })
                    break;
            }
            if (bodySearch.chatRoomId != undefined && entity.type != 'marks') {
                if (followersOrFriends.length > 0) {
                    followersOrFriends.filter((obj: any) => {
                        if (obj.firstID == entityId) {
                            ids.push(obj.secondID)
                        } else if (obj.secondID == entityId) {
                            ids.push(obj.firstID)
                        }
                    })

                    for await (let id of ids) {
                        const getData = await similarServices.identifyUserOrBrandSearch(id, bodySearch.search)
                        if (getData) {
                            const getDataChatBelong = await chatConnectionServices.getConnectionByRoomaAndUserSearch(bodySearch.chatRoomId, id)
                            if (getDataChatBelong) {
                                if (getDataChatBelong.isMember == true) {
                                    results.push({ user: getData, isMember: 'member' })
                                } else {
                                    if (getDataChatBelong.cancelRequest == true) {
                                        results.push({ user: getData, isMember: 'non member' })
                                    } else {
                                        results.push({ user: getData, isMember: 'pending' })
                                    }
                                }
                            } else {
                                results.push({ user: getData, isMember: 'non member' })
                            }
                        }
                    }
                }
            } else {
                if (followersOrFriends.length > 0) {
                    followersOrFriends.filter((obj: any) => {
                        if (obj.firstID == entityId) {
                            ids.push(obj.secondID)
                        } else if (obj.secondID == entityId) {
                            ids.push(obj.firstID)
                        }
                    })

                    for await (let id of ids) {
                        const getData = await similarServices.identifyUserOrBrandSearch(id, bodySearch.search)
                        if (getData) {
                            results.push(getData)
                        }
                    }
                }
            }
        }

        return results
    }

    public async getSocialConnectionByIDS(firstID: any, secondID: any) {

        let res, resError;
        const SocialConnection = await socialModel.findOne(
            {
                $or: [
                    {
                        $and: [
                            { firstID: firstID },
                            { secondID: secondID },
                            { isEnabled: true }
                        ]
                    },
                    {
                        $and: [
                            { firstID: secondID },
                            { secondID: firstID },
                            { isEnabled: true }
                        ]
                    }
                ]
            }
        );

        if (SocialConnection) {
            res = SocialConnection;
        } else {
            resError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        return res ? res : resError;
    }

    public async getSocialConnectionsByEntityID(entityID: any) {
        let res, resError;

        const socialConnections = await socialModel.find(
            {
                $or: [
                    { firstID: entityID },
                    { secondID: entityID }
                ]
            }
        );

        if (socialConnections) {
            res = socialConnections;
        } else {
            resError = ConstantsRS.NO_RECORDS;
        }

        return res ? res : resError;
    }

    public async disableSocialConnections(socialConnections: any) {
        socialConnections.forEach(async (social: any) => {
            await socialModel.findOneAndUpdate({ _id: social.id }, { isEnabled: false }, { new: true })
        });
    }

    public async enableSocialConnections(socialConnections: any) {
        socialConnections.forEach(async (social: any) => {
            await socialModel.findOneAndUpdate({ _id: social.id }, { isEnabled: true }, { new: true })
        });
    }

    public async canINotify(body: any) {
        try {
            let rta = false
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    rta = socialConnection.disableNotificationsSecond
                } else {
                    rta = socialConnection.disableNotificationsFirst
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async getUserNotificationsOptions(body: any) {
        try {
            let rta = false
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    rta = socialConnection.disableNotificationsFirst
                } else {
                    rta = socialConnection.disableNotificationsSecond
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async disableNotificationsUser(body: any) {
        try {
            let socialSave
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    if (socialConnection.disableNotificationsFirst != undefined &&
                        socialConnection.disableNotificationsSecond != undefined) {
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, { disableNotificationsFirst: body.enableOrDisable }, { new: true })
                    } else {
                        const socialToSave = new socialModel(socialConnection)
                        socialToSave.disableNotificationsFirst = body.enableOrDisable
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    }
                } else {
                    if (socialConnection.disableNotificationsFirst != undefined &&
                        socialConnection.disableNotificationsSecond != undefined) {
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, { disableNotificationsSecond: body.enableOrDisable }, { new: true })
                    } else {
                        const socialToSave = new socialModel(socialConnection)
                        socialToSave.disableNotificationsSecond = body.enableOrDisable
                        socialSave = await socialModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    }
                }
            }
            return socialSave
        } catch (error) {
            console.log(error);
        }
    }
}

export const socialServices = new SocialServices();