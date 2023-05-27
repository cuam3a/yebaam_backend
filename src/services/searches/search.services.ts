import { ConstantsRS } from '../../utils/constants';
import { socialServices } from '../social/social.services';
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');
const postModel = require('../../models/post/Posts.model');
const classifiedModel = require('../../models/classifieds/Classifieds.model');
const communityModel = require('../../models/communities/Communities.model');
const chatModel = require('../../models/chats/ChatRooms.model');

class SearchServices {
    public async getUsersByCriteria(body: any) {
        try {
            let rta, rtaError, users

            if (body.limit != undefined) {
                users = await userModel.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: body.textString, $options: "i" } },
                                { description: { $regex: body.textString, $options: "i" } },
                            ],
                        },
                        { isEnabled: true },
                        { isBanned: false }
                    ]
                }).populate("rankID")
                    .limit(body.limit)
                    .sort({ name: 1 })
            }

            if (users.length > 0) {
                if (body.userID != undefined) {
                    for await (let user of users) {
                        const socialIDS = {
                            firstID: body.userID,
                            secondID: user._id
                        }
                        const socialConnection = await socialServices.getSocialConnectionByIDSWithOutRes(socialIDS)
                        if (socialConnection) {
                            user.socialWith = socialConnection
                        }
                    }
                }
                rta = users
            } else {
                rtaError = ConstantsRS.NO_USERS_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async getBrandsByCriteria(body: any) {
        try {
            let rta, rtaError, brands

            if (body.limit != undefined) {
                brands = await trademarkModel.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: body.textString, $options: "i" } },
                                { description: { $regex: body.textString, $options: "i" } },
                            ],
                        },
                        { isEnabled: true },
                        { currentLanding: { $ne: undefined } }
                    ]
                }).limit(body.limit)
                    .sort({ name: 1 })
            }

            if (brands.length > 0) {
                if (body.userID != undefined) {
                    for await (let brand of brands) {
                        const socialIDS = {
                            firstID: body.userID,
                            secondID: brand._id
                        }
                        const socialConnection = await socialServices.getSocialConnectionByIDSWithOutRes(socialIDS)
                        if (socialConnection) {
                            brand.socialWith = socialConnection
                        }
                    }
                }
                rta = brands
            } else {
                rtaError = ConstantsRS.NO_BRANDS_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async getPostsByCriteria(body: any) {
        try {
            let rta, rtaError, posts

            if (body.limit != undefined) {
                posts = await postModel.find({
                    $and: [
                        { description: { $regex: body.textString, $options: "i" } },
                        { isEnabled: true }
                    ],
                }).limit(body.limit)
                    .sort({ publicactionDate: -1 })
            }

            if (posts.length > 0) {
                rta = posts
            } else {
                rtaError = ConstantsRS.NO_POSTS_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async getClassifiedsByCriteria(body: any) {
        try {
            let rta, rtaError, classifieds

            if (body.limit != undefined) {
                classifieds = await classifiedModel.find({
                    $and: [
                        {
                            $or: [
                                { title: { $regex: body.textString, $options: "i" } },
                                { description: { $regex: body.textString, $options: "i" } },
                            ],
                        },
                        { isEnabled: true }
                    ]
                }).limit(body.limit)
                    .sort({ creationDate: -1 })
            }

            if (classifieds.length > 0) {
                rta = classifieds
            } else {
                rtaError = ConstantsRS.NO_CLASSIFIEDS_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async getCommunitiesByCriteria(body: any) {
        try {
            let rta, rtaError, communities

            if (body.limit != undefined) {
                communities = await communityModel.find({
                    $and: [
                        {
                            $or: [
                                { name: { $regex: body.textString, $options: "i" } },
                                { description: { $regex: body.textString, $options: "i" } },
                            ],
                        },
                        { isEnabled: true }
                    ]
                }).limit(body.limit)
                    .sort({ creationDate: -1 })
            }

            if (communities.length > 0) {
                rta = communities
            } else {
                rtaError = ConstantsRS.NO_COMMUNITIES_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async getChatsByCriteria(body: any) {
        try {
            let rta, rtaError, chats

            if (body.limit != undefined) {
                chats = await chatModel.find({
                    $and: [
                        { name: { $regex: body.textString, $options: "i" } },
                        { isEnabled: true }
                    ]
                }).limit(body.limit)
                    .sort({ creationDate: -1 })
            }

            if (chats.length > 0) {
                rta = chats
            } else {
                rtaError = ConstantsRS.NO_CHATS_FOUND
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }
}

export const searchServices = new SearchServices()