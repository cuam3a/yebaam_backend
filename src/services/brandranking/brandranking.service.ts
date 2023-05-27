import { ConstantsRS } from '../../utils/constants';
import { systemActionServices } from '../systemactions/systemactions.services';
import { similarServices } from '../similarservices/similar.services';
import { userSettingsServices } from '../usersettings/usersettings.service';
const brandRankingModel = require('../../models/brandranking/BrandRanking.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');

class BrandRankingServices {
    public async saveBrandRanking(actionCode: string, brandID: string, paramID: string) {
        let rta, rtaError, typeParam, dataBrandToUpdate
        const brandExist = await trademarkModel.findById(brandID)

        if (!brandExist.code) {
            const systemAction = await systemActionServices.getByActionCode(actionCode)

            if (!systemAction.code) { // Si la acción está parametrizada
                switch (actionCode) {
                    case ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code:
                    case ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code:
                        typeParam = "Entities"
                        break;
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code:
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

                const brandRankingAdvance = await brandRankingModel.findOne({ trademarkID: brandID }).populate('trademarkID')

                let newBrandScore = (brandExist.score + systemAction.rankingPoints)

                dataBrandToUpdate = new trademarkModel(brandExist)
                dataBrandToUpdate.score = newBrandScore

                if (brandRankingAdvance) {
                    let dataBrandRankingToUpdate = new brandRankingModel(brandRankingAdvance)
                    dataBrandRankingToUpdate.advance = newBrandScore

                    switch (typeParam) {
                        case "Entities":
                            dataBrandRankingToUpdate.relatedEntitiesIDS.push(paramID)
                            break;
                        case "Posts":
                            dataBrandRankingToUpdate.relatedPostIDS.push(paramID)
                            break;
                        case "Stories":
                            dataBrandRankingToUpdate.relatedStoryIDS.push(paramID)
                            break;
                        case "Comments":
                            dataBrandRankingToUpdate.relatedCommentIDS.push(paramID)
                            break;
                    }

                    await brandRankingModel.findOneAndUpdate({ _id: brandRankingAdvance.id }, dataBrandRankingToUpdate)
                } else {
                    let dataBrandRankingToSave = new brandRankingModel(brandRankingAdvance)
                    dataBrandRankingToSave.advance = newBrandScore
                    dataBrandRankingToSave.trademarkID = brandID

                    switch (typeParam) {
                        case "Entities":
                            dataBrandRankingToSave.relatedEntitiesIDS.push(paramID)
                            break;
                        case "Posts":
                            dataBrandRankingToSave.relatedPostIDS.push(paramID)
                            break;
                        case "Stories":
                            dataBrandRankingToSave.relatedStoryIDS.push(paramID)
                            break;
                        case "Comments":
                            dataBrandRankingToSave.relatedCommentIDS.push(paramID)
                            break;
                    }

                    let brandRankingSaved = await dataBrandRankingToSave.save()
                    if (brandRankingSaved) {
                        dataBrandToUpdate.brandRankingID = brandRankingSaved.id
                    }
                }

                rta = await trademarkModel.findOneAndUpdate({ _id: brandExist.id }, dataBrandToUpdate)
                console.log("R: ", rta)
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async cancelAdvanceBrandRanking(actionCode: string, brandID: string, paramID: string) {
        let rta, rtaError, typeParam, dataBrandToUpdate
        const brandExist = await trademarkModel.findById(brandID)

        if (!brandExist.code) {
            const systemAction = await systemActionServices.getByActionCode(actionCode)

            if (!systemAction.code) { // Si la acción está parametrizada
                switch (actionCode) {
                    case ConstantsRS.SYSTEM_ACTION_FOLLOW_USER.code:
                    case ConstantsRS.SYSTEM_ACTION_GET_FOLLOWER.code:
                        typeParam = "Entities"
                        break;
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code:
                    case ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code:
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

                const brandRankingAdvance = await brandRankingModel.findOne({ trademarkID: brandID }).populate('trademarkID')

                let newBrandScore = (brandExist.score - systemAction.rankingPoints)

                dataBrandToUpdate = new trademarkModel(brandExist)
                dataBrandToUpdate.score = newBrandScore

                if (brandRankingAdvance) {
                    let foundParameter = false

                    switch (typeParam) {
                        case "Entities":
                            brandRankingAdvance.relatedEntitiesIDS.filter((related: any) => {
                                if (related == paramID) {
                                    foundParameter = true
                                }
                            })
                            break;
                        case "Posts":
                            brandRankingAdvance.relatedPostIDS.filter((related: any) => {
                                if (related == paramID) {
                                    foundParameter = true
                                }
                            })
                            break;
                        case "Stories":
                            brandRankingAdvance.relatedStoryIDS.filter((related: any) => {
                                if (related == paramID) {
                                    foundParameter = true
                                }
                            })
                            break;
                        case "Comments":
                            brandRankingAdvance.relatedCommentIDS.filter((related: any) => {
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
                                userRankUpdated = await brandRankingModel.findOneAndUpdate(
                                    { _id: brandRankingAdvance.id },
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
                                                advance: newBrandScore
                                            }
                                        }
                                    ],
                                    { new: true }
                                );
                                break;
                            case "Posts":
                                userRankUpdated = await brandRankingModel.findOneAndUpdate(
                                    { _id: brandRankingAdvance.id },
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
                                                advance: newBrandScore
                                            }
                                        }
                                    ],
                                    { new: true }
                                );
                                break;
                            case "Stories":
                                userRankUpdated = await brandRankingModel.findOneAndUpdate(
                                    { _id: brandRankingAdvance.id },
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
                                                advance: newBrandScore
                                            }
                                        }
                                    ],
                                    { new: true }
                                );
                                break;
                            case "Comments":
                                userRankUpdated = await brandRankingModel.findOneAndUpdate(
                                    { _id: brandRankingAdvance.id },
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
                                                advance: newBrandScore
                                            }
                                        }
                                    ],
                                    { new: true }
                                );
                                break;
                        }
                    }
                }

                let trademarkUpdated = await trademarkModel.findOneAndUpdate({ _id: brandID }, dataBrandToUpdate, { new: true })
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getRankingBrands(body: any) {
        let { limit, nextSkip, skip } = body;
        let conditionals
        let typeOfMarkID = body.typeOfMarkID ? body.typeOfMarkID : null

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (typeOfMarkID != null) {
            conditionals = [{ inRanking: true }, { isEnabled: true }, { typeOfMarkID }]
        } else {
            conditionals = [{ inRanking: true }, { isEnabled: true }]
        }

        const rankingBrands = await trademarkModel.find({
            $and: conditionals
        })
            .select("id typeOfMarkID name profilePicture score")
            .populate("typeOfMarkID")
            .sort({ score: -1 })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { rankingBrands, nextSkip };
    }

    public async addScoreToBrand(brandID: any, score: any) {
        if (brandID && score > 0) {
            const brandExist = await similarServices.identifyUserBrandOrCommunity(brandID)

            if (!brandExist.code) {
                const entity = await trademarkModel.findById(brandID)
                    .populate("brandRankingID")

                let dataBrandToUpdate, brandRankingSaved

                let newEntityScore = parseInt(entity.score) + parseInt(score)

                if (entity.type == "marks") { // Sumar puntaje a marca
                    dataBrandToUpdate = new trademarkModel(entity)
                    dataBrandToUpdate.score = newEntityScore

                    // Búsqueda de rango actual de entidad
                    const brandRankingAdvance = await brandRankingModel.findOne({ trademarkID: brandID })

                    if (brandRankingAdvance) {
                        let dataBrandRankingToUpdate = new brandRankingModel(brandRankingAdvance)
                        dataBrandRankingToUpdate.advance = newEntityScore

                        let brandRankUpdated = await brandRankingModel.findOneAndUpdate({ _id: brandRankingAdvance.id }, dataBrandRankingToUpdate)
                    } else {
                        let dataEntityRankToSave = new brandRankingModel()
                        dataEntityRankToSave.advance = newEntityScore
                        dataEntityRankToSave.trademarkID = entity.id

                        brandRankingSaved = await dataEntityRankToSave.save()
                        if (brandRankingSaved) {
                            dataBrandToUpdate.brandRankingID = brandRankingSaved.id
                        }
                    }

                    await trademarkModel.findOneAndUpdate({ _id: entity.id }, dataBrandToUpdate, { new: true })
                }
            }
        }
    }
}

export const brandRankingServices = new BrandRankingServices()