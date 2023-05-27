import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
const professioalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');
const professionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');

import { similarServices } from '../../services/similarservices/similar.services';
import { notificationsServices } from '../notifications/notifications.services';
import { postRequestServices } from '../postrequests/postrequests.service';
import { socialProfessionalServices } from '../social/socialprofessional.services';

class ProfessionalPostServices {
    public async savePost(body: any, typePost: any) {
        try {
            let rta = null
            const postToSave = new professionalPostModel(body);

            if (typePost != 1 && body.professionalCommunityID != undefined) {
                postToSave.isEnabled = false
            }

            if (typePost) {
                postToSave.typePost = typePost
            }
            let postSaved = await postToSave.save();

            if (postSaved) {
                if (typePost != 1 && body.professionalCommunityID != undefined) {
                    const dataPostReques = {
                        professionalCommunityID: postSaved.professionalCommunityID,
                        professionalPostID: postSaved.id,
                        postingProfessionalID: postSaved.professionalProfileID
                    }
                    await postRequestServices.savePostRequest(dataPostReques)
                }

                if (postSaved.taggedUsers.length > 0) {
                    await notificationsServices.sendNotificationProffesionalTaggedUsers(postSaved)
                }

                rta = await professionalPostModel.findById(postSaved.id)
                    .populate('postIDS')
                    .populate('taggedUsers')
                    .populate('professionalProfileID')
                    .populate('professionalCommunityID')
            } else {
                throw ConstantsRS.ERROR_SAVING_RECORD;
            }

            return rta ? rta : null
        } catch (error) {
            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async savePostTypeTwo(body: any, ids: any, typePost: any) {
        try {
            let rta = null
            const postToSaved = new professionalPostModel(body);
            if (typePost != 1 && body.professionalCommunityID != undefined) {
                postToSaved.isEnabled = false
            }
            postToSaved.postIDS = ids
            postToSaved.typePost = typePost
            let postSaved = await postToSaved.save();
            if (postSaved) {
                if (typePost != 1 && postSaved.professionalCommunityID != undefined) {
                    const dataPostReques = {
                        professionalCommunityID: postSaved.professionalCommunityID,
                        professionalPostID: postSaved.id,
                        postingProfessionalID: postSaved.professionalProfileID
                    }
                    await postRequestServices.savePostRequest(dataPostReques)
                }

                if (postSaved.taggedUsers.length > 0) {
                    await notificationsServices.sendNotificationProffesionalTaggedUsers(postSaved)
                }

                rta = await professionalPostModel.findById(postSaved.id)
                    .populate('postIDS')
                    .populate('taggedUsers')
                    .populate('professionalProfileID')
                    .populate('professionalCommunityID')
            }
            return rta ? rta : null
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async getPostsByUserID(professionalProfileID: string, visitorID: string) {
        try {
            let posts = []
            const professional = await professioalProfileModel.findOne({
                $and: [
                    { _id: professionalProfileID },
                    { isEnabled: true }
                ]
            })

            if (professional) {
                let isVisitor = professionalProfileID != visitorID;
                let privacyAllowed: any = [0, 1, 2]
                if (isVisitor) {
                    let socialConnection = await socialProfessionalServices.getSocialConnectionByIDS(professionalProfileID, visitorID)
                    if (!socialConnection.code) {
                        if (!socialConnection.areContacts) {
                            privacyAllowed = [0]
                        } else if (socialConnection.areContacts) {
                            privacyAllowed = [0, 2]
                        }
                    } else {
                        privacyAllowed = [0]
                    }
                }

                posts = await professionalPostModel.find({
                    $or: [
                        { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] }
                    ]
                })
                    .populate({
                        path: 'postIDS',
                        model: 'ProfessionalPosts',
                        match: { isEnabled: true },
                        populate: [
                            {
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }
                            },
                            {
                                path: 'taggedUsers',
                                model: 'ProfessionalProfiles',
                            },
                            {
                                path: 'professionalProfileID',
                                model: 'ProfessionalProfiles',
                            }
                        ]
                    })
                    .populate({
                        path: 'postIDContent',
                        model: 'ProfessionalPosts',
                        match: { isEnabled: true },
                        populate: [
                            {
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }
                            },
                            {
                                path: 'professionalProfileID',
                                model: 'ProfessionalProfiles',
                            },
                            {
                                path: 'postIDS',
                                model: 'ProfessionalPosts',
                                match: { isEnabled: true },
                                populate: [
                                    {
                                        path: 'reactionsIDS',
                                        model: 'UserReactions',
                                        match: { isEnabled: true },
                                        populate: {
                                            path: 'professionalProfileID',
                                            model: 'ProfessionalProfiles',
                                        }
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'ProfessionalProfiles',
                                    }
                                ]
                            }
                        ]
                    })
                    .populate({
                        path: 'taggedUsers',
                        model: 'ProfessionalProfiles',
                    })
                    .populate('professionalProfileID')
                    .populate({
                        path: 'reactionsIDS',
                        model: 'UserReactions',
                        match: { isEnabled: true },
                        populate: {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles',
                        }
                    })
                    .populate({
                        path: 'reportID',
                        model: 'PostsReports',
                        match: { isEnabled: true }
                    })
                    .sort('-publicactionDate')
            }
            return posts
        } catch (error) {
            console.log(error);
        }
    }

    public async updatePost(obj: any) {
        try {
            let updateToPostID
            const getPost = await professionalPostModel.findOne({ _id: obj.id })
            if (getPost) {
                const updatePost = new professionalPostModel(getPost)
                updatePost.description = obj.description
                if (obj.taggedUsers != undefined && obj.taggedUsers.length > 0) {
                    updatePost.taggedUsers = obj.taggedUsers
                }
                updateToPostID = await professionalPostModel.findOneAndUpdate({ _id: obj.id }, updatePost, { new: true })
                if (updateToPostID) {
                    await notificationsServices.sendNotificationProffesionalTaggedUsers(updateToPostID)
                }
            }
            return updateToPostID
        } catch (error) {
            console.log(error);
        }
    }

    public async deletePost(obj: any) {
        try {
            let deletePostID
            const deleteToPostID = await professionalPostModel.findOneAndUpdate({ _id: obj.id }, { isEnabled: false }, { new: true })
            if (deleteToPostID) {
                deletePostID = deleteToPostID
            }
            return deletePostID
        } catch (error) {
            console.log(error);
        }
    }

    public async postByID(postID: string, visitorID: string = "") {
        let ownerID, isVisitor, privacyAllowed, post
        let postExist = await professionalPostModel.findById(postID)

        if (postExist) {
            if (postExist.professionalProfileID != undefined) {
                isVisitor = postExist.professionalProfileID != visitorID
                ownerID = postExist.professionalProfileID
            } else if (postExist.trademarkID) {
                isVisitor = postExist.trademarkID != visitorID
                ownerID = postExist.trademarkID
            }

            let privacyAllowed: any = [0, 1, 2]
            if (isVisitor) {
                let socialConnection = await socialProfessionalServices.getSocialConnectionByIDS(ownerID, visitorID)
                if (!socialConnection.code) {
                    if (!socialConnection.areContacts) {
                        privacyAllowed = [0]
                    } else if (socialConnection.areContacts) {
                        privacyAllowed = [0, 2]
                    }
                } else {
                    privacyAllowed = [0]
                }
            }

            post = await professionalPostModel.findOne({
                $and: [
                    { _id: postID },
                    { privacy: { $in: privacyAllowed } }
                ]
            })
                .populate({
                    path: 'postIDS',
                    model: 'ProfessionalPosts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }
                            ]
                        },
                    ]
                })
                .populate({
                    path: 'taggedUsers',
                    model: 'ProfessionalProfiles',
                })
                .populate('professionalProfileID')
                .populate('professionalCommunityID')
                .populate({
                    path: 'postIDContent',
                    model: 'Posts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles'
                        },
                        {
                            path: 'taggedUsers',
                            model: 'ProfessionalProfiles'
                        },
                        {
                            path: 'professionalCommunityID',
                            model: 'ProfessionalCommunities',
                            match: { isEnabled: true }
                        },
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles'
                                },
                                {
                                    path: 'professionalCommunityID',
                                    model: 'ProfessionalCommunities',
                                    match: { isEnabled: true }
                                }]
                        },
                    ]
                })
                .populate({
                    path: 'reactionsIDS',
                    model: 'UserReactions',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles',
                        }
                    ]
                })
                .populate({
                    path: 'reportID',
                    model: 'PostsReports',
                    match: { isEnabled: true }
                })
        }

        return post
    }

    public async postByIDForShare(postID: string) {
        try {
            let post
            post = await professionalPostModel.findOne({ _id: postID })
                .populate({
                    path: 'postIDContent',
                    model: 'ProfessionalPosts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles',
                        }
                    ]
                })
                .populate('taggedUsers')
                .populate('albumsIDS')
                .populate('professionalProfileID')
                .populate({
                    path: 'reportID',
                    model: 'PostsReports',
                    match: { isEnabled: true }
                })
            return post
        } catch (error) {
            console.log(error);

        }
    }

    public async setReactionsNReports(body: any, posts: any) {
        posts.filter((obj: any) => {
            if (obj.reactionsIDS.length > 0) {
                obj.reactionsIDS.filter((reacts: any) => {
                    if (reacts.professionalProfileID._id == body.visitorID) {
                        obj.myReaction = {
                            professionalProfileID: reacts.professionalProfileID._id,
                            value: reacts.value
                        }
                    }
                })
            }

            if (obj.postIDS.length > 0) {
                obj.postIDS.filter((post: any) => {
                    post.reactionsIDS.filter((reacts: any) => {
                        if (reacts.professionalProfileID._id == body.visitorID) {
                            post.myReaction = {
                                professionalProfileID: reacts.professionalProfileID._id,
                                value: reacts.value
                            }
                        }
                    })
                })
            }

            if (obj.reportID != undefined) {
                if (obj.reportID.reportingEntitiesIDS.length > 0) {
                    obj.reportID.reportingEntitiesIDS.filter((reportingUser: any) => {
                        if (reportingUser == body.visitorID) {
                            obj.myReport = true
                        }
                    })
                }
            }

            if (obj.postIDContent != undefined) {
                if (obj.postIDContent.reactionsIDS.length > 0) {
                    obj.postIDContent.reactionsIDS.filter((reacts: any) => {
                        if (reacts.userID != undefined) {
                            if (reacts.userID._id == body.visitorID) {
                                obj.myReaction = {
                                    userID: reacts.userID._id,
                                    value: reacts.value
                                }
                            }
                        }
                    })
                }
            }
        })

        return posts
    }

    public async disableOrEnablePostNotificationsProfessional(postId: string, flag: Boolean) {
        try {
            let updatePost
            const getpost = await this.postByID(postId)
            if (getpost) {
                if (getpost.disableNotifications != undefined) {
                    updatePost = await professionalPostModel.findOneAndUpdate({ _id: getpost.id }, { disableNotifications: flag }, { new: true })
                }
            }
            return updatePost
        } catch (error) {
            console.log(error);
        }
    }

    public async getPostsByCommunityID(body: any) {
        try {
            let posts;
            posts = await professionalPostModel.find({
                $or: [
                    { $and: [{ professionalCommunityID: body.communityId }, { typePost: 0 }, { isEnabled: true }] },
                    { $and: [{ professionalCommunityID: body.communityId }, { typePost: 2 }, { isEnabled: true }] },
                    { $and: [{ professionalCommunityID: body.communityId }, { typePost: 3 }, { isEnabled: true }] },
                    { $and: [{ professionalCommunityID: body.communityId }, { typePost: 4 }, { isEnabled: true }] },
                    { $and: [{ taggedUsers: { $in: [body.communityId] } }, { typePost: 0 }, { isEnabled: true }] },
                    { $and: [{ taggedUsers: { $in: [body.communityId] } }, { typePost: 2 }, { isEnabled: true }] },
                    { $and: [{ taggedUsers: { $in: [body.communityId] } }, { typePost: 3 }, { isEnabled: true }] },
                    { $and: [{ taggedUsers: { $in: [body.communityId] } }, { typePost: 4 }, { isEnabled: true }] },
                ]
            })
                .populate({
                    path: 'postIDS',
                    model: 'Posts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }]
                        },
                    ]
                })
                .populate({
                    path: 'postIDContent',
                    model: 'Posts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }]
                        },
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles',
                        }
                    ]
                })
                .populate({
                    path: 'taggedUsers',
                    model: 'ProfessionalProfiles',
                })
                .populate('albumsIDS')
                .populate('communityID')
                .populate({
                    path: 'reportID',
                    model: 'PostsReports',
                    match: { isEnabled: true }
                })
                .populate('professionalProfileID')
                .sort('-publicactionDate')
            return posts
        } catch (error) {
            console.log(error);
        }
    }

    public async getPostsByIDForHome(professionalProfileID: string, privacyAllowed: any) {
        let posts = []
        let convertdate = moment(Date.now()).subtract(3, 'd').toDate();
        const professional = await similarServices.identifyUserBrandOrCommunity(professionalProfileID)

        if (!professional.code && professional.isEnabled) {
            if (professional.lastPost != undefined) {
                convertdate = moment(professional.lastPost).subtract(3, 'd').toDate();
            }

            posts = await professionalPostModel.find({
                $or: [
                    { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ professionalProfileID: professionalProfileID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] },
                    { $and: [{ taggedUsers: { $in: [professionalProfileID] } }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { professionalCommunityID: undefined }] }
                ]
            })
                .populate({
                    path: 'postIDS',
                    model: 'ProfessionalPosts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: {
                                path: 'professionalProfileID',
                                model: 'ProfessionalProfiles',
                            }
                        },
                    ]
                })
                .populate({
                    path: 'postIDContent',
                    model: 'ProfessionalPosts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: {
                                path: 'professionalProfileID',
                                model: 'ProfessionalProfiles',
                            }
                        },
                        {
                            path: 'professionalProfileID',
                            model: 'ProfessionalProfiles',
                        }
                    ]
                })
                .populate({
                    path: 'taggedUsers',
                    model: 'ProfessionalProfiles',
                })
                .populate('professionalProfileID')
                .populate({
                    path: 'reactionsIDS',
                    model: 'UserReactions',
                    match: { isEnabled: true },
                    populate: {
                        path: 'professionalProfileID',
                        model: 'ProfessionalProfiles',
                    }
                })
                .populate({
                    path: 'reportID',
                    model: 'PostsReports',
                    match: { isEnabled: true }
                })
                .sort('-publicactionDate')
        }
        return posts
    }

    public async getPostsByIDForHomeMe(entityID: string) {
        let convertdate = moment(Date.now()).subtract(3, 'd').toDate();
        let posts
        const entity = await similarServices.identifyUserBrandOrCommunity(entityID)

        if (entity.code == undefined && entity.isEnabled == true) {
            if (entity.lastPost != undefined) {
                convertdate = moment(entity.lastPost).subtract(3, 'd').toDate();
            }

            switch (entity.type) {
                case "professional":
                    posts = await professionalPostModel.find({
                        $or: [
                            { $and: [{ professionalProfileID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { professionalCommunityID: undefined }] },
                            { $and: [{ professionalProfileID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { professionalCommunityID: undefined }] },
                            { $and: [{ professionalProfileID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { professionalCommunityID: undefined }] },
                            { $and: [{ professionalProfileID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { professionalCommunityID: undefined }] }
                        ]
                    })
                        .populate({
                            path: 'postIDS',
                            model: 'ProfessionalPosts',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'reactionsIDS',
                                    model: 'UserReactions',
                                    match: { isEnabled: true },
                                    populate: {
                                        path: 'professionalProfileID',
                                        model: 'ProfessionalProfiles',
                                    }
                                },
                            ]
                        })
                        .populate({
                            path: 'postIDContent',
                            model: 'ProfessionalPosts',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'reactionsIDS',
                                    model: 'UserReactions',
                                    match: { isEnabled: true },
                                    populate: {
                                        path: 'professionalProfileID',
                                        model: 'ProfessionalProfiles',
                                    }
                                },
                                {
                                    path: 'professionalProfileID',
                                    model: 'ProfessionalProfiles',
                                }
                            ]
                        })
                        .populate({
                            path: 'taggedUsers',
                            model: 'ProfessionalProfiles',
                        })
                        .populate('professionalProfileID')
                        .populate({
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: {
                                path: 'professionalProfileID',
                                model: 'ProfessionalProfiles',
                            }
                        })
                        .populate({
                            path: 'reportID',
                            model: 'PostsReports',
                            match: { isEnabled: true }
                        })
                        .sort('-publicactionDate')
                    break;
            }
        }
        return posts
    }
}

export const professionalPostServices = new ProfessionalPostServices()