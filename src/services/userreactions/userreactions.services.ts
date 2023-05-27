import { ConstantsRS } from '../../utils/constants';
import { pointsByPostService } from '../Admin/pointsByPost/pointsByPost.service';
import { similarServices } from '../similarservices/similar.services';
import { userChallengeServices } from '../userchallenges/userchallenges.services';
import { notificationsServices } from '../notifications/notifications.services';
import { colorsServices } from '../colors/colors.service';
import { userRankServices } from '../userranks/userranks.service';
import { brandRankingServices } from '../brandranking/brandranking.service';
import { socialServices } from '../social/social.services';
import { socialProfessionalServices } from '../social/socialprofessional.services';
const userReactionsModel = require('../../models/userreactions/UserReactions.model');
const postModel = require('../../models/post/Posts.model')

class UserReactionsServices {
    public async saveUserReaction(body: any, model: any, contentID: any) {
        try {
            let rta, rtaError, success = false, contentUpdate, likedUser
            let entityID: any, entityField: any
            if (body.userID != undefined) {
                entityID = body.userID
                entityField = "userID"
            } else if (body.trademarkID != undefined) {
                entityID = body.trademarkID
                entityField = "trademarkID"
            } else if (body.professionalProfileID != undefined) {
                entityID = body.professionalProfileID
                entityField = "professionalProfileID"
            }

            let content = await model.findOne({ _id: contentID }).populate('userID').populate('professionalProfileID').populate('trademarkID')
            if (content) {
                if (content.userID != undefined) {
                    likedUser = content.userID.id
                } else if (content.trademarkID) {
                    likedUser = content.trademarkID.id
                }else if (content.professionalProfileID != undefined) {
                    likedUser = content.professionalProfileID.id
                }
                
                const reactionExistence = await similarServices.getReactionExistence(entityID, entityField, contentID)
                if (reactionExistence.length > 0) {
                    if (reactionExistence[0].value == parseInt(body.value) && reactionExistence[0].isEnabled) { // Se anula
                        const updateReaction = await userReactionsModel.findOneAndUpdate({ _id: reactionExistence[0]._id }, { isEnabled: false }, { new: true })
                        if (updateReaction) {
                            contentUpdate = await model.updateOne({ _id: contentID }, { likes: (content.likes - parseInt(body.value)) });
                            if (contentUpdate) {
                                if (contentUpdate && content.type === 'post' && entityID != likedUser) {
                                    if (body.entity.type === "user") { // Usuario
                                        // Restar avance de reto
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                    } else if (body.entity.type === "marks") { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                    }

                                    if (content.userID != undefined) { // Usuario
                                        // Restar avance de reto
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                    } else if (content.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                    }

                                    if (body.userID != undefined) {
                                        if (content.typePost == 4) {
                                            const getPost = await postModel.findById(content.postIDContent)
                                            if (getPost) {
                                                await pointsByPostService.addSubstractPointsToUserIdLike(getPost.id, entityID, "substract")
                                            }
                                        } else {
                                            await pointsByPostService.addSubstractPointsToUserIdLike(contentID, entityID, "substract") //add extra points configured
                                        }
                                    }
                                }

                                success = true
                                rta = updateReaction
                            } else {
                                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                            }
                        } else {
                            rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                        }
                    } else { // Se actualiza
                        const updateReaction = await userReactionsModel.findOneAndUpdate({ _id: reactionExistence[0]._id }, { value: body.value, isEnabled: true }, { new: true })
                        if (updateReaction) {
                            const dataToUpdate = new model(content)
                            if (reactionExistence[0].isEnabled) {
                                dataToUpdate.likes = ((content.likes - reactionExistence[0].value) + parseInt(body.value))
                            } else {
                                dataToUpdate.likes = (content.likes + parseInt(body.value))
                            }
                            contentUpdate = await model.findOneAndUpdate({ _id: contentID }, dataToUpdate, { new: true });
                            if (contentUpdate) {
                                if (reactionExistence[0].isEnabled == false && content.type === 'post' && entityID != likedUser) {
                                    if (body.entity.type === "user") {  // Usuario
                                        // Sumar avance de reto                                    
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                    } else if (body.entity.type === "marks") { // Marca
                                        // Sumar avance de ranking
                                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                                    }

                                    if (content.userID != undefined) { // Usuario
                                        // Sumar avance de reto  
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                    } else if (content.trademarkID != undefined) {  // Marca
                                        // Sumar avance de ranking
                                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                                    }

                                    if (body.userID != undefined) {
                                        if (content.typePost == 4) {
                                            const getPost = await postModel.findById(content.postIDContent)
                                            if (getPost) {
                                                await pointsByPostService.addSubstractPointsToUserIdLike(getPost.id, entityID, "add")
                                            }
                                        } else {
                                            await pointsByPostService.addSubstractPointsToUserIdLike(contentID, entityID, "add") //add extra points configured
                                        }
                                    }
                                }

                                success = true
                                rta = updateReaction
                            } else {
                                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                            }
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    }
                } else {
                    const reactionToSave = new userReactionsModel(body);
                    const reactionSaved = await reactionToSave.save();
                    if (content.disableNotifications != undefined && content.disableNotifications == false) {
                        if (content.userID != undefined) {
                            if (entityID != content.userID.id) {
                                const canInotifyValidate = await socialServices.canINotify({ firstID: entityID, secondID: content.userID.id })
                                if (!canInotifyValidate) {
                                    await notificationsServices.sendNotificationReaction(entityID, content, reactionSaved)
                                }
                            }
                        } else if (content.trademarkID != undefined) {
                            if (entityID != content.trademarkID.id) {
                                const canInotifyValidate = await socialServices.canINotify({ firstID: entityID, secondID: content.trademarkID.id })
                                if (canInotifyValidate == false) {
                                    await notificationsServices.sendNotificationReaction(entityID, content, reactionSaved)
                                }
                            }
                        } else if (content.professionalProfileID != undefined) {
                            if (entityID != content.professionalProfileID.id) {
                                const canInotifyValidate = await socialProfessionalServices.canINotify({ firstID: entityID, secondID: content.trademarkID.id })
                                if (canInotifyValidate == false) {
                                    await notificationsServices.sendNotificationReaction(entityID, content, reactionSaved)
                                }
                            }
                        }
                    }
                    //part to add extra points
                    if (reactionSaved && content.type === 'post' && entityID != likedUser) {
                        if (body.entity.type === "user") { // Usuario
                            // Sumar avance de reto
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                        } else if (body.entity.type === "marks") { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code, entityID, content.id)
                        }

                        if (content.userID != undefined) { // Usuario
                            // Sumar avance de reto
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                        } else if (content.trademarkID != undefined) { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code, likedUser, content.id)
                        }


                        if (content.type === "post" && body.userID != undefined) {
                            if (content.typePost == 4) {
                                const getPost = await postModel.findById(content.postIDContent)
                                if (getPost) {
                                    await pointsByPostService.addSubstractPointsToUserIdLike(getPost.id, entityID, "add")
                                }
                            } else {
                                await pointsByPostService.addSubstractPointsToUserIdLike(contentID, entityID, "add") //add extra points configured
                            }
                        }
                    }

                    // if (reactionSaved && content.type === 'comment' && body.entity.type === "user") { //points comments
                    //     await pointsByPostService.addSubstractPointsToUserIdComment(contentID, body.entityID) //add extra points configured
                    // }

                    if (reactionSaved) {
                        const dataToUpdate = new model(content);
                        dataToUpdate.reactionsIDS.push(reactionSaved._id)
                        dataToUpdate.likes = (content.likes + parseInt(body.value))
                        contentUpdate = await model.findOneAndUpdate({ _id: contentID }, dataToUpdate, { new: true })
                        if (contentUpdate) {
                            success = true
                            rta = reactionSaved
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }

            //#region For color change of reaction
            if (rta) {
                if (rta.postID != undefined) {
                    if (contentUpdate) {
                        await colorsServices.reactionColorChange(contentUpdate)
                    }
                }
            }
            //#endregion

            return {
                error: rtaError ? rtaError : null,
                success: success,
                data: rta ? rta : []
            }
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async getReactions(model: any, entityID: any) {
        let rta, rtaError, success = false, response = {}
        await model.findById({ _id: entityID })
            .populate(
                {
                    path: 'reactionsIDS',
                    model: 'UserReactions',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'userID',
                            model: 'Users',
                            select: 'name score profilePicture'
                        },
                        {
                            path: 'trademarkID',
                            model: 'Trademarks',
                        }
                    ]
                }
            )
            .then((res: any) => {
                rta = res.reactionsIDS
                success = true
            }).catch(() => {
                rtaError = ConstantsRS.FAILED_TO_FETCH_RECORDS
            });

        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        };
    }

    public async getReactionByUserIdAnPostId(userId: string, postId: string) {
        const reaction = userReactionsModel.findOne({ postID: postId, userID: userId });
        if (!reaction) return false;
        return reaction
    }
}

export const userReactionsServices = new UserReactionsServices()