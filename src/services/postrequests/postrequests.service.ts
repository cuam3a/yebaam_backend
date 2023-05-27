import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
const postRequestModel = require('../../models/postrequests/PostRequests.model');
const postModel = require('../../models/post/Posts.model');
const professionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');
import { similarServices } from '../../services/similarservices/similar.services';
import { notificationsServices } from '../notifications/notifications.services';

class PostRequestServices {
    public async savePostRequest(body: any) {
        let rta, rtaError

        const postRequestExist = await postRequestModel.findOne({
            $or: [
                {
                    $and: [
                        { communityID: body.communityID },
                        { postID: body.postID }
                    ]
                },
                {
                    $and: [
                        { professionalCommunityID: body.communityID },
                        { professionalPostID: body.professionalPostID }
                    ]
                }
            ]
        })

        if (!postRequestExist) {
            const postRequestToSave = new postRequestModel(body);
            const postRequestSaved = await postRequestToSave.save();

            if (postRequestSaved) {
                rta = postRequestSaved
                await notificationsServices.sendNotificationRequestPostAnyCommunity(rta)
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }
    }

    public async updateState(body: any) {
        let rta, rtaError, postUpdated, postExist, model, contentID

        const postRequestExist = await postRequestModel.findOne({
            $and: [
                { _id: body.id },
                { status: 0 }
            ]
        })

        if (postRequestExist) {
            if (postRequestExist.postID != undefined) {
                model = postModel
                contentID = postRequestExist.postID
                postExist = await postModel.findById(postRequestExist.postID).populate("postIDS")
            } else if (postRequestExist.professionalPostID != undefined) {
                model = professionalPostModel
                contentID = postRequestExist.professionalPostID
                postExist = await professionalPostModel.findById(postRequestExist.professionalPostID).populate("postIDS")
            }

            if (postExist) {
                if (body.status == 1) {
                    postUpdated = await model.deleteOne({ _id: contentID });
                    if (postUpdated) {
                        if (postExist.typePost == 2) {
                            for await (let post of postExist.postIDS) {
                                let subPostDeleted = await model.deleteOne({ _id: post.id })
                            }
                        }
                    }
                } else if (body.status == 2) {
                    postUpdated = await model.findOneAndUpdate({ _id: contentID }, { isEnabled: true }, { new: true });
                }

                if (postUpdated) {
                    const postRequestUpdated = await postRequestModel.findOneAndUpdate({ _id: body.id }, { status: body.status }, { new: true })

                    if (postRequestUpdated) {
                        rta = postRequestUpdated
                        await notificationsServices.sendNotificationRequestPostAnyCommunityAdmin(rta)
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.CANNOT_UPDATE_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getRequestsByCommunityID(body: any) {
        let rta, rtaError, postRequests

        const communityExist = await similarServices.identifyTypeOfCommunity(body.communityID)

        if (!communityExist.code) {
            switch (communityExist.type) {
                case "community":
                    postRequests = await postRequestModel.find({
                        $and: [
                            { communityID: body.communityID },
                            { status: 0 }
                        ]
                    }).populate([
                        {
                            path: 'postID',
                            model: 'Posts'
                        },
                        {
                            path: 'postingUserID',
                            model: 'Users'
                        }
                    ])
                    break;
                case "professionalcommunity":
                    postRequests = await postRequestModel.find({
                        $and: [
                            { professionalCommunityID: body.communityID },
                            { status: 0 }
                        ]
                    }).populate([
                        {
                            path: 'professionalPostID',
                            model: 'ProfessionalPosts'
                        },
                        {
                            path: 'postingProfessionalID',
                            model: 'ProfessionalProfiles'
                        }
                    ])
                    break;
            }

            if (postRequests.length > 0) {
                rta = postRequests
            } else {
                rtaError = ConstantsRS.NO_RECORDS
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getRequestPostsByID(postRequesId: any) {
        try {
            const postRequests = await postRequestModel
                .find({ _id: postRequesId })
                .populate([
                    {
                        path: 'communityID',
                        model: 'Communities',
                        populate: [{
                            path: 'userID',
                            model: 'Users'
                        }]
                    }
                ])
                .populate([
                    {
                        path: 'professionalCommunityID',
                        model: 'ProfessionalCommunities',
                        populate: [{
                            path: 'professionalId',
                            model: 'ProfessionalProfiles'
                        }]
                    }
                ])
                .populate('postingUserID')
                .populate('postingProfessionalID')
            return postRequests
        } catch (error) {
            console.log(error);
        }
    }
}

export const postRequestServices = new PostRequestServices()