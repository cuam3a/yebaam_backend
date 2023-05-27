const pointsByPostModel = require('../../../models/pointPackage/pointsByPost.model');
const postModel = require('../../../models/post/Posts.model');
const trademarkBankPointsModel = require('../../../models/trademarks/trademarksBankPoints.model');
import { ConstantsRS } from '../../../utils/constants';
import { similarServices } from '../../similarservices/similar.services';
import { trademarksBankpointsService } from '../../trademarks/trademarksBankPoints.service';
import { userRankServices } from '../../userranks/userranks.service';
import { PointsByPostInterface } from './pointsByPost.interface'

class PointsByPostService {

    public async createPointsToPost(body: any, postId: string) {
        if (!body.dataToPoints.likePoints) throw ConstantsRS.DATAPOINTS_NOT_VALID;

        const entityId = body.userID || body.trademarkID || body.communityID; //need to save field user or mark or community
        const entity = await similarServices.identifyUserBrandOrCommunity(entityId);
        const fieldUser = entity.type + 'Id';

        // initialized avaliable points by default
        const likePoints = { ...body.dataToPoints.likePoints, avaliablePoints: body.dataToPoints.likePoints.totalPoints };
        const commentPoints = { ...body.dataToPoints.commentPoints, avaliablePoints: body.dataToPoints.commentPoints.totalPoints };
        const sharePoints = { ...body.dataToPoints.sharePoints, avaliablePoints: body.dataToPoints.sharePoints.totalPoints };

        const quantity = (body.dataToPoints.likePoints.totalPoints + body.dataToPoints.commentPoints.totalPoints + body.dataToPoints.sharePoints.totalPoints)
        const dataEntity = { [fieldUser]: entityId };
        const bodySubtrac = { quantity };
        await trademarksBankpointsService.substrackPoints(dataEntity, bodySubtrac);

        // create new object
        const bodyCreate = { ...body, likePoints, commentPoints, sharePoints, [fieldUser]: entityId, postId };
        const pointsPostToSave = new pointsByPostModel(bodyCreate);

        const pointPostSaved = await pointsPostToSave.save();
        if (pointPostSaved) {
            await postModel.findOneAndUpdate({ _id: postId }, { pointsByPostID: pointPostSaved.id, activePoints: true }, { new: true })
        }

        return pointPostSaved
    }

    public async getPointsByLike(postId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId });
        if (!objectvaluesToPost) return 0;

        if (!objectvaluesToPost.likePoints) return 0; // if is a normal post

        if (operator === "add") {
            if (objectvaluesToPost.likePoints.avaliablePoints <= 0) return 0; //if not have points
        }

        return objectvaluesToPost.likePoints.value;
    }

    public async getPointsByShare(postId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId });
        if (!objectvaluesToPost) return 0;

        if (!objectvaluesToPost.sharePoints) return 0; // if is a normal post

        if (operator === "add") {
            if (objectvaluesToPost.sharePoints.avaliablePoints <= 0) return 0; //if not have points
        }

        return objectvaluesToPost.sharePoints.value;
    }

    public async getPointsByComments(postId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId }); //get register post
        if (!objectvaluesToPost) return 0 //if not exist

        if (!objectvaluesToPost.commentPoints) return 0; // if is a normal post

        if (operator === "add") {
            if (objectvaluesToPost.commentPoints.avaliablePoints <= 0) return 0; //if not have points
        }

        return objectvaluesToPost.commentPoints.value;
    }

    public async addSubstractLikePoints(postId: string, quantity: number, entityId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId }); //get register post
        if (!objectvaluesToPost) return 0 //if not exist

        if (operator === "add") {
            if (objectvaluesToPost.likePoints.avaliablePoints <= 0 || objectvaluesToPost.likePoints.avaliablePoints < quantity) return 0; //if not have points
        }

        let newAvaliablePoints, pointsByPostUpdated, newLikePoints
        let dataToUpdate = new pointsByPostModel(objectvaluesToPost);

        if (operator === "add") {
            newAvaliablePoints = objectvaluesToPost.likePoints.avaliablePoints - quantity; //subtract points
            newLikePoints = { ...objectvaluesToPost.likePoints, avaliablePoints: newAvaliablePoints }

            dataToUpdate.likePoints = newLikePoints
            dataToUpdate.benefitedByReactionsIDS.push(entityId)

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                dataToUpdate,
                { new: true }
            )
        } else if (operator === "substract") {
            newAvaliablePoints = objectvaluesToPost.likePoints.avaliablePoints + quantity;
            newLikePoints = { ...objectvaluesToPost.likePoints, avaliablePoints: newAvaliablePoints }

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                { $pull: { benefitedByReactionsIDS: entityId }, likePoints: newLikePoints },
                { new: true }
            )
        }

        return pointsByPostUpdated //return updated data
    }

    public async addSubstractCommentsPoints(postId: string, quantity: number, entityId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId }); //get register post
        if (!objectvaluesToPost) return 0 //if not exist

        if (operator === "add") {
            if (objectvaluesToPost.commentPoints.avaliablePoints <= 0 || objectvaluesToPost.commentPoints.avaliablePoints < quantity) return 0; //if not have points
        }

        let newAvaliablePoints, pointsByPostUpdated, newCommentPoints
        let dataToUpdate = new pointsByPostModel(objectvaluesToPost);

        if (operator === "add") {
            newAvaliablePoints = objectvaluesToPost.commentPoints.avaliablePoints - quantity; //subtract points
            newCommentPoints = { ...objectvaluesToPost.commentPoints, avaliablePoints: newAvaliablePoints }

            dataToUpdate.commentPoints = newCommentPoints
            dataToUpdate.benefitedByCommentsIDS.push(entityId)

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                dataToUpdate,
                { new: true }
            )
        } else if (operator === "substract") {
            newAvaliablePoints = objectvaluesToPost.commentPoints.avaliablePoints + quantity;
            newCommentPoints = { ...objectvaluesToPost.commentPoints, avaliablePoints: newAvaliablePoints }

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                { $pull: { benefitedByCommentsIDS: entityId }, commentPoints: newCommentPoints },
                { new: true }
            )
        }

        return pointsByPostUpdated //return updated data
    }

    // TODO
    public async addSubstractSharePoints(postId: string, quantity: number, entityId: string, operator: string = "add") {
        const objectvaluesToPost = await pointsByPostModel.findOne({ postId }); //get register post
        if (!objectvaluesToPost) return 0 //if not exist

        if (operator === "add") {
            if (objectvaluesToPost.sharePoints.avaliablePoints <= 0 || objectvaluesToPost.sharePoints.avaliablePoints < quantity) return 0; //if not have points
        }

        let newAvaliablePoints, pointsByPostUpdated, newSharePoints, newBenefited
        let dataToUpdate = new pointsByPostModel(objectvaluesToPost);

        if (operator === "add") {
            newAvaliablePoints = objectvaluesToPost.sharePoints.avaliablePoints - quantity; //subtract points
            newSharePoints = { ...objectvaluesToPost.sharePoints, avaliablePoints: newAvaliablePoints }

            dataToUpdate.sharePoints = newSharePoints
            dataToUpdate.benefitedBySharedIDS.push(entityId)

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                dataToUpdate,
                { new: true }
            )
        } else if (operator === "substract") {
            newAvaliablePoints = objectvaluesToPost.sharePoints.avaliablePoints + quantity; //subtract points
            newSharePoints = { ...objectvaluesToPost.sharePoints, avaliablePoints: newAvaliablePoints }

            pointsByPostUpdated = await pointsByPostModel.findOneAndUpdate(
                { postId: postId },
                { $pull: { benefitedBySharedIDS: entityId }, sharePoints: newSharePoints },
                { new: true }
            )
        }

        return pointsByPostUpdated
    }

    /* public async addLikePoints(postId: string, quantity: number) {

        const postToupdate = await pointsByPostModel.findOne({ postId });
        if (!postToupdate) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        const updateLikePoints = postToupdate.likePoints.avaliablePoints + quantity;

        await pointsByPostModel.updateOne({ postId }, { ...postToupdate.likePoints, avaliablePoints: updateLikePoints });

        return await pointsByPostModel.findOne({ postId });
    } */

    public async addSubstractPointsToUserIdLike(contentId: string, entityId: string, operator: string = "add") {
        const postExist = await postModel.findById(contentId)
        if (postExist) {
            let brandBank = await trademarkBankPointsModel.findOne({ marksId: postExist.trademarkID })

            if (brandBank && postExist.activePoints) {
                const pointsLike = await this.getPointsByLike(contentId, operator); //get points to like
                if (!pointsLike) return 0; //if points 0 not update

                const addedPoints = await userRankServices.addSubstractScoreToEntity(entityId, pointsLike, operator);

                return await this.addSubstractLikePoints(contentId, pointsLike, entityId, operator);
            }
        }
    }

    public async addSubstractPointsToUserIdComment(contentId: string, entityId: string, operator: string = "add") {
        let userBenefited
        const postExist = await postModel.findById(contentId)
        if (postExist) {
            let brandBank = await trademarkBankPointsModel.findOne({ marksId: postExist.trademarkID })

            userBenefited = await pointsByPostModel.findOne({
                $and: [{ postId: contentId }, { benefitedByCommentsIDS: { $in: [entityId] } }]
            })

            if ((operator === "add" && !userBenefited) || (operator === "substract" && userBenefited)) {
                console.log("ENTRA")
                if (brandBank && postExist.activePoints) {
                    const pointsComment = await this.getPointsByComments(contentId, operator); //get points to comment
                    if (!pointsComment) return 0; //if points 0 not update

                    const addedPoints = await userRankServices.addSubstractScoreToEntity(entityId, pointsComment, operator);

                    return await this.addSubstractCommentsPoints(contentId, pointsComment, entityId, operator);
                }
            }
        }
    }

    public async addSubstractPointsToUserIdShare(contentId: string, entityId: string, operator: string = "add") {
        let userBenefited
        const postExist = await postModel.findById(contentId)
        if (postExist) {
            let brandBank = await trademarkBankPointsModel.findOne({ marksId: postExist.trademarkID })

            userBenefited = await pointsByPostModel.findOne({
                $and: [{ postId: contentId }, { benefitedBySharedIDS: { $in: [entityId] } }]
            })

            if ((operator === "add" && !userBenefited) || (operator === "substract" && userBenefited)) {
                if (brandBank && postExist.activePoints) {
                    const pointsShare = await this.getPointsByShare(contentId, operator); //get points to comment
                    if (!pointsShare) return 0; //if points 0 not update

                    const addedPoints = await userRankServices.addSubstractScoreToEntity(entityId, pointsShare, operator);

                    return await this.addSubstractSharePoints(contentId, pointsShare, entityId, operator);
                }
            }
        }
    }

}

export const pointsByPostService = new PointsByPostService();