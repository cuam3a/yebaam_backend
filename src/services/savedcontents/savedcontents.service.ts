import { ConstantsRS } from '../../utils/constants';
const savedContentsModel = require('../../models/savedcontents/SavedContents.model');
import { similarServices } from "../similarservices/similar.services";

class ContentSavedServices {
    public async saveContent(body: any) {
        let rta, rtaError, contentSavedExist
        const entityExist = await similarServices.identifyUserBrandOrCommunity(body.entityID)
        const contentExist = await similarServices.identifyContentToSave(body.contentID)
        if (!contentExist.code && !entityExist.code) {
            switch (entityExist.type) {
                case "user":
                    body.userID = body.entityID
                    break;
                case "marks":
                    body.trademarkID = body.entityID
                    break;
                case "professional":
                    body.professionalProfileID = body.entityID
                    break;
                default:
                    body.userID = body.entityID
                    break;
            }

            switch (contentExist.type) {
                case "post":
                    body.postID = body.contentID
                    contentSavedExist = await savedContentsModel.findOne({
                        $and: [
                            { userID: body.entityID },
                            { postID: body.contentID }
                        ]
                    })
                    break;
                case "professionalpost":
                    body.professionalPostID = body.contentID
                    contentSavedExist = await savedContentsModel.findOne({
                        $and: [
                            { userID: body.entityID },
                            { professionalPostID: body.contentID }
                        ]
                    })
                    break;
                case "classified":
                    body.classifiedID = body.contentID
                    contentSavedExist = await savedContentsModel.findOne({
                        $and: [
                            { userID: body.entityID },
                            { classifiedID: body.contentID }
                        ]
                    })
                    break;
                default:
                    body.postID = body.contentID
                    contentSavedExist = await savedContentsModel.findOne({
                        $and: [
                            { userID: body.entityID },
                            { postID: body.contentID }
                        ]
                    })
                    break;
            }

            if (!contentSavedExist) {
                body.typeContent = contentExist.type

                const contentToSave = new savedContentsModel(body);
                const contentSaved = await contentToSave.save();

                if (contentSaved) {
                    rta = contentSaved
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.CONTENT_ALREADY_SAVED
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError

    }

    public async getContentsByUserIDNType(body: any) {
        let rta: any, rtaError, rta2: any
        let { limit, nextSkip, skip } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (body.typeContent != undefined && body.entityID != undefined) {
            rta = await savedContentsModel.find({
                $and: [
                    {
                        $or: [
                            { userID: body.entityID },
                            { trademarkID: body.entityID },
                            { professionalProfileID: body.entityID }
                        ],
                    },
                    { typeContent: body.typeContent }
                ]
            }).populate([
                {
                    path: 'postID',
                    model: 'Posts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'userID',
                            model: "Users",
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks',
                                }
                            ]
                        },
                        {
                            path: 'trademarkID',
                            model: "Trademarks"
                        },
                        {
                            path: 'communityID',
                            model: "Communities"
                        }
                    ]
                },
                {
                    path: 'classifiedID',
                    model: 'Classifieds',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'userID',
                            model: "Users",
                            populate: [
                                {
                                    path: 'rankID',
                                    model: 'Ranks',
                                }
                            ]
                        },
                        {
                            path: 'trademarkID',
                            model: "Trademarks"
                        },
                        {
                            path: 'professionalProfileID',
                            model: "ProfessionalProfiles"
                        }
                    ]
                },
                {
                    path: 'professionalPostID',
                    model: 'ProfessionalPosts',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'professionalProfileID',
                            model: "ProfessionalProfiles"
                        }
                    ]
                },
                {
                    path: 'userID',
                    model: "Users",
                    populate: [
                        {
                            path: 'rankID',
                            model: 'Ranks',
                        }
                    ]
                }
            ]).limit(limit).skip(skip);
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        if (rta.length > 0) {
            rta2 = rta.filter((x: any) => (
                (x.typeContent == "post" && x.postID != null) ||
                (x.typeContent == "professionalpost" && x.professionalPostID != null) ||
                (x.typeContent == "classified" && x.classifiedID != null)
            ))
        }

        let response = rta2 ? rta2 : rtaError
        return { response, nextSkip };
    }

    public async deleteContentSaved(id: string) {
        let rta, rtaError

        const contentSaved = await savedContentsModel.deleteOne({ _id: id });
        if (contentSaved) {
            rta = "Contenido eliminado correctamente"
        } else {
            rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
        }

        return rta ? rta : rtaError
    }

    /* public async getSavedContentByContentID(contentID: string, entityID: string) {
        let rta, rtaError, contentSavedExist

        const entityExist = await similarServices.identifyUserBrandOrCommunity(entityID)
        const contentExist = await similarServices.identifyContentToSave(contentID)
        if (!contentExist.code && !entityExist.code) {
            switch (contentExist.type) {
                case "post":
                    contentSavedExist = await savedContentsModel.findOne({ postID: contentID })
                    break;
                case "professionalpost":
                    contentSavedExist = await savedContentsModel.findOne({ professionalPostID: contentID })
                    break;
                case "classified":
                    contentSavedExist = await savedContentsModel.findOne({ classifiedID: contentID })
                    break;
                default:
                    contentSavedExist = await savedContentsModel.findOne({ postID: contentID })
                    break;
            }
        }

        if (contentSavedExist) {
            rta = contentSavedExist
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    } */
}

export const contentSavedServices = new ContentSavedServices();