import { ConstantsRS } from '../../utils/constants';
import { systemActionServices } from '../systemactions/systemactions.services';
import { similarServices } from '../similarservices/similar.services';
const rankModel = require('../../models/admin/ranks/Ranks.model');
const entityRankModel = require('../../models/entityranks/EntityRanks.model');
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');

class UserRankServices {
    public async saveDefaultUserRank(entity: any) {
        let entityRankSaved, firstRanks
        if (entity) {
            firstRanks = await rankModel.find({}).sort({ creationDate: 1 }).limit(2)

            if (firstRanks.length == 2) {
                let dataEntityRankToSave = new entityRankModel()
                dataEntityRankToSave.userID = entity.id
                dataEntityRankToSave.rankID = firstRanks[0].id
                dataEntityRankToSave.end = (firstRanks[1].requiredScore - 1)
                entityRankSaved = await dataEntityRankToSave.save()

                if (entityRankSaved) {
                    await rankModel.updateOne({ _id: firstRanks[0].id }, { inUse: true })
                    await rankModel.updateOne({ _id: firstRanks[1].id }, { inUse: true })
                    return {
                        rankID: firstRanks[0].id,
                        entityRankID: entityRankSaved.id
                    }
                }
                else {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }

    public async saveUserRank(actionCode: string, entityID: string, paramID: string) {
        let rta, rtaError, typeParam, entityModel

        const entityExist = await similarServices.identifyUserBrandOrCommunity(entityID)

        if (!entityExist.code) {
            switch (entityExist.type) {
                case "user":
                    entityModel = userModel
                    break;
                case "marks":
                    entityModel = trademarkModel
                    break;
            }

            const allRanks = await rankModel.find({}).sort({ order: 1 });
            const systemAction = await systemActionServices.getByActionCode(actionCode)

            if (allRanks.length > 0 && !systemAction.code) { // Si hay rangos vigentes y la acción está parametrizada
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

                const entityRankAdvance = await entityRankModel.findOne({ // Búsqueda de rango actual de entidad
                    $or: [
                        { userID: entityID },
                        { trademarkID: entityID }
                    ]
                }).populate('rankID')

                let rankToAply: any, nextRank, dataEntityToUpdate, entityRankSaved
                let newEntityScore = parseInt(entityExist.score) + parseInt(systemAction.rankingPoints)

                dataEntityToUpdate = new entityModel(entityExist)
                dataEntityToUpdate.score = newEntityScore

                allRanks.forEach((rank: any) => {
                    if (rank.requiredScore <= newEntityScore) {
                        rankToAply = rank
                    }
                });

                if (entityRankAdvance) {
                    if (rankToAply != undefined) {
                        let dataEntityRankToUpdate = new entityRankModel(entityRankAdvance)

                        if (rankToAply.id != entityExist.rankID.id) {
                            dataEntityToUpdate.rankID = rankToAply.id

                            dataEntityRankToUpdate.rankID = rankToAply.id
                            dataEntityRankToUpdate.relatedEntitiesIDS = []
                            dataEntityRankToUpdate.relatedPostIDS = []
                            dataEntityRankToUpdate.relatedStoryIDS = []
                            dataEntityRankToUpdate.relatedCommentIDS = []
                        } else {
                            switch (typeParam) {
                                case "Entities":
                                    dataEntityRankToUpdate.relatedEntitiesIDS.push(paramID)
                                    break;
                                case "Posts":
                                    dataEntityRankToUpdate.relatedPostIDS.push(paramID)
                                    break;
                                case "Stories":
                                    dataEntityRankToUpdate.relatedStoryIDS.push(paramID)
                                    break;
                                case "Comments":
                                    dataEntityRankToUpdate.relatedCommentIDS.push(paramID)
                                    break;
                            }
                        }

                        nextRank = await rankModel.findOne({ order: { $gt: rankToAply.order } }) // Próximo rango al aplicado

                        dataEntityRankToUpdate.advance = newEntityScore
                        dataEntityRankToUpdate.start = rankToAply.requiredScore

                        if (nextRank) {
                            dataEntityRankToUpdate.end = (nextRank.requiredScore - 1)
                            dataEntityRankToUpdate.latest = false
                        } else {
                            dataEntityRankToUpdate.end = 0
                            dataEntityRankToUpdate.latest = true
                        }

                        let entityRankUpdated = await entityRankModel.findOneAndUpdate({ _id: entityRankAdvance.id }, dataEntityRankToUpdate, { new: true })
                        if (entityRankUpdated) {
                            await rankModel.updateOne({ _id: rankToAply.id }, { inUse: true })
                            if (entityRankUpdated.latest == false) {
                                await rankModel.updateOne({ _id: nextRank.id }, { inUse: true })
                            }
                        }
                    }
                } else {
                    if (rankToAply != undefined) {
                        dataEntityToUpdate.rankID = rankToAply.id

                        let dataEntityRankToSave = new entityRankModel(entityRankAdvance)
                        dataEntityRankToSave.rankID = rankToAply.id
                        dataEntityRankToSave.advance = newEntityScore

                        switch (entityExist.type) {
                            case "user":
                                dataEntityRankToSave.userID = entityExist.id
                                break;
                            case "marks":
                                dataEntityRankToSave.trademarkID = entityExist.id
                                break;
                        }

                        dataEntityRankToSave.start = rankToAply.requiredScore
                        nextRank = await rankModel.findOne({ order: { $gt: rankToAply.order } }) // Próximo rango al aplicado

                        if (nextRank) {
                            dataEntityRankToSave.end = (nextRank.requiredScore - 1)
                            dataEntityRankToSave.latest = false
                        } else {
                            dataEntityRankToSave.end = 0
                            dataEntityRankToSave.latest = true
                        }

                        switch (typeParam) {
                            case "Entities":
                                dataEntityRankToSave.relatedEntitiesIDS.push(paramID)
                                break;
                            case "Posts":
                                dataEntityRankToSave.relatedPostIDS.push(paramID)
                                break;
                            case "Stories":
                                dataEntityRankToSave.relatedStoryIDS.push(paramID)
                                break;
                            case "Comments":
                                dataEntityRankToSave.relatedCommentIDS.push(paramID)
                                break;
                        }

                        entityRankSaved = await dataEntityRankToSave.save()
                        if (entityRankSaved) {
                            dataEntityToUpdate.entityRankID = entityRankSaved.id

                            if (entityRankSaved) {
                                await rankModel.updateOne({ _id: rankToAply.id }, { inUse: true })
                                if (entityRankSaved.latest == false) {
                                    await rankModel.updateOne({ _id: nextRank.id }, { inUse: true })
                                }
                            }
                        }
                    }
                }

                rta = await entityModel.findOneAndUpdate({ _id: entityExist.id }, dataEntityToUpdate)
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async cancelAdvanceUserRank(actionCode: String, entityID: any, paramID: string) {
        let typeParam, entityModel

        const entityExist = await similarServices.identifyUserBrandOrCommunity(entityID)
        if (!entityExist.code) {
            switch (entityExist.type) {
                case "user":
                    entityModel = userModel
                    break;
                case "marks":
                    entityModel = trademarkModel
                    break;
            }

            const allRanks = await rankModel.find({}).sort({ order: 1 });
            const systemAction = await systemActionServices.getByActionCode(actionCode)

            if (allRanks.length > 0 && !systemAction.code) { // Si hay rangos vigentes y la acción está parametrizada
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

                const entityRankAdvance = await entityRankModel.findOne({ // Búsqueda de rango actual de entidad
                    $or: [
                        { userID: entityID },
                        { trademarkID: entityID }
                    ]
                }).populate('rankID')

                let rankToAply: any, nextRank, dataEntityToUpdate
                let newEntityScore = parseInt(entityExist.score) - parseInt(systemAction.rankingPoints)

                dataEntityToUpdate = new entityModel(entityExist)
                dataEntityToUpdate.score = newEntityScore

                allRanks.forEach((rank: any, index: any) => {
                    if (rank.requiredScore <= newEntityScore) {
                        rankToAply = rank
                    }
                });

                if (entityRankAdvance) {
                    if (rankToAply != undefined) {
                        if (rankToAply.id != entityExist.rankID.id) {
                            dataEntityToUpdate.rankID = rankToAply.id
                        }

                        let newRankID, newAdvance, newStart, newEnd, newLatest
                        newRankID = rankToAply.id
                        newStart = rankToAply.requiredScore
                        newAdvance = newEntityScore

                        nextRank = await rankModel.findOne({ order: { $gt: rankToAply.order } }) // Próximo rango al aplicado

                        if (nextRank) {
                            newEnd = (nextRank.requiredScore - 1)
                            newLatest = false
                        } else {
                            newEnd = 0
                            newLatest = true
                        }

                        let foundParameter = false

                        switch (typeParam) {
                            case "Entities":
                                entityRankAdvance.relatedEntitiesIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                            case "Posts":
                                entityRankAdvance.relatedPostIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                            case "Stories":
                                entityRankAdvance.relatedStoryIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                            case "Comments":
                                entityRankAdvance.relatedCommentIDS.filter((related: any) => {
                                    if (related == paramID) {
                                        foundParameter = true
                                    }
                                })
                                break;
                        }

                        if (foundParameter) {
                            let userRankUpdated

                            switch (typeParam) {
                                case "Entities":
                                    userRankUpdated = await entityRankModel.findOneAndUpdate(
                                        { _id: entityRankAdvance.id },
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
                                                    rankID: newRankID, advance: newAdvance, start: newStart, end: newEnd, latest: newLatest
                                                }
                                            }
                                        ],
                                        { new: true }
                                    );
                                    break;
                                case "Posts":
                                    userRankUpdated = await entityRankModel.findOneAndUpdate(
                                        { _id: entityRankAdvance.id },
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
                                                    rankID: newRankID, advance: newAdvance, start: newStart, end: newEnd, latest: newLatest
                                                }
                                            }
                                        ],
                                        { new: true }
                                    );
                                    break;
                                case "Stories":
                                    userRankUpdated = await entityRankModel.findOneAndUpdate(
                                        { _id: entityRankAdvance.id },
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
                                                    rankID: newRankID, advance: newAdvance, start: newStart, end: newEnd, latest: newLatest
                                                }
                                            }
                                        ],
                                        { new: true }
                                    );
                                    break;
                                case "Comments":
                                    userRankUpdated = await entityRankModel.findOneAndUpdate(
                                        { _id: entityRankAdvance.id },
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
                                                    rankID: newRankID, advance: newAdvance, start: newStart, end: newEnd, latest: newLatest
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

                await entityModel.findOneAndUpdate({ _id: entityID }, dataEntityToUpdate, { new: true })
            }
        }
    }

    public async addSubstractScoreToEntity(entityID: any, score: any, operator: string = "add") {
        if (entityID && score > 0) {
            let entityModel, newEntityScore: any
            const entityExist = await similarServices.identifyUserBrandOrCommunity(entityID)

            if (!entityExist.code) {
                switch (entityExist.type) {
                    case "user":
                        entityModel = userModel
                        break;
                    case "marks":
                        entityModel = trademarkModel
                        break;
                }

                let dataEntityToUpdate, rankToAply: any, nextRank, entityRankSaved

                if (operator === "add") {
                    newEntityScore = parseInt(entityExist.score) + parseInt(score)
                } else if (operator === "substract") {
                    newEntityScore = parseInt(entityExist.score) - parseInt(score)
                }

                if (entityExist.type == "user") { // Sumar puntaje a usuario
                    dataEntityToUpdate = new userModel(entityExist)
                    dataEntityToUpdate.score = newEntityScore

                    const allRanks = await rankModel.find({}).sort({ order: 1 });

                    if (allRanks.length > 0) {
                        // Búsqueda de rango actual de entidad
                        const entityRankAdvance = await entityRankModel.findOne({ userID: entityID }).populate('rankID')

                        allRanks.forEach((rank: any) => {
                            if (rank.requiredScore <= newEntityScore) {
                                rankToAply = rank
                            }
                        });

                        if (entityRankAdvance) {
                            let dataEntityRankToUpdate = new entityRankModel(entityRankAdvance)

                            if (rankToAply.id != entityExist.rankID.id) {
                                dataEntityToUpdate.rankID = rankToAply.id

                                dataEntityRankToUpdate.rankID = rankToAply.id
                                dataEntityRankToUpdate.relatedEntitiesIDS = []
                                dataEntityRankToUpdate.relatedPostIDS = []
                                dataEntityRankToUpdate.relatedStoryIDS = []
                                dataEntityRankToUpdate.relatedCommentIDS = []
                            }

                            nextRank = await rankModel.findOne({ order: { $gt: rankToAply.order } }) // Próximo rango al aplicado

                            dataEntityRankToUpdate.advance = newEntityScore
                            dataEntityRankToUpdate.start = rankToAply.requiredScore

                            if (nextRank) {
                                dataEntityRankToUpdate.end = (nextRank.requiredScore - 1)
                                dataEntityRankToUpdate.latest = false
                            } else {
                                dataEntityRankToUpdate.end = 0
                                dataEntityRankToUpdate.latest = true
                            }

                            let entityRankUpdated = await entityRankModel.findOneAndUpdate({ _id: entityRankAdvance.id }, dataEntityRankToUpdate, { new: true })
                            if (entityRankUpdated) {
                                await rankModel.updateOne({ _id: rankToAply.id }, { inUse: true })
                                if (entityRankUpdated.latest == false) {
                                    await rankModel.updateOne({ _id: nextRank.id }, { inUse: true })
                                }
                            }
                        } else {
                            if (rankToAply != undefined) {
                                dataEntityToUpdate.rankID = rankToAply.id

                                let dataEntityRankToSave = new entityRankModel()
                                dataEntityRankToSave.rankID = rankToAply.id
                                dataEntityRankToSave.advance = newEntityScore
                                dataEntityRankToSave.userID = entityExist.id

                                dataEntityRankToSave.start = rankToAply.requiredScore
                                nextRank = await rankModel.findOne({ order: { $gt: rankToAply.order } }) // Próximo rango al aplicado

                                if (nextRank) {
                                    dataEntityRankToSave.end = (nextRank.requiredScore - 1)
                                    dataEntityRankToSave.latest = false
                                } else {
                                    dataEntityRankToSave.end = 0
                                    dataEntityRankToSave.latest = true
                                }

                                entityRankSaved = await dataEntityRankToSave.save()
                                if (entityRankSaved) {
                                    dataEntityToUpdate.entityRankID = entityRankSaved.id

                                    await rankModel.updateOne({ _id: rankToAply.id }, { inUse: true })
                                    if (entityRankSaved.latest == false) {
                                        await rankModel.updateOne({ _id: nextRank.id }, { inUse: true })
                                    }
                                }
                            }
                        }
                    }

                    await entityModel.findOneAndUpdate({ _id: entityExist.id }, dataEntityToUpdate, { new: true })
                }
            }
        }
    }

    public async getUserRanks(body: any) {
        let entityRanks: any = [], eachRank: any, nextRank: any

        const entityExist = await similarServices.identifyUserBrandOrCommunity(body.userID)

        if (!entityExist.code) {
            let allRanks = await rankModel.find({}).sort({ creationDate: 1 })
            let entityRankAdvance = await entityRankModel.findOne({ userID: body.userID }).populate('rankID')

            if (entityRankAdvance) {
                for await (let rank of allRanks) {
                    eachRank = {}
                    nextRank = await rankModel.findOne({ order: { $gt: rank.order } }) // Próximo rango al aplicado

                    if (rank.id == entityRankAdvance.rankID.id) {
                        eachRank.id = rank.id
                        eachRank.name = rank.name
                        eachRank.description = rank.description
                        eachRank.image = rank.image
                        eachRank.advance = entityRankAdvance.advance
                        eachRank.start = rank.requiredScore
                        eachRank.current = true
                        eachRank.colored = true

                        if (nextRank) {
                            eachRank.end = (nextRank.requiredScore - 1)
                            eachRank.latest = false
                        } else {
                            eachRank.end = 0
                            eachRank.latest = true
                        }
                    } else {
                        if (rank.order < entityRankAdvance.rankID.order) { // Rangos completados
                            eachRank.id = rank.id
                            eachRank.name = rank.name
                            eachRank.description = rank.description
                            eachRank.image = rank.image
                            eachRank.start = rank.requiredScore
                            eachRank.current = false
                            eachRank.colored = true

                            if (nextRank) {
                                eachRank.advance = (nextRank.requiredScore - 1)
                                eachRank.end = (nextRank.requiredScore - 1)
                                eachRank.latest = false
                            } else {
                                eachRank.advance = entityRankAdvance.advance
                                eachRank.end = 0
                                eachRank.latest = true
                            }
                        } else { // Rangos sin completar
                            eachRank.id = rank.id
                            eachRank.name = rank.name
                            eachRank.description = rank.description
                            eachRank.image = rank.grayImage
                            eachRank.start = rank.requiredScore
                            eachRank.advance = 0
                            eachRank.current = false
                            eachRank.colored = false

                            if (nextRank) {
                                eachRank.end = (nextRank.requiredScore - 1)
                                eachRank.latest = false
                            } else {
                                eachRank.end = 0
                                eachRank.latest = true
                            }
                        }
                    }


                    if (eachRank) {
                        entityRanks.push(eachRank)
                    }
                }
            } else {
                for await (let rank of allRanks) {
                    eachRank = {}
                    nextRank = await rankModel.findOne({ order: { $gt: rank.order } }) // Próximo rango al aplicado

                    eachRank.id = rank.id
                    eachRank.name = rank.name
                    eachRank.description = rank.description
                    eachRank.image = rank.grayImage
                    eachRank.advance = 0
                    eachRank.start = rank.requiredScore
                    eachRank.current = false

                    if (nextRank) {
                        eachRank.end = (nextRank.requiredScore - 1)
                        eachRank.latest = false
                    } else {
                        eachRank.end = 0
                        eachRank.latest = true
                    }

                    if (eachRank) {
                        entityRanks.push(eachRank)
                    }
                }
            }

            return entityRanks
        }
    }
}

export const userRankServices = new UserRankServices()