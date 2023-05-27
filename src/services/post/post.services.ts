import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
const postModel = require('../../models/post/Posts.model');
const professionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');
const communityModel = require('../../models/communities/Communities.model');

import { similarServices } from '../../services/similarservices/similar.services';
import { notificationsServices } from '../notifications/notifications.services';
import { userChallengeServices } from '../userchallenges/userchallenges.services';
import { postRequestServices } from '../postrequests/postrequests.service';
import { userRankServices } from '../userranks/userranks.service';
import { brandRankingServices } from '../brandranking/brandranking.service';
import { socialServices } from '../social/social.services';
import { pointsByPostService } from '../Admin/pointsByPost/pointsByPost.service';

class PostServices {
    public async getPostsByUserID(entityID: string, visitorID: string) {
        try {
            let posts;
            const entity = await similarServices.identifyUserBrandOrCommunity(entityID)
            if (entity.code == undefined && entity.isEnabled == true) {
                let isVisitor = entityID != visitorID;
                let privacyAllowed: any = [0, 1, 2]
                if (isVisitor) {
                    let socialConnection = await socialServices.getSocialConnectionByIDS(entityID, visitorID)
                    if (!socialConnection.code) {
                        if (!socialConnection.areFriends) {
                            privacyAllowed = [0]
                        } else if (socialConnection.areFriends) {
                            privacyAllowed = [0, 2]
                        }
                    } else {
                        privacyAllowed = [0]
                    }
                }

                switch (entity.type) {
                    case "user":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ userID: entityID }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ userID: entityID }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ userID: entityID }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ userID: entityID }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] }
                            ]
                        }).populate({
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
                                            path: 'userID',
                                            model: 'Users',
                                            populate: [
                                                {
                                                    path: 'rankID',
                                                    model: 'Ranks',
                                                }
                                            ]
                                        },
                                        {
                                            path: 'trademarkID',
                                            model: 'Trademarks',
                                        },
                                        {
                                            path: 'communityID',
                                            model: 'Communities',
                                        }]
                                },
                                {
                                    path: 'taggedUsers',
                                    model: 'Users',
                                },
                                {
                                    path: 'taggedTrademarks',
                                    model: 'Trademarks',
                                }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks',
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks',
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate('taggedUsers')
                            .populate('albumsIDS')
                            .populate({
                                path: 'userID',
                                model: 'Users',
                                populate: [
                                    {
                                        path: 'rankID',
                                        model: 'Ranks',
                                    }
                                ]
                            })
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks',
                                        }
                                    ]
                                }
                            })
                            .populate({
                                path: 'reportID',
                                model: 'PostsReports',
                                match: { isEnabled: true }
                            })
                            .sort('-publicactionDate')
                        break;
                    case "marks":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ trademarkID: entityID }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 2 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 3 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 4 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks',
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks',
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks',
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate('taggedUsers')
                            .populate('albumsIDS')
                            .populate('userID')
                            .populate('trademarkID')
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: [
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks',
                                            }
                                        ]
                                    }
                                ]
                            })
                            .populate({
                                path: 'reportID',
                                model: 'PostsReports',
                                match: { isEnabled: true }
                            })
                            .populate('pointsByPostID')
                            .sort('-publicactionDate')
                        break;
                }
            }

            posts = posts.filter((x: any) => x.communityID == undefined)

            return posts
        } catch (error) {
            console.log(error);
        }
    }

    public async getPostsByCommunityID(body: any) {
        try {
            let posts;
            posts = await postModel.find({
                $or: [
                    { $and: [{ communityID: body.communityId }, { typePost: 0 }, { isEnabled: true }] },
                    { $and: [{ communityID: body.communityId }, { typePost: 2 }, { isEnabled: true }] },
                    { $and: [{ communityID: body.communityId }, { typePost: 3 }, { isEnabled: true }] },
                    { $and: [{ communityID: body.communityId }, { typePost: 4 }, { isEnabled: true }] },
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
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks',
                                        }
                                    ]
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                },
                                {
                                    path: 'communityID',
                                    model: 'Communities',
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
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks',
                                        }
                                    ]
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                },
                                {
                                    path: 'communityID',
                                    model: 'Communities',
                                }]
                        },
                        {
                            path: 'userID',
                            model: 'Users',
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks',
                                }
                            ]
                        },
                        {
                            path: 'trademarkID',
                            model: 'Trademarks',
                        },
                        {
                            path: 'taggedUsers',
                            model: 'Users',
                            populate: {
                                path: 'rankID',
                                model: 'Ranks'
                            }
                        },
                        {
                            path: 'communityID',
                            model: 'Communities',
                        }
                    ]
                })
                .populate({
                    path: 'taggedUsers',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks'
                    }
                })
                .populate('albumsIDS')
                .populate({
                    path: 'userID',
                    model: 'Users',
                    populate: [
                        {
                            path: 'rankID',
                            model: 'Ranks',
                        }
                    ]
                })
                .populate('communityID')
                .populate('trademarkID')
                .populate({
                    path: 'reactionsIDS',
                    model: 'UserReactions',
                    match: { isEnabled: true },
                    populate: {
                        path: 'userID',
                        model: 'Users',
                        populate: [
                            {
                                path: 'rankID',
                                model: 'Ranks',
                            }
                        ]
                    }
                })
                .populate({
                    path: 'reportID',
                    model: 'PostsReports',
                    match: { isEnabled: true }
                })
                .sort('-publicactionDate')
            return posts
        } catch (error) {
            console.log(error);
        }
    }

    public async savePost(body: any, typePost: any) {
        try {
            let rta = null, communityExist

            if (body.communityID != undefined && body.communityID == "") {
                delete body.communityID
            }

            const postToSave = new postModel(body);

            if (body.communityID != undefined) {
                if (typePost != 1 && body.communityID != "") {
                    communityExist = await communityModel.findById(body.communityID)
                    if (communityExist) {
                        if (body.userID != communityExist.userID && communityExist.filterPost == true) {
                            postToSave.isEnabled = false
                        }
                    }
                }
            }

            if (typePost) {
                postToSave.typePost = typePost
            }
            let postSaved = await postToSave.save();

            if (postSaved) {
                rta = await postModel.findById(postSaved.id)
                    .populate('postIDS')
                    .populate('userID')
                    .populate({
                        path: 'taggedUsers',
                        model: 'Users',
                        populate: [
                            {
                                path: 'rankID',
                                model: 'Ranks'
                            }
                        ]
                    })
                    .populate('trademarkID')
                    .populate('communityID')

                if (postSaved.taggedUsers.length > 0) {
                    await notificationsServices.sendNotificationTaggedUsers(postSaved)
                }

                if (typePost != 1 && body.communityID != undefined && communityExist != undefined) {
                    if (body.userID != communityExist.userID && communityExist.filterPost == true) {
                        const dataPostReques = {
                            communityID: rta.communityID,
                            postID: rta.id,
                            postingUserID: rta.userID
                        }
                        await postRequestServices.savePostRequest(dataPostReques)
                    }
                }
            } else {
                throw ConstantsRS.ERROR_SAVING_RECORD;
            }

            return rta ? rta : null;
        } catch (error) {
            console.log(error);

            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async savePostTypeTwo(body: any, ids: any, typePost: any) {
        try {
            let rta = null, communityExist
            if (body.communityID != undefined && body.communityID != "") {
                delete body.communityID
            }

            const postToSaved = new postModel(body);

            if (body.communityID != undefined) {
                if (typePost != 1 && body.communityID != "") {
                    communityExist = await communityModel.findById(body.communityID)
                    if (communityExist) {
                        if (body.userID != communityExist.userID && communityExist.filterPost == true) {
                            postToSaved.isEnabled = false
                        }
                    }
                }
            }
            postToSaved.postIDS = ids
            postToSaved.typePost = typePost
            let postSaved = await postToSaved.save();
            if (postSaved) {
                if (typePost != 1 && postSaved.communityID != undefined && communityExist != undefined) {
                    if (body.userID != communityExist.userID && communityExist.filterPost == true) {
                        const dataPostReques = {
                            communityID: postSaved.communityID,
                            postID: postSaved.id,
                            postingUserID: postSaved.userID
                        }
                        await postRequestServices.savePostRequest(dataPostReques)
                    }
                }

                if (postSaved.taggedUsers.length > 0) {
                    await notificationsServices.sendNotificationTaggedUsers(postSaved)
                }

                rta = await postModel.findById(postSaved.id)
                    .populate('postIDS')
                    .populate('userID')
                    .populate({
                        path: 'taggedUsers',
                        model: 'Users',
                        populate: [
                            {
                                path: 'rankID',
                                model: 'Ranks'
                            }
                        ]
                    })
                    .populate('trademarkID')
                    .populate('communityID')
            }
            return rta ? rta : null
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_SAVING_RECORD
        }

    }

    public async getPostsByIDForHome(entityID: string, privacyAllowed: any) {
        let posts: any = []
        let convertdate = moment(Date.now()).subtract(3, 'd').toDate();
        const entity = await similarServices.identifyUserBrandOrCommunity(entityID)

        if (!entity.code) {
            if (entity.isEnabled) {
                if (entity.lastPost != undefined) {
                    convertdate = moment(entity.lastPost).subtract(3, 'd').toDate();
                }

                switch (entity.type) {
                    case "user":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ userID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }, { communityID: undefined }] }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks',
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks',
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate('taggedUsers')
                            .populate('albumsIDS')
                            .populate('communityID')
                            .populate({
                                path: 'userID',
                                model: 'Users',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            })
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks'
                                        }
                                    ]
                                }
                            })
                            .populate({
                                path: 'reportID',
                                model: 'PostsReports',
                                match: { isEnabled: true }
                            })
                            .sort('-publicactionDate')
                        break;
                    case "marks":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ trademarkID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] },
                                { $and: [{ taggedUsers: { $in: [entityID] } }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { privacy: { $in: privacyAllowed } }] }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks'
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate('postIDS')
                            .populate('taggedUsers')
                            .populate('albumsIDS')
                            .populate('communityID')
                            .populate('trademarkID')
                            .populate('postIDContent')
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                }
                            })
                            .populate('pointsByPostID')
                            .sort('-publicactionDate')
                        break;
                }
            }
        }
        return posts
    }

    public async getPostsByIDForHomeMe(entityID: string, body: any) {
        try {
            let { limit, skip } = body;

            if (!limit) {
                limit = ConstantsRS.PACKAGE_LIMIT;
            }

            let convertdate = moment(Date.now()).subtract(3, 'd').toDate();
            let posts
            const entity = await similarServices.identifyUserBrandOrCommunity(entityID)

            if (entity.lastPost != undefined) {
                convertdate = moment(entity.lastPost).subtract(3, 'd').toDate();
            }

            if (entity.code == undefined && entity.isEnabled == true) {
                switch (entity.type) {
                    case "user":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ userID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { communityID: undefined }] },
                                { $and: [{ userID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }, { communityID: undefined }] }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks'
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks'
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate({
                                path: 'taggedUsers',
                                model: 'Users',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            })
                            .populate('albumsIDS')
                            .populate({
                                path: 'userID',
                                model: 'Users',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            })
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks'
                                        }
                                    ]
                                }
                            })
                            .populate({
                                path: 'reportID',
                                model: 'PostsReports',
                                match: { isEnabled: true }
                            })
                            .limit(limit).skip(skip)
                            .sort('-publicactionDate')
                        break;
                    case "marks":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ trademarkID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ trademarkID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] }
                            ]
                        })
                            .populate('postIDS')
                            .populate({
                                path: 'taggedUsers',
                                model: 'Users',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            })
                            .populate('albumsIDS')
                            .populate('trademarkID')
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                }
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks'
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            },
                                            {
                                                path: 'taggedTrademarks',
                                                model: 'Trademarks',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    },
                                    {
                                        path: 'taggedTrademarks',
                                        model: 'Trademarks',
                                    }
                                ]
                            })
                            .populate('pointsByPostID')
                            .limit(limit).skip(skip)
                            .sort('-publicactionDate')
                        break;
                    case "community":
                        posts = await postModel.find({
                            $or: [
                                { $and: [{ communityID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ communityID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ communityID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ communityID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] }
                            ]
                        })
                            .populate('postIDS')
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
                                                path: 'userID',
                                                model: 'Users',
                                                populate: [
                                                    {
                                                        path: 'rankID',
                                                        model: 'Ranks'
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'trademarkID',
                                                model: 'Trademarks',
                                            },
                                            {
                                                path: 'communityID',
                                                model: 'Communities',
                                            }]
                                    },
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    },
                                    {
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
                                                        path: 'userID',
                                                        model: 'Users',
                                                        populate: [
                                                            {
                                                                path: 'rankID',
                                                                model: 'Ranks'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        path: 'trademarkID',
                                                        model: 'Trademarks',
                                                    },
                                                    {
                                                        path: 'communityID',
                                                        model: 'Communities',
                                                    }]
                                            },
                                            {
                                                path: 'taggedUsers',
                                                model: 'Users',
                                            }
                                        ]
                                    },
                                    {
                                        path: 'taggedUsers',
                                        model: 'Users',
                                    }
                                ]
                            })
                            .populate({
                                path: 'taggedUsers',
                                model: 'Users',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            })
                            .populate('albumsIDS')
                            .populate('communityID')
                            .populate({
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: {
                                    path: 'communityID',
                                    model: 'Communities',
                                }
                            })
                            .limit(limit).skip(skip)
                            .sort('-publicactionDate')
                        break;
                    case "professional":
                        posts = await professionalPostModel.find({
                            $or: [
                                { $and: [{ professionalProfileID: entityID }, { typePost: 0 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ professionalProfileID: entityID }, { typePost: 2 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ professionalProfileID: entityID }, { typePost: 3 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] },
                                { $and: [{ professionalProfileID: entityID }, { typePost: 4 }, { isEnabled: true }, { publicactionDate: { $gte: convertdate } }] }
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
                            .populate('taggedUsers')
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
                            .limit(limit).skip(skip)
                            .sort('-publicactionDate')
                        break;
                }
            }
            return posts
        } catch (error) {
            console.log(error);

        }
    }

    public async updatePostID(obj: any) {
        try {
            let updateToPostID
            const getPost = await postModel.findOne({ _id: obj.PostID })
            if (getPost) {
                updateToPostID = await postModel.findOneAndUpdate({ _id: getPost.id }, obj, { new: true }).populate({
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
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks'
                                        }
                                    ]
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                },
                                {
                                    path: 'communityID',
                                    model: 'Communities',
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
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
                                    }]
                            },
                            {
                                path: 'userID',
                                model: 'Users',
                                populate: [
                                    {
                                        path: 'rankID',
                                        model: 'Ranks'
                                    }
                                ]
                            },
                            {
                                path: 'trademarkID',
                                model: 'Trademarks',
                            },
                            {
                                path: 'communityID',
                                model: 'Communities',
                            }
                        ]
                    })
                    .populate('taggedUsers')
                    .populate('albumsIDS')
                    .populate('userID')
                    .populate({
                        path: 'reactionsIDS',
                        model: 'UserReactions',
                        match: { isEnabled: true },
                        populate: {
                            path: 'userID',
                            model: 'Users',
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            ]
                        }
                    })
                    .populate({
                        path: 'reportID',
                        model: 'PostsReports',
                        match: { isEnabled: true }
                    })

                if (obj.taggedUsers.length > 0) {
                    await notificationsServices.sendNotificationTaggedUsers(updateToPostID)
                }
            }
            return updateToPostID
        } catch (error) {
            console.log(error);
        }
    }

    public async deletePostID(obj: any) {
        try {
            let rta, rtaError

            const postExist = await postModel.findById(obj.PostID).populate("postIDS")

            if (postExist) {
                const deleteToPostID = await postModel.findOneAndUpdate({ _id: obj.PostID }, { isEnabled: false }, { new: true });
                if (deleteToPostID) {
                    let entityID
                    if (postExist.typePost == 2) {
                        for await (let post of postExist.postIDS) {
                            entityID = post.userID ? post.userID : post.trademarkID
                            let subPostDeleted = await postModel.findOneAndUpdate({ _id: post.id }, { isEnabled: false }, { new: true });
                            if (subPostDeleted) {
                                if (post.imgAndOrVideos.type.indexOf('image') >= 0) {
                                    if (post.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, post.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, post.id)
                                    } else if (post.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, post.id)
                                    }
                                } else if (post.imgAndOrVideos.type.indexOf('video') >= 0) {
                                    if (post.userID != undefined) {
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, post.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, post.id)
                                    } else if (post.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, post.id)
                                    }
                                } else if (post.imgAndOrVideos.type.indexOf('audio') >= 0) {
                                    if (post.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, post.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, post.id)
                                    } else if (post.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, post.id)
                                    }
                                }
                            }
                        }
                    } else if (postExist.typePost == 4) {
                        entityID = postExist.userID ? postExist.userID : postExist.trademarkID
                        const sharedPostExist = await postModel.findById(postExist.postIDContent).populate("postIDS")
                        if (sharedPostExist) {
                            if (sharedPostExist.typePost == 2) {
                                let imagesShared = 0, videosShared = 0
                                for await (let post of sharedPostExist.postIDS) {
                                    if (post.imgAndOrVideos.type.indexOf('image') >= 0) {
                                        imagesShared = imagesShared + 1
                                    } else if (post.imgAndOrVideos.type.indexOf('video') >= 0) {
                                        videosShared = videosShared + 1
                                    }
                                }

                                if (imagesShared > 0) {
                                    if (postExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, postExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, postExist.id)
                                    }

                                    if (sharedPostExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.userID, sharedPostExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.userID, sharedPostExist.id)
                                    } else if (sharedPostExist.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.trademarkID, sharedPostExist.id)
                                    }
                                }
                                if (videosShared > 0) {
                                    if (postExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, postExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, postExist.id)
                                    }

                                    if (sharedPostExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.userID, sharedPostExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.userID, sharedPostExist.id)
                                    } else if (sharedPostExist.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.trademarkID, sharedPostExist.id)
                                    }
                                }
                            } else {
                                if (sharedPostExist.imgAndOrVideos != undefined) {
                                    if (sharedPostExist.imgAndOrVideos.type.indexOf('image') >= 0) {
                                        if (postExist.userID != undefined) { // Usuario
                                            // Restar avance de retos
                                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, postExist.id)
                                            // Restar avance de ranking
                                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, postExist.id)
                                        }

                                        if (sharedPostExist.userID != undefined) { // Usuario
                                            // Restar avance de retos
                                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.userID, sharedPostExist.id)
                                            // Restar avance de ranking
                                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.userID, sharedPostExist.id)
                                        } else if (sharedPostExist.trademarkID != undefined) { // Marca
                                            // Restar avance de ranking
                                            await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, sharedPostExist.trademarkID, sharedPostExist.id)
                                        }
                                    } else if (sharedPostExist.imgAndOrVideos.type.indexOf('video') >= 0) {
                                        if (postExist.userID != undefined) { // Usuario
                                            // Restar avance de retos
                                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, postExist.id)
                                            // Restar avance de ranking
                                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, postExist.id)
                                        }

                                        if (sharedPostExist.userID != undefined) { // Usuario
                                            // Restar avance de retos
                                            await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.userID, sharedPostExist.id)
                                            // Restar avance de ranking
                                            await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.userID, sharedPostExist.id)
                                        } else if (sharedPostExist.trademarkID != undefined) { // Marca
                                            // Restar avance de ranking
                                            await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, sharedPostExist.trademarkID, sharedPostExist.id)
                                        }
                                    }
                                } else {
                                    // Restar avance de retos
                                    if (postExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code, entityID, postExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code, entityID, postExist.id)
                                    }

                                    if (sharedPostExist.userID != undefined) { // Usuario
                                        // Restar avance de retos
                                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, sharedPostExist.userID, sharedPostExist.id)
                                        // Restar avance de ranking
                                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, sharedPostExist.userID, sharedPostExist.id)
                                    } else if (sharedPostExist.trademarkID != undefined) { // Marca
                                        // Restar avance de ranking
                                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, sharedPostExist.trademarkID, sharedPostExist.id)
                                    }
                                }
                            }

                            // Shared counter
                            await postModel.updateOne({ _id: sharedPostExist.id }, { shareds: (sharedPostExist.shareds - 1) });

                            if (postExist.userID != undefined) {
                                // Restar puntos otorgados al compartir publicación
                                await pointsByPostService.addSubstractPointsToUserIdShare(sharedPostExist.id, entityID, "substract")
                            }
                        } else {
                            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                        }
                    } else {
                        entityID = postExist.userID ? postExist.userID : postExist.trademarkID
                        if (postExist.imgAndOrVideos != undefined) {
                            if (postExist.imgAndOrVideos.type.indexOf('image') >= 0) {
                                if (postExist.userID != undefined) { // Usuario
                                    // Restar avance de retos
                                    await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, postExist.id)
                                    // Restar avance de ranking
                                    await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, postExist.id)
                                } else if (postExist.trademarkID != undefined) { // Marca
                                    // Restar avance de ranking
                                    await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, postExist.id)
                                }
                            } else if (postExist.imgAndOrVideos.type.indexOf('video') >= 0) {
                                if (postExist.userID != undefined) { // Usuario
                                    // Restar avance de retos
                                    await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, postExist.id)
                                    // Restar avance de ranking
                                    await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, postExist.id)
                                } else if (postExist.trademarkID != undefined) { // Marca
                                    // Restar avance de ranking
                                    await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, postExist.id)
                                }
                            } else if (postExist.imgAndOrVideos.type.indexOf('audio') >= 0) {
                                if (postExist.userID != undefined) { // Usuario
                                    // Restar avance de retos
                                    await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, postExist.id)
                                    // Restar avance de ranking
                                    await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, postExist.id)
                                } else if (postExist.trademarkID != undefined) { // Marca
                                    // Restar avance de ranking
                                    await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, postExist.id)
                                }
                            }
                        } else {
                            if (postExist.userID != undefined) { // Usuario
                                // Restar avance de retos
                                await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, postExist.id)
                                // Restar avance de ranking
                                await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, postExist.id)
                            } else if (postExist.trademarkID != undefined) { // Marca
                                // Restar avance de ranking
                                await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, postExist.id)
                            }
                        }
                    }

                    rta = deleteToPostID
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
        }
    }

    public async createPost(body: any) {
        let imgAndOrVideosGif = body.imgAndOrVideosGif, rtaSave, rtaError, rta, success = false
        let model: any, entityID

        if (body.userID != undefined) {
            entityID = body.userID
            model = "user"
        } else if (body.trademarkID != undefined) {
            entityID = body.trademarkID
            model = "mark"
        } else if (body.communityID != undefined) {
            entityID = body.communityID
            model = "community"
        }

        const userExist = await similarServices.identifyUserBrandOrCommunity(entityID)
        if (!userExist.code) {
            // nesscessary to points by post
            body = { ...body, model };

            if (body.postIDContent != undefined) { // Se comparte el post
                const postExist = await postModel.findById(body.postIDContent)
                    .populate("postIDS")
                    .populate("userID")

                if (postExist) { // Si existe el post a compartir
                    rtaSave = await this.savePost(body, 4)

                    if (!rtaSave.code) {
                        let sharedUser = postExist.userID != undefined ? postExist.userID.id : postExist.trademarkID

                        if (postExist.typePost == 2) { // Si el post compartido tiene varios archivos multimedia
                            let imagesShared = 0, videosShared = 0
                            for await (let post of postExist.postIDS) {
                                if (post.imgAndOrVideos.type.indexOf('image') >= 0) {
                                    imagesShared = imagesShared + 1
                                } else if (post.imgAndOrVideos.type.indexOf('video') >= 0) {
                                    videosShared = videosShared + 1
                                }
                            }

                            if (entityID != sharedUser) {
                                if (imagesShared > 0) {
                                    if (userExist.type == "user") { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, rtaSave.id)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, rtaSave.id)
                                    }

                                    if (postExist.userID != undefined) { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.userID.id, rtaSave.postIDContent)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.userID.id, rtaSave.postIDContent)
                                    } else if (postExist.trademarkID != undefined) { // Marca
                                        // Sumar avance de ranking
                                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.trademarkID, rtaSave.postIDContent)
                                    }
                                }

                                if (videosShared > 0) {
                                    if (userExist.type == "user") { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, rtaSave.id)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, rtaSave.id)
                                    }

                                    if (postExist.userID != undefined) { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.userID.id, rtaSave.postIDContent)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.userID.id, rtaSave.postIDContent)
                                    } else if (postExist.trademarkID != undefined) { // Marca
                                        // Sumar avance de ranking
                                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.trademarkID, rtaSave.postIDContent)
                                    }
                                }
                            }
                        } else {
                            if (postExist.imgAndOrVideos != undefined) { // Si el post compartido tiene solo 1 archivo multimedia
                                if (entityID != sharedUser) {
                                    if (postExist.imgAndOrVideos.type.indexOf('image') >= 0) {
                                        if (userExist.type == "user") { // Usuario
                                            // Sumar avance de retos
                                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, rtaSave.id)
                                            // Sumar avance de ranking
                                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_IMAGE.code, entityID, rtaSave.id)
                                        }

                                        if (postExist.userID != undefined) { // Usuario
                                            // Sumar avance de retos
                                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.userID.id, rtaSave.postIDContent)
                                            // Sumar avance de ranking
                                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.userID.id, rtaSave.postIDContent)
                                        } else if (postExist.trademarkID != undefined) { // Marca
                                            // Sumar avance de ranking
                                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_IMAGE.code, postExist.trademarkID, rtaSave.postIDContent)
                                        }
                                    } else if (postExist.imgAndOrVideos.type.indexOf('video') >= 0) {
                                        if (userExist.type == "user") { // Usuario
                                            // Sumar avance de retos
                                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, rtaSave.id)
                                            // Sumar avance de ranking
                                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_VIDEO.code, entityID, rtaSave.id)
                                        }

                                        if (postExist.userID != undefined) { // Usuario
                                            // Sumar avance de retos
                                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.userID.id, rtaSave.postIDContent)
                                            // Sumar avance de ranking
                                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.userID.id, rtaSave.postIDContent)
                                        } else if (postExist.trademarkID != undefined) { // Marca
                                            // Sumar avance de ranking
                                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_VIDEO.code, postExist.trademarkID, rtaSave.postIDContent)
                                        }
                                    }
                                }
                            } else { // Si el post compartido es de solo texto
                                if (entityID != sharedUser) {
                                    if (userExist.type == "user") { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code, entityID, rtaSave.id)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_TEXT.code, entityID, rtaSave.id)
                                    }

                                    if (postExist.userID != undefined) { // Usuario
                                        // Sumar avance de retos
                                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, postExist.userID.id, rtaSave.postIDContent)
                                        // Sumar avance de ranking
                                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, postExist.userID.id, rtaSave.postIDContent)
                                    } else if (postExist.trademarkID != undefined) { // Marca
                                        // Sumar avance de ranking
                                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_SHARE_YOUR_TEXT.code, postExist.trademarkID, rtaSave.postIDContent)
                                    }
                                }
                            }
                        }

                        rta = await this.postByIDForShare(rtaSave.id)
                        // Shared counter
                        await postModel.updateOne({ _id: postExist.id }, { shareds: (postExist.shareds + 1) });
                        let sender
                        if (body.userID != undefined) {
                            sender = body.userID

                            const getPost = await postModel.findById(rtaSave.postIDContent)
                            if (getPost) {
                                await pointsByPostService.addSubstractPointsToUserIdShare(getPost.id, entityID, "add")
                            }
                        } else if (body.trademarkID != undefined) {
                            sender = body.trademarkID
                        }
                        if (postExist.disableNotifications != undefined && postExist.disableNotifications == false) {
                            let postOwner
                            if (postExist.userID != undefined) {
                                postOwner = postExist.userID
                            } else if (postExist.trademarkID != undefined) {
                                postOwner = postExist.trademarkID
                            }
                            const canInotifyValidate = await socialServices.canINotify({ firstID: sender, secondID: postOwner.id })
                            if (canInotifyValidate == false) {
                                await notificationsServices.sendNotificationSharePost(postExist, sender)
                            }
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                }
            } else {
                if (imgAndOrVideosGif.length == 0) { // Ningún contenido multimedia
                    rta = await this.savePost(body, 3)

                    if (!rta.code) {
                        if (userExist.type == "user") { // Usuario
                            // Sumar avance de reto
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, rta.id)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, rta.id)
                        } else if (userExist.type == "marks") { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_TEXT.code, entityID, rta.id)
                        }
                    }

                    await similarServices.changeLastPost(model, entityID)
                    rta ? success = true : success = false
                } else if (imgAndOrVideosGif.length == 1) { // solo 1 contenido multimedia                
                    let isGifValidate = body.imgAndOrVideosGif.find((gif: any) => gif.type === 'Gif');
                    if (isGifValidate) {
                        rta = await this.savePost(body, 0)
                        await similarServices.changeLastPost(model, entityID)
                        rta ? success = true : success = false
                    } else {
                        if (body.albumID) { // post dirigidos a albumes creados
                            const entity = await similarServices.identifyUMCWithAlbums(entityID)
                            let isAlbum = entity.albumsIDS.find((albm: any) => albm.id === body.albumID)
                            if (isAlbum) {
                                body.imgAndOrVideos = imgAndOrVideosGif[0]
                                body.albumsIDS.push(body.albumID);
                                if (body.isSaved != undefined && body.isSaved == true) {
                                    rta = await this.savePost(body, 1)
                                } else {
                                    rta = await this.savePost(body, 0)
                                }
                                await similarServices.changeLastPost(model, entityID)
                                rta ? success = true : success = false
                            } else {
                                rtaError = ConstantsRS.ERROR_SAVING_RECORD;
                            }
                        } else { // posts dirigidos a albumes por defecto
                            const entity = await similarServices.identifyUMCWithAlbums(entityID);
                            let isAlbum = null;
                            switch (body.typeCat) {
                                case 1:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos Subidas')
                                    break;
                                case 2:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos de Perfil')

                                    const dataToUpdate = {
                                        id: entityID,
                                        profilePicture: imgAndOrVideosGif[0]['url']
                                    };
                                    await similarServices.updateProfilePhoto(dataToUpdate, model)
                                    break;
                                /* case 3:
                                    isAlbum = user.albumsIDS.find((albm: any) =>  albm.name === 'Fotos de Portada')
                                    break; */
                                default:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos Subidas')
                                    break;
                            }

                            if (isAlbum) {
                                body.imgAndOrVideos = imgAndOrVideosGif[0];
                                body.albumsIDS.push(isAlbum.id);
                                body.albumID = isAlbum.id
                                rta = await this.savePost(body, 0)
                                await similarServices.changeLastPost(model, entityID)
                                rta ? success = true : success = false
                            } else {
                                rtaError = ConstantsRS.ERROR_SAVING_RECORD
                            }
                        }
                    }

                    if (!rta.code) {
                        if (rta.imgAndOrVideos.type.indexOf('image') >= 0) {
                            if (userExist.type == "user") { // Usuario
                                // Sumar avance de reto
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                            } else if (userExist.type == "marks") { // Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                            }
                        } else if (rta.imgAndOrVideos.type.indexOf('video') >= 0) {
                            if (userExist.type == "user") { // Usuario
                                // Sumar avance de reto
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                            } else if (userExist.type == "marks") { // Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                            }
                        } else if (rta.imgAndOrVideos.type.indexOf('audio') >= 0) {
                            if (userExist.type == "user") { // Usuario
                                // Sumar avance de reto
                                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                                // Sumar avance de ranking
                                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                            } else if (userExist.type == "marks") { // Marca
                                // Sumar avance de ranking
                                await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                            }
                        }
                    }
                } else { // Varios contenidos multimedia
                    let ids = []
                    for (let index = 0; index < imgAndOrVideosGif.length; index++) {
                        const postToSaved = new postModel(body);
                        if (body.albumID) {
                            const entity = await similarServices.identifyUMCWithAlbums(entityID)

                            let isAlbum = entity.albumsIDS.find((albm: any) => albm.id === body.albumID)
                            if (isAlbum) {
                                postToSaved.imgAndOrVideosGif = []
                                postToSaved.imgAndOrVideos = imgAndOrVideosGif[index]
                                //postToSaved.description = imgAndOrVideosGif[index].description
                                /* postToSaved.taggedUsers = []
                                if (imgAndOrVideosGif[index].taggedUsers.length > 0) {
                                    postToSaved.taggedUsers.push(imgAndOrVideosGif[index].taggedUsers)
                                } else {
                                    postToSaved.taggedUsers = []
                                } */
                                postToSaved.albumsIDS.push(body.albumID);
                                postToSaved.typePost = 1
                                postToSaved.desscription = ""
                                rta = await postToSaved.save();
                                ids.push(rta.id)
                            } else {
                                rtaError = ConstantsRS.ERROR_SAVING_RECORD
                            }
                        } else {
                            const postToSaved = new postModel(body);
                            const entity = await similarServices.identifyUMCWithAlbums(entityID)

                            let isAlbum
                            switch (body.typeCat) {
                                case 1:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos Subidas')
                                    break;
                                case 2:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos de Perfil')
                                    break;
                                /* case 3:
                                    isAlbum = user.albumsIDS.find((albm: any) =>  albm.name === 'Fotos de Portada')
                                    break; caso 3*/
                                default:
                                    isAlbum = entity.albumsIDS.find((albm: any) => albm.name === 'Fotos Subidas')
                                    break;
                            }
                            if (isAlbum) {

                                postToSaved.imgAndOrVideosGif = []
                                postToSaved.imgAndOrVideos = imgAndOrVideosGif[index]
                                //postToSaved.description = imgAndOrVideosGif[index].description
                                /* postToSaved.taggedUsers = []
                                if (imgAndOrVideosGif[index].taggedUsers.length > 0) {
                                    postToSaved.taggedUsers.push(imgAndOrVideosGif[index].taggedUsers)
                                } else {
                                    postToSaved.taggedUsers = []
                                } */
                                postToSaved.albumsIDS.push(isAlbum.id);
                                body.albumID = isAlbum.id
                                postToSaved.typePost = 1
                                postToSaved.description = "";
                                try {
                                    rta = await postToSaved.save();
                                } catch (error) {
                                    console.log(error)
                                    success = false;
                                    return error;
                                }
                                ids.push(rta.id)
                            } else {
                                rtaError = ConstantsRS.ERROR_SAVING_RECORD
                            }
                        }

                        if (rta) { // Sumar avance de reto
                            if (rta.imgAndOrVideos.type.indexOf('image') >= 0) {
                                if (userExist.type == "user") { // Usuario
                                    // Sumar avance de reto
                                    await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                                    // Sumar avance de ranking
                                    await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                                } else if (userExist.type == "marks") { // Marca
                                    // Sumar avance de ranking
                                    await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_PHOTO.code, entityID, rta.id)
                                }
                            } else if (rta.imgAndOrVideos.type.indexOf('video') >= 0) {
                                if (userExist.type == "user") { // Usuario
                                    // Sumar avance de reto
                                    await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                                    // Sumar avance de ranking
                                    await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                                } else if (userExist.type == "marks") { // Marca
                                    // Sumar avance de ranking
                                    await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_VIDEO.code, entityID, rta.id)
                                }
                            } else if (rta.imgAndOrVideos.type.indexOf('audio') >= 0) {
                                if (userExist.type == "user") { // Usuario
                                    // Sumar avance de reto
                                    await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                                    // Sumar avance de ranking
                                    await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                                } else if (userExist.type == "marks") { // Marca
                                    // Sumar avance de ranking
                                    await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_AUDIO.code, entityID, rta.id)
                                }
                            }
                        }
                    }
                    if (body.isSaved == undefined || body.isSaved == false) {
                        rta = await this.savePostTypeTwo(body, ids, 2)
                    }
                    await similarServices.changeLastPost(model, entityID)
                    rta ? success = true : success = false
                }
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }
        return rta ? rta : rtaError
    }

    public async postByID(postID: string, visitorID: string = "") {
        try {
            let ownerID, isVisitor, privacyAllowed, post
            let postExist = await postModel.findById(postID)

            if (postExist) {
                if (postExist.userID != undefined) {
                    isVisitor = postExist.userID != visitorID
                    ownerID = postExist.userID
                } else if (postExist.trademarkID) {
                    isVisitor = postExist.trademarkID != visitorID
                    ownerID = postExist.trademarkID
                }

                let privacyAllowed: any = [0, 1, 2]
                if (isVisitor) {
                    let socialConnection = await socialServices.getSocialConnectionByIDS(ownerID, visitorID)
                    if (!socialConnection.code) {
                        if (!socialConnection.areFriends) {
                            privacyAllowed = [0]
                        } else if (socialConnection.areFriends) {
                            privacyAllowed = [0, 2]
                        }
                    } else {
                        privacyAllowed = [0]
                    }
                }

                post = await postModel.findOne({
                    $and: [
                        { _id: postID },
                        { privacy: { $in: privacyAllowed } }
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
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    }
                                ]
                            },
                        ]
                    })
                    .populate({
                        path: 'taggedUsers',
                        model: 'Users',
                        populate: {
                            path: 'rankID',
                            model: 'Ranks'
                        }
                    })
                    .populate('albumsIDS')
                    .populate({
                        path: 'userID',
                        model: 'Users',
                        populate: {
                            path: 'rankID',
                            model: 'Ranks',
                        }
                    })
                    .populate('trademarkID')
                    .populate('communityID')
                    .populate({
                        path: 'postIDContent',
                        model: 'Posts',
                        match: { isEnabled: true },
                        populate: [
                            {
                                path: 'userID',
                                model: 'Users',
                                match: { isEnabled: true },
                                populate: [
                                    {
                                        path: 'rankID',
                                        model: 'Ranks'
                                    }
                                ]
                            },
                            {
                                path: 'taggedUsers',
                                model: 'Users',
                                populate: [
                                    {
                                        path: 'rankID',
                                        model: 'Ranks'
                                    }
                                ]
                            },
                            {
                                path: 'trademarkID',
                                model: 'Trademarks',
                                match: { isEnabled: true }
                            },
                            {
                                path: 'communityID',
                                model: 'Communities',
                                match: { isEnabled: true }
                            },
                            {
                                path: 'reactionsIDS',
                                model: 'UserReactions',
                                match: { isEnabled: true },
                                populate: [
                                    {
                                        path: 'userID',
                                        model: 'Users',
                                        populate: [
                                            {
                                                path: 'rankID',
                                                model: 'Ranks'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'trademarkID',
                                        model: 'Trademarks',
                                    },
                                    {
                                        path: 'communityID',
                                        model: 'Communities',
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
                                path: 'userID',
                                model: 'Users',
                                populate: [
                                    {
                                        path: 'rankID',
                                        model: 'Ranks'
                                    }
                                ]
                            },
                            {
                                path: 'trademarkID',
                                model: 'Trademarks',
                            },
                            {
                                path: 'communityID',
                                model: 'Communities',
                            }]
                    })
                    .populate({
                        path: 'reportID',
                        model: 'PostsReports',
                        match: { isEnabled: true }
                    })
            }

            return post
        } catch (error) {
            console.log(error);

        }
    }

    public async changeIsEnabledPostForAlbum(idAlbum: string) {
        try {
            await postModel.updateMany({ albumsIDS: { $in: [idAlbum] } }, { $set: { isEnabled: false } })
        } catch (error) {
            console.log(error);
        }
    }

    public async movePosts(body: any) {
        try {
            let isExist = false, postMoved, postsMoved = [], movePost, rtaerror
            if (body.selectPosts.length > 0 && body.selectPosts.length == 1) {
                const moveToPost = await postModel.findOne({ _id: body.selectPosts[0] })
                const newArray = moveToPost.albumsIDS.filter((res: String) => res != body.previousAlbumID)
                const existArray = moveToPost.albumsIDS.filter((res: String) => res == body.albumNewID)
                if (existArray.length > 0) {
                    postMoved = ConstantsRS.THE_RECORD_IS_ALREADY_IN_THIS_ALBUM
                } else {
                    newArray.push(body.albumNewID)
                    movePost = await postModel.findOneAndUpdate({ _id: body.selectPosts[0] }, { albumsIDS: newArray, albumID: body.albumNewID }, { new: true })
                }
                return movePost ? postMoved = movePost : postMoved
            } else if (body.selectPosts.length > 1) {
                for await (let idsPosts of body.selectPosts) {
                    const moveToPost = await postModel.findOne({ _id: idsPosts })
                    const newArray = moveToPost.albumsIDS.filter((res: String) => res != body.previousAlbumID)
                    const existArray = moveToPost.albumsIDS.filter((res: String) => res == body.albumNewID)
                    if (existArray.length > 0) {
                        rtaerror = ConstantsRS.THE_RECORDS_IS_ALREADY_IN_THIS_ALBUM
                        isExist = true
                    } else {
                        newArray.push(body.albumNewID)
                        movePost = await postModel.findOneAndUpdate({ _id: body.selectPosts[0] }, { albumsIDS: newArray, albumID: body.albumNewID }, { new: true })
                    }
                    postsMoved.push(movePost)
                }

                return isExist ? rtaerror : postsMoved
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async copyPosts(body: any) {
        try {
            let anyUser, postCopy, copyRta = []
            if (body.selectPosts.length > 0 && body.selectPosts.length == 1) {
                const copyToPost = await postModel.findOne({ _id: body.selectPosts[0] })
                switch (copyToPost.type) {
                    case 'user':
                        anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.userID)
                        break;
                    case 'mark':
                        anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.trademarkID)
                        break;
                    case 'community':
                        anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.communityID)
                        break;
                }
                const newArray = anyUser.albumsIDS.push(body.copyAlbumID)
                const copyPostupdate = await postModel.findOneAndUpdate({ _id: body.selectPosts[0] }, { albumsIDS: newArray }, { new: true })
                return copyPostupdate ? postCopy = copyPostupdate : postCopy
            } else if (body.selectPosts.length > 1) {
                for await (let idsPosts of body.selectPosts) {
                    const copyToPost = await postModel.findOne({ _id: idsPosts })
                    switch (copyToPost.type) {
                        case 'user':
                            anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.userID)
                            break;
                        case 'mark':
                            anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.trademarkID)
                            break;
                        case 'community':
                            anyUser = await similarServices.identifyUserBrandOrCommunity(copyToPost.communityID)
                            break;
                    }
                    const newArray = anyUser.albumsIDS.push(body.copyAlbum)
                    const copyPost = await postModel.findOneAndUpdate({ _id: body.selectPosts[0] }, { albumsIDS: newArray }, { new: true })
                    copyRta.push(copyPost)
                }
                return copyRta
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async setReactionsNReports(body: any, posts: any) {
        posts.filter((obj: any) => {
            if (obj.reactionsIDS.length > 0) {
                obj.reactionsIDS.filter((reacts: any) => {
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

            if (obj.postIDS.length > 0) {
                obj.postIDS.filter((post: any) => {
                    post.reactionsIDS.filter((reacts: any) => {
                        if (reacts.userID != undefined) {
                            if (reacts.userID._id == body.visitorID) {
                                post.myReaction = {
                                    userID: reacts.userID._id,
                                    value: reacts.value
                                }
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

    public async postByIDForShare(postID: string) {
        try {
            let post
            post = await postModel.findOne({ _id: postID })
                .populate({
                    path: 'postIDContent',
                    model: 'Posts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'userID',
                            model: 'Users',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            ]
                        },
                        {
                            path: 'trademarkID',
                            model: 'Trademarks',
                            match: { isEnabled: true }
                        },
                        {
                            path: 'communityID',
                            model: 'Communities',
                            match: { isEnabled: true }
                        },
                        {
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'userID',
                                    model: 'Users',
                                    populate: [
                                        {
                                            path: 'rankID',
                                            model: 'Ranks'
                                        }
                                    ]
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                },
                                {
                                    path: 'communityID',
                                    model: 'Communities',
                                }]
                        },
                    ]
                })
                .populate({
                    path: 'taggedUsers',
                    model: 'Users',
                    populate: [
                        {
                            path: 'rankID',
                            model: 'Ranks'
                        }
                    ]
                })
                .populate('albumsIDS')
                .populate({
                    path: 'userID',
                    model: 'Users',
                    populate: [
                        {
                            path: 'rankID',
                            model: 'Ranks'
                        }
                    ]
                })
                .populate('trademarkID')
                .populate('communityID')
                .populate('postIDContent')
                .populate({
                    path: 'reactionsIDS',
                    model: 'UserReactions',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'userID',
                            model: 'Users',
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks'
                                }
                            ]
                        },
                        {
                            path: 'trademarkID',
                            model: 'Trademarks',
                        },
                        {
                            path: 'communityID',
                            model: 'Communities',
                        }]
                })
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

    public async disableOrEnablePostNotificationsUser(postId: string, flag: Boolean) {
        try {
            let updatePost
            const getpost = await this.postByID(postId)
            if (getpost) {
                if (getpost.disableNotifications != undefined) {
                    updatePost = await postModel.findOneAndUpdate({ _id: getpost.id }, { disableNotifications: flag }, { new: true })
                }
            }
            return updatePost
        } catch (error) {
            console.log(error);
        }
    }
}

export const postSevices = new PostServices()