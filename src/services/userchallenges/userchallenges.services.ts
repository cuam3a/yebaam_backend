import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
import { awardServices } from '../Admin/awards/awards.service';
import { userBadgeServices } from '../userbadges/userbadges.service';
const userChallengeModel = require('../../models/userchallenges/UserChallenges.model');
const challengeModel = require('../../models/challenges/Challenges.model');
const userBadgeModel = require('../../models/userbadge/UsersBadge.model');

class UserChallengeServices {
    public async saveUserChallenge(actionCode: string, userID: string, paramID: string) {
        let rta, rtaError, challengesUpdatedOrCreated = new Array(), typeParam
        const challenges = await challengeModel.find({
            $and: [{ actionCode: actionCode }, { isEnabled: true }],
        })

        if (challenges.length > 0) { // Si hay retos vigentes con la acción
            switch (actionCode) {
                case ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code:
                case ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code:
                case ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code:
                    typeParam = "Entities"
                    break;
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code:
                case ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code:
                case ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code:
                    typeParam = "Posts"
                    break;
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code:
                    typeParam = "Stories"
                    break;
                case ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code:
                    typeParam = "Comments"
                    break;
            }

            for (let i = 0; i < challenges.length; i++) {
                const challenge = challenges[i];

                const userChallengeAdvance = await userChallengeModel.find({ // Búsqueda de avances (no completados) por usuario con cada reto
                    $and: [{ userID: userID }, { challengeID: challenge._id }],
                }).populate('challengeID')
                    .populate('awardID')

                if (userChallengeAdvance.length > 0) { // Tiene retos sin completar
                    for (let j = 0; j < userChallengeAdvance.length; j++) {
                        const userChallenge = userChallengeAdvance[j]

                        if (userChallenge.completed == false) {
                            let proxAdvance = userChallenge.advance + 1

                            let userChallengeToUpdate = new userChallengeModel(userChallenge)
                            userChallengeToUpdate.advance = proxAdvance

                            if (proxAdvance >= userChallenge.challengeID.quantity) { // Si completa la cantidad en reto
                                userChallengeToUpdate.completed = true
                                userChallengeToUpdate.endDate = moment()

                                const userChallengesCompleted = await userChallengeModel.find({
                                    $and: [{ userID: userID }, { awardID: userChallenge.awardID }, { completed: true }],
                                }).countDocuments()

                                if (userChallenge.awardID.challengeIDS.length == (userChallengesCompleted + 1)) { // Si completó la cantidad de retos para el premio
                                    const dataUserBadge = {
                                        userID: userID,
                                        awardID: userChallenge.awardID,
                                        userChallengeID: userChallenge.id
                                    }
                                    await userBadgeServices.saveUserBadge(dataUserBadge)
                                }
                            }

                            switch (typeParam) {
                                case "Entities":
                                    userChallengeToUpdate.relatedEntitiesIDS.push(paramID)
                                    break;
                                case "Posts":
                                    userChallengeToUpdate.relatedPostIDS.push(paramID)
                                    break;
                                case "Stories":
                                    userChallengeToUpdate.relatedStoryIDS.push(paramID)
                                    break;
                                case "Comments":
                                    userChallengeToUpdate.relatedCommentIDS.push(paramID)
                                    break;
                            }

                            const userChallengeUpdated = await userChallengeModel.updateOne({ _id: userChallenge._id }, userChallengeToUpdate)

                            challengesUpdatedOrCreated.push(userChallengeUpdated)
                        }
                    }
                } else {
                    const awards = await awardServices.getAllByChallenge(challenge.id)

                    if (!awards.code) {
                        if (awards.length > 0) {
                            for (let k = 0; k < awards.length; k++) {
                                const userBadgeUnlocked = await userBadgeModel.find({ // Búsqueda de premio ya desbloqueado por el usuario
                                    $and: [{ userID: userID }, { awardID: awards[k].id }],
                                })

                                if (userBadgeUnlocked.length == 0) { // Si aún no se ha ganado el premio
                                    let userChallengeToSave = new userChallengeModel()
                                    userChallengeToSave.userID = userID
                                    userChallengeToSave.challengeID = challenge.id
                                    userChallengeToSave.awardID = awards[k].id
                                    userChallengeToSave.actionCode = actionCode
                                    userChallengeToSave.advance = 1

                                    switch (typeParam) {
                                        case "Entities":
                                            userChallengeToSave.relatedEntitiesIDS.push(paramID)
                                            break;
                                        case "Posts":
                                            userChallengeToSave.relatedPostIDS.push(paramID)
                                            break;
                                        case "Stories":
                                            userChallengeToSave.relatedStoryIDS.push(paramID)
                                            break;
                                        case "Comments":
                                            userChallengeToSave.relatedCommentIDS.push(paramID)
                                            break;
                                    }

                                    const userChallengeSaved = await userChallengeToSave.save();

                                    challengesUpdatedOrCreated.push(userChallengeSaved)
                                }
                            }
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                }
            }

            if (challengesUpdatedOrCreated.length > 0) {
                rta = challengesUpdatedOrCreated
            } else {
                rtaError = ConstantsRS.THERE_ARENT_CHALLENGES
            }
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async cancelAdvanceUserChallenge(actionCode: String, userID: any, paramID: string) {
        let rta, rtaError, typeParam
        const challenges = await challengeModel.find({
            $and: [{ actionCode: actionCode }, { isEnabled: true }],
        })

        if (challenges.length > 0) { // Si hay retos vigentes con la acción
            switch (actionCode) {
                case ConstantsRS.SYSTEM_ACTION_ADD_FRIEND.code:
                case ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code:
                case ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code:
                    typeParam = "Entities"
                    break;
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code:
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code:
                case ConstantsRS.SYSTEM_ACTION_LIKE_TO_POST.code:
                case ConstantsRS.SYSTEM_ACTION_RECEIVE_LIKE_TO_POST.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code:
                case ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code:
                    typeParam = "Posts"
                    break;
                case ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code:
                    typeParam = "Stories"
                    break;
                case ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code:
                    typeParam = "Comments"
                    break;
            }

            for (let i = 0; i < challenges.length; i++) {
                const challenge = challenges[i];

                const userChallengeAdvance = await userChallengeModel.find({ // Búsqueda de avances (no completados) por usuario con cada reto
                    $and: [{ userID: userID }, { challengeID: challenge._id }, { completed: false }],
                }).populate('challengeID')
                    .populate('awardID')

                if (userChallengeAdvance.length > 0) { // Tiene retos sin completar
                    for (let j = 0; j < userChallengeAdvance.length; j++) {
                        const userChallenge = userChallengeAdvance[j]
                        let foundParameter = false

                        switch (typeParam) {
                            case "Entities":
                                userChallenge.relatedEntitiesIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                            case "Posts":
                                userChallenge.relatedPostIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                            case "Stories":
                                userChallenge.relatedStoryIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                            case "Comments":
                                userChallenge.relatedCommentIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                        }

                        if (foundParameter) {
                            if (userChallenge.advance == 1) {
                                await userChallengeModel.deleteOne({ _id: userChallenge.id })
                            } else {
                                let userChallengeUpdated
                                let prevAdvance = userChallenge.advance - 1

                                switch (typeParam) {
                                    case "Entities":
                                        userChallengeUpdated = await userChallengeModel.findOneAndUpdate(
                                            { _id: userChallenge.id },
                                            [
                                                {
                                                    $set: {
                                                        relatedEntitiesIDS: {
                                                            $let: {
                                                                vars: { ix: { $indexOfArray: ["$relatedEntitiesIDS", paramID] } },
                                                                in: {
                                                                    $cond: {
                                                                        if: { $eq: ["$$ix", 0] },
                                                                        then: { $slice: ["$relatedEntitiesIDS", 1, { $size: "$relatedEntitiesIDS" }] },
                                                                        else: {
                                                                            $concatArrays: [
                                                                                { $slice: ["$relatedEntitiesIDS", 0, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] },
                                                                                [],
                                                                                { $slice: ["$relatedEntitiesIDS", { $add: [1, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] }, { $size: "$relatedEntitiesIDS" }] }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        advance: prevAdvance
                                                    }
                                                }
                                            ],
                                            { new: true }
                                        );
                                        break;
                                    case "Posts":
                                        userChallengeUpdated = await userChallengeModel.findOneAndUpdate(
                                            { _id: userChallenge.id },
                                            [
                                                {
                                                    $set: {
                                                        relatedPostIDS: {
                                                            $let: {
                                                                vars: { ix: { $indexOfArray: ["$relatedPostIDS", paramID] } },
                                                                in: {
                                                                    $cond: {
                                                                        if: { $eq: ["$$ix", 0] },
                                                                        then: { $slice: ["$relatedPostIDS", 1, { $size: "$relatedPostIDS" }] },
                                                                        else: {
                                                                            $concatArrays: [
                                                                                { $slice: ["$relatedPostIDS", 0, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] },
                                                                                [],
                                                                                { $slice: ["$relatedPostIDS", { $add: [1, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] }, { $size: "$relatedPostIDS" }] }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        advance: prevAdvance
                                                    }
                                                }
                                            ],
                                            { new: true }
                                        );
                                        break;
                                    case "Stories":
                                        userChallengeUpdated = await userChallengeModel.findOneAndUpdate(
                                            { _id: userChallenge.id },
                                            [
                                                {
                                                    $set: {
                                                        relatedStoryIDS: {
                                                            $let: {
                                                                vars: { ix: { $indexOfArray: ["$relatedStoryIDS", paramID] } },
                                                                in: {
                                                                    $cond: {
                                                                        if: { $eq: ["$$ix", 0] },
                                                                        then: { $slice: ["$relatedStoryIDS", 1, { $size: "$relatedStoryIDS" }] },
                                                                        else: {
                                                                            $concatArrays: [
                                                                                { $slice: ["$relatedStoryIDS", 0, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] },
                                                                                [],
                                                                                { $slice: ["$relatedStoryIDS", { $add: [1, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] }, { $size: "$relatedStoryIDS" }] }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        advance: prevAdvance
                                                    }
                                                }
                                            ],
                                            { new: true }
                                        );
                                        break;
                                    case "Comments":
                                        userChallengeUpdated = await userChallengeModel.findOneAndUpdate(
                                            { _id: userChallenge.id },
                                            [
                                                {
                                                    $set: {
                                                        relatedCommentIDS: {
                                                            $let: {
                                                                vars: { ix: { $indexOfArray: ["$relatedCommentIDS", paramID] } },
                                                                in: {
                                                                    $cond: {
                                                                        if: { $eq: ["$$ix", 0] },
                                                                        then: { $slice: ["$relatedCommentIDS", 1, { $size: "$relatedCommentIDS" }] },
                                                                        else: {
                                                                            $concatArrays: [
                                                                                { $slice: ["$relatedCommentIDS", 0, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] },
                                                                                [],
                                                                                { $slice: ["$relatedCommentIDS", { $add: [1, { $cond: { if: { $lt: ["$$ix", 0] }, then: 0, else: "$$ix" } }] }, { $size: "$relatedCommentIDS" }] }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        advance: prevAdvance
                                                    }
                                                }
                                            ],
                                            { new: true }
                                        );
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public async getUserChallengesByUserID(body: any) {
        let rta, rtaError, userChallengesGrouped: any = []

        let userChallenges = await userChallengeModel.find({ userID: body.userID })
            .populate([
                {
                    path: 'userID',
                    model: 'Users',
                },
                {
                    path: 'challengeID',
                    model: 'Challenges',
                },
                {
                    path: 'awardID',
                    model: 'Award',
                    populate: [
                        {
                            path: 'typeOfAwardID',
                            model: 'TypeOfAwards'
                        },
                        {
                            path: 'challengeIDS',
                            model: 'Challenges'
                        }
                    ]
                }
            ])

        if (userChallenges) {
            let sortedObject: any = {}
            userChallenges.forEach(function (userChallenge: any) { // Ordenamiento de retos por premio
                if (!sortedObject.hasOwnProperty(userChallenge.awardID.id)) {
                    sortedObject[userChallenge.awardID.id] = {
                        award: {
                            image: userChallenge.awardID.image.url,
                            name: userChallenge.awardID.name,
                            description: userChallenge.awardID.description,
                            type: userChallenge.awardID.typeOfAwardID.name,
                            scrore: userChallenge.awardID.scoreValue,
                            challengeIDS: userChallenge.awardID.challengeIDS
                        },
                        challenges: []
                    }
                }

                sortedObject[userChallenge.awardID.id].challenges.push({
                    id: userChallenge.challengeID.id,
                    name: userChallenge.challengeID.name,
                    description: userChallenge.challengeID.description,
                    goal: userChallenge.challengeID.quantity,
                    advance: userChallenge.advance,
                    completed: userChallenge.completed
                })
            })

            userChallengesGrouped = Object.values(sortedObject)

            userChallengesGrouped.forEach((userChallengeGroup: any) => { // Seteo de retos aún sin competir
                let challengeIDS = userChallengeGroup.award.challengeIDS
                for (let i = 0; i < challengeIDS.length; i++) {
                    const challenge = challengeIDS[i];

                    let found = userChallengeGroup.challenges.find((cha: any) => cha.id == challenge.id);
                    if (!found) {
                        userChallengeGroup.challenges.push({
                            id: challenge.id,
                            name: challenge.name,
                            description: challenge.description,
                            goal: challenge.quantity,
                            advance: 0,
                            completed: false
                        })
                    }
                }
                delete userChallengeGroup.award.challengeIDS
            })

            rta = userChallengesGrouped;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getUserChallengesByChallenge(body: any) {
        try {
            const userChallenges = await userChallengeModel.find({ challengeID: body.challengeId })
            return userChallenges;
        } catch (error) {
            console.log(error);            
        }
    }

    public async getUserChallengesByAwrad(body: any) {
        try {
            const userChallenges = await userChallengeModel.find({ awardID: body.awardId })
            return userChallenges;
        } catch (error) {
            console.log(error);            
        }
    }
}

export const userChallengeServices = new UserChallengeServices()