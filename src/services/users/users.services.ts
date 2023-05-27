const userModel = require('../../models/user/Users.model');

// services
import { socialServices } from '../../services/social/social.services';

class UserServices {
    public async updatePrivacy(body: any) {
        const newPrivacy = {
            email: body.email,
            birthday: body.birthday,
            phone: body.phone,
            ubication: body.ubication,
            gender: body.gender,
            relationshipStatus: body.relationshipStatus,
        }
        const userUpdate = await userModel.findOneAndUpdate(
            { _id: body.userID },
            { privateData: newPrivacy },
            { new: true }
        );

        return userUpdate
    }

    public async actionsWhenDeletingUser(userID: any) {
        let socialConections = await socialServices.getSocialConnectionsByEntityID(userID)
        if (!socialConections.code) {
            await socialServices.disableSocialConnections(socialConections)
        }
    }

    public async actionsWhenRestoreUser(userID: any) {
        let socialConections = await socialServices.getSocialConnectionsByEntityID(userID)
        if (!socialConections.code) {
            await socialServices.enableSocialConnections(socialConections)
        }
    }

    public async getInfoUser(body: any) {
        let user = await userModel.findOne({ _id: body.id })
            .populate('entityRankID')
            .populate('rankID')

        if (user) {
            let configuredFields = user.privateData
            let isVisitor = body.id != body.visitorID;
            if (isVisitor) {
                let socialConnection = await socialServices.getSocialConnectionByIDS(body.id, body.visitorID)
                if (!socialConnection.code) {
                    if (user.privateData != undefined) {
                        for (const property in configuredFields) {
                            console.log(`${property}: ${configuredFields[property]}`);
                            let privacy = configuredFields[property]
                            if (!socialConnection.areFriends) {
                                if (privacy != 0) {
                                    switch (property) {
                                        case "email":
                                            user.email = undefined
                                            break;
                                        case "birthday":
                                            user.birthday = undefined
                                            break;
                                        case "phone":
                                            user.phone = undefined
                                            break;
                                        case "ubication":
                                            user.ubication = undefined
                                            break;
                                        case "gender":
                                            user.gender = undefined
                                            break;
                                        case "relationship":
                                            user.relationship = undefined
                                            break;
                                    }
                                }
                            } else if (socialConnection.areFriends) {
                                if (privacy !== 0 && privacy !== 2) {
                                    switch (property) {
                                        case "email":
                                            user.email = undefined
                                            break;
                                        case "birthday":
                                            user.birthday = undefined
                                            break;
                                        case "phone":
                                            user.phone = undefined
                                            break;
                                        case "ubication":
                                            user.ubication = undefined
                                            break;
                                        case "gender":
                                            user.gender = undefined
                                            break;
                                        case "relationship":
                                            user.relationship = undefined
                                            break;
                                    }
                                }
                            }
                        }

                    }
                } else {
                    for (const property in configuredFields) {
                        let privacy = configuredFields[property]
                        if (privacy != 0) {
                            switch (property) {
                                case "email":
                                    user.email = undefined
                                    break;
                                case "birthday":
                                    user.birthday = undefined
                                    break;
                                case "phone":
                                    user.phone = undefined
                                    break;
                                case "ubication":
                                    user.ubication = undefined
                                    break;
                                case "gender":
                                    user.gender = undefined
                                    break;
                                case "relationship":
                                    user.relationship = undefined
                                    break;
                            }
                        }
                    }
                }
            }
        }

        let socialConnectionsCount = await socialServices.getSocialConnectionsCount(body)

        return {
            user: user,
            counters: socialConnectionsCount
        }
    }
}

export const userServices = new UserServices()