import { ConstantsRS } from '../../utils/constants';
import moment from 'moment';
const postReportModel = require('../../models/postsreports/PostsReports.model');
const userModel = require('../../models/user/Users.model');
const trademarksModel = require('../../models/trademarks/Trademarks.model');
const professionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');
const postModel = require('../../models/post/Posts.model');
const professionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');
const typeOfReportModel = require('../../models/postsreports/TypeOfReports.model');

import { similarServices } from '../../services/similarservices/similar.services';
import { reportingLimitServices } from '../../services/postreports/reportinglimits.services';
import { banLimitServices } from './banLimits.services';
import { userServices } from '../users/users.services';
import { trademarksServices } from '../trademarks/trademarks.services';
import { professionalProfileServices } from '../professionalprofile/professionalprofile.services';

class PostReportServices {
    public async savePostReport(body: any) {
        let rta, rtaError, postExist, postReportExist, userPostReport, contentModel

        postExist = await similarServices.identifyTypePostByID(body.contentID)

        if (!postExist.code) {
            if (postExist.type === "post") {
                contentModel = postModel
                postReportExist = await postReportModel.findOne({ postID: body.contentID })
                if (postReportExist) {
                    userPostReport = await postReportModel.find({
                        $and: [{ reportingEntitiesIDS: { $in: [body.entityID] } }, { postID: body.contentID }]
                    })
                }
            } else if (postExist.type === "professionalpost") {
                contentModel = professionalPostModel
                postReportExist = await postReportModel.findOne({ professionalPostID: body.contentID })
                if (postReportExist) {
                    userPostReport = await postReportModel.find({
                        $and: [{ reportingEntitiesIDS: { $in: [body.entityID] } }, { professionalPostID: body.contentID }]
                    })
                }
            }

            if (postReportExist) { // Si ya existe el reporte para determinado post
                if (userPostReport.length > 0) { // Si el usuario ya reportó determinado post
                    rtaError = ConstantsRS.POST_REPORT_ALREADY_EXIST
                } else { // Si el usuario aún no ha reportado determinado post
                    const limits = await reportingLimitServices.getLimits()
                    let dataReportToUpdate = new postReportModel(postReportExist);
                    if (limits.length > 0) {
                        if ((postReportExist.reportingEntitiesIDS.length + 1) >= limits[0].limitForPost) { // si la cantidad de reportes en el post ha llegado al límite                            
                            const contentToUpdate = await contentModel.updateOne({ _id: body.contentID }, { isEnabled: false })
                            if (contentToUpdate.nModified == 1) {
                                dataReportToUpdate.reportState = 1
                                /* if (postReportExist.reportedUserID != undefined || postReportExist.reportedCommunityUserID) {
                                    entityID = postReportExist.reportedUserID ? postReportExist.reportedUserID : postReportExist.reportedCommunityUserID
                                    entityModel = userModel
                                } else if (postReportExist.reportedTrademarkID != undefined || postReportExist.reportedCommunityTrademarkID != undefined) {
                                    entityID = postReportExist.reportedTrademarkID ? postReportExist.reportedTrademarkID : postReportExist.reportedCommunityTrademarkID
                                    entityModel = trademarksModel
                                } else if (postReportExist.reportedProfessionalProfileID != undefined || postReportExist.reportedCommunityProfessionalProfileID) {
                                    entityID = postReportExist.reportedProfessionalProfileID ? postReportExist.reportedProfessionalProfileID : postReportExist.reportedCommunityProfessionalProfileID
                                    entityModel = professionalProfileModel
                                }
                                entity = await entityModel.findOne({ _id: entityID, isEnabled: true })
                                if (entity) {
                                    const limitForUser = limits[0].limitForUser
                                    const proxBannedPost = (entity.bannedPosts + 1)
                                    dataEntityToUpdate = new entityModel(entity)

                                    dataEntityToUpdate.bannedPosts = proxBannedPost
                                    if (proxBannedPost >= limitForUser) { // Si la cantidad de baneos de post llega al límite por usuario
                                        const proxStrike = (entity.strikeCounter + 1)
                                        const banData = await banLimitServices.getLimitByQuantity(proxStrike)
                                        if (!banData.code) { // Se determina el baneo, fecha de inicio y fin del mismo de acuerdo a la cantidad de strikes                                            
                                            let banDate = moment();
                                            dataEntityToUpdate.strikeCounter = proxStrike
                                            dataEntityToUpdate.isBanned = true
                                            dataEntityToUpdate.banStartDate = banDate

                                            if (banData.isLimit == false) {
                                                dataEntityToUpdate.banEndDate = moment(banDate).add(banData.banDays, 'days');
                                            } else if (banData.isLimit == true) {
                                                dataEntityToUpdate.isEnabled = false
                                            }
                                        }
                                    }
                                    await entityModel.updateOne({ _id: entityID }, dataEntityToUpdate);
                                } */
                            }
                        }

                        for (let i = 0; i < body.typeOfReports.length; i++) {
                            let existType = postReportExist.typeOfReports.find((type: any) => type == body.typeOfReports[i]);
                            if (!existType) {
                                await typeOfReportModel.updateOne({ _id: body.typeOfReports[i] }, { inUse: true })
                                dataReportToUpdate.typeOfReports.push(body.typeOfReports[i])
                            }
                        }

                        if (body.description != undefined) {
                            dataReportToUpdate.descriptions.push({
                                entityID: body.entityID,
                                message: body.description
                            })
                        }

                        dataReportToUpdate.reportingEntitiesIDS.push(body.entityID)
                        dataReportToUpdate.isEnabled = true
                        if (postReportExist.reportState == 4) {
                            dataReportToUpdate.reportState = 0
                        }
                        const postReportToUpdate = await postReportModel.findOneAndUpdate({ _id: postReportExist.id }, dataReportToUpdate, { new: true })
                        if (postReportToUpdate) {
                            rta = postReportToUpdate
                        } else {
                            rtaError = ConstantsRS.ERROR_TO_SAVE_POST_REPORT
                        }
                    } else {
                        rtaError = ConstantsRS.NO_LIMIT_REPORT_EXISTS
                    }
                }
            } else { // Si aún no existe el reporte para determinado post
                const postReportToSave = new postReportModel(body);
                postReportToSave.reportingEntitiesIDS = [body.entityID]

                const limits = await reportingLimitServices.getLimits()
                if (limits.length > 0) {
                    if (limits[0].limitForPost == 1) { // Si la cantidad de reportes en el post ha llegado al límite
                        postReportToSave.reportState = 1
                    }
                }


                if (body.description != undefined) {
                    postReportToSave.descriptions = {
                        entityID: body.entityID,
                        message: body.description
                    }
                }

                if (postExist.type === "post") {
                    postReportToSave.postID = postExist._id
                    if (postExist.communityID != undefined) {
                        postReportToSave.reportedCommunityID = postExist.communityID
                        if (postExist.userID != undefined) {
                            postReportToSave.reportedCommunityUserID = postExist.userID
                        } else if (postExist.trademarkID != undefined) {
                            postReportToSave.reportedCommunityTrademarkID = postExist.trademarkID
                        }
                    } else if (postExist.userID != undefined) {
                        postReportToSave.reportedUserID = postExist.userID
                    } else if (postExist.trademarkID != undefined) {
                        postReportToSave.reportedTrademarkID = postExist.trademarkID
                    }
                } else if (postExist.type === "professionalpost") {
                    postReportToSave.professionalPostID = postExist._id
                    postReportToSave.reportedProfessionalProfileID = postExist.professionalProfileID
                }

                const postReportSaved = await postReportToSave.save();

                if (postReportSaved) {
                    const dataContentToUpdate = new contentModel(postExist);
                    dataContentToUpdate.reportID = postReportSaved._id
                    if (postReportSaved.reportState == 1) {
                        dataContentToUpdate.isEnabled = false
                    }
                    await contentModel.updateOne({ _id: body.contentID }, dataContentToUpdate)

                    rta = postReportSaved
                } else {
                    rtaError = ConstantsRS.ERROR_TO_SAVE_POST_REPORT
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteReportById(body: any) {
        let rta, rtaError, reportToUpdate, model
        const report = await postReportModel.findOne({
            $and: [{ _id: body.id }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
        })
        if (report) {
            if (report.reportState == 0) {
                let descriptions = report.descriptions.filter((desc: any) => desc.entityID != body.entityID)

                if (report.reportingEntitiesIDS.length == 1) {
                    reportToUpdate = await postReportModel.findOneAndUpdate(
                        { _id: body.id },
                        { $pull: { reportingEntitiesIDS: body.entityID }, descriptions, isEnabled: false },
                        { new: true }
                    )
                } else {
                    reportToUpdate = await postReportModel.findOneAndUpdate(
                        { _id: body.id },
                        { $pull: { reportingEntitiesIDS: body.entityID }, descriptions },
                        { new: true }
                    )
                }

                if (reportToUpdate) {
                    rta = reportToUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.CANNOT_CANCEL_REPORT
            }
        } else {
            rtaError = ConstantsRS.POST_UNREPORTED
        }

        return rta ? rta : rtaError
    }

    public async deleteReportByPostId(body: any) {
        let rta, rtaError, reportToUpdate, postExist, reportExist

        postExist = await similarServices.identifyPostReportByContentID(body.contentID)

        if (!postExist.code) {
            if (postExist.postID != undefined) {
                reportExist = await postReportModel.findOne({
                    $and: [{ postID: body.contentID }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
                })
            } else if (postExist.professionalPostID != undefined) {
                reportExist = await postReportModel.findOne({
                    $and: [{ professionalPostID: body.contentID }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
                })
            }

            if (reportExist) {
                if (reportExist.reportState == 0) {
                    let descriptions = reportExist.descriptions.filter((desc: any) => desc.entityID != body.entityID)

                    if (reportExist.reportingEntitiesIDS.length == 1) {
                        reportToUpdate = await postReportModel.findOneAndUpdate(
                            { _id: reportExist.id },
                            { $pull: { reportingEntitiesIDS: body.entityID }, descriptions, isEnabled: false },
                            { new: true }
                        )
                    } else {
                        reportToUpdate = await postReportModel.findOneAndUpdate(
                            { _id: reportExist.id },
                            { $pull: { reportingEntitiesIDS: body.entityID }, descriptions },
                            { new: true }
                        )
                    }

                    if (reportToUpdate) {
                        rta = reportToUpdate
                    } else {
                        rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                    }
                } else {
                    rtaError = ConstantsRS.CANNOT_CANCEL_REPORT
                }
            } else {
                rtaError = ConstantsRS.POST_UNREPORTED
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async changeReportStateForUser(body: any) {
        let rta, rtaError, dataToUpdate: any, reportToUpdate, entityModel, entityID, entity, dataEntityToUpdate, dataContentToUpdate
        const report = await postReportModel.findOne({ _id: body.id, isEnabled: true })

        if (report) {
            if (report.reportState == 1) {
                dataToUpdate = new postReportModel(report)
                if (body.reportState == 2) { // Se olvida el reporte (acepta infracción)
                    dataToUpdate.reportingEntitiesIDS = []
                    dataToUpdate.typeOfReports = []
                    dataToUpdate.descriptions = []
                    dataToUpdate.objection = ""
                    dataToUpdate.isEnabled = false
                    dataToUpdate.reportState = 2

                    const limits = await reportingLimitServices.getLimits()
                    if (limits.length > 0) {
                        if (report.reportedUserID != undefined || report.reportedCommunityUserID != undefined) {
                            entityID = report.reportedUserID ? report.reportedUserID : report.reportedCommunityUserID
                            entityModel = userModel
                        } else if (report.reportedTrademarkID != undefined || report.reportedCommunityTrademarkID != undefined) {
                            entityID = report.reportedTrademarkID ? report.reportedTrademarkID : report.reportedCommunityTrademarkID
                            entityModel = trademarksModel
                        } else if (report.reportedProfessionalProfileID != undefined || report.reportedCommunityProfessionalProfileID != undefined) {
                            entityID = report.reportedProfessionalProfileID ? report.reportedProfessionalProfileID : report.reportedCommunityProfessionalProfileID
                            entityModel = professionalProfileModel
                        }
                        entity = await entityModel.findOne({ _id: entityID, isEnabled: true })
                        if (entity) {
                            const limitForUser = limits[0].limitForUser
                            const proxBannedPost = (entity.bannedPosts + 1)
                            dataEntityToUpdate = new entityModel(entity)

                            dataEntityToUpdate.bannedPosts = proxBannedPost
                            if (proxBannedPost >= limitForUser) { // Si la cantidad de baneos de post llega al límite por usuario
                                const proxStrike = (entity.strikeCounter + 1)
                                const banData = await banLimitServices.getLimitByQuantity(proxStrike)
                                if (!banData.code) { // Se determina el baneo, fecha de inicio y fin del mismo de acuerdo a la cantidad de strikes                                            
                                    let banDate = moment();
                                    dataEntityToUpdate.strikeCounter = proxStrike
                                    dataEntityToUpdate.isBanned = true
                                    dataEntityToUpdate.banStartDate = banDate

                                    if (banData.isLimit == false) {
                                        dataEntityToUpdate.banEndDate = moment(banDate).add(banData.banDays, 'days');
                                    } else if (banData.isLimit == true) {
                                        dataEntityToUpdate.isEnabled = false
                                    }
                                }
                            }

                            const entityToUpdate = await entityModel.findOneAndUpdate({ _id: entityID }, dataEntityToUpdate, { new: true });
                            if (entityToUpdate) {
                                if (entityToUpdate.isEnabled == false) {
                                    switch (entityToUpdate.type) {
                                        case "user":
                                            await userServices.actionsWhenDeletingUser(entityID)
                                            break;
                                        case "marks":
                                            await trademarksServices.actionsWhenDeletingBrand(entityID)
                                            break;
                                        case "professional":
                                            await professionalProfileServices.actionsWhenDeletingProfessional(entityID)
                                            break;
                                    }
                                }
                            }
                        }
                    } else {
                        rtaError = ConstantsRS.NO_LIMIT_REPORT_EXISTS
                    }
                } else if (body.reportState == 3) { // Se emite objeción al reporte
                    dataToUpdate.objection = body.objection
                    dataToUpdate.reportState = 3
                }

                reportToUpdate = await postReportModel.findOneAndUpdate({ _id: body.id }, dataToUpdate, { new: true })
                if (reportToUpdate) { // al actualziar el reporte
                    rta = reportToUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                rtaError = ConstantsRS.CANNOT_RUN_ACTION
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async changeReportState(body: any) {
        let rta, rtaError, model, contentModel, entity, entityID, contentID, dataToUpdate: any, reportToUpdate, dataEntityToUpdate
        const report = await postReportModel.findOne({ _id: body.id, isEnabled: true })

        if (report) {
            if (report.reportedUserID != undefined || report.reportedCommunityUserID != undefined) {
                model = userModel
                contentModel = postModel
                entityID = report.reportedUserID ? report.reportedUserID : report.reportedCommunityUserID
                contentID = report.postID
            } else if (report.reportedTrademarkID != undefined || report.reportedCommunityTrademarkID) {
                model = trademarksModel
                contentModel = postModel
                entityID = report.reportedTrademarkID ? report.reportedTrademarkID : report.reportedCommunityTrademarkID
                contentID = report.postID
            } else if (report.reportedProfessionalProfileID != undefined || report.reportedCommunityProfessionalProfileID != undefined) {
                model = professionalProfileModel
                contentModel = professionalPostModel
                entityID = report.reportedProfessionalProfileID ? report.reportedProfessionalProfileID : report.reportedCommunityProfessionalProfileID
                contentID = report.professionalPostID
            }

            if (body.reportState == 4) { // Se omite el reporte
                dataToUpdate = new postReportModel(report)
                dataToUpdate.reportingEntitiesIDS = []
                dataToUpdate.typeOfReports = []
                dataToUpdate.descriptions = []
                dataToUpdate.isEnabled = false
                dataToUpdate.reportState = 4
                reportToUpdate = await postReportModel.findOneAndUpdate({ _id: body.id }, dataToUpdate, { new: true })
                if (reportToUpdate) { // Al actualziar el reporte, se habilita el conenido nuevamente 
                    await contentModel.findOneAndUpdate({ _id: contentID }, { isEnabled: true }, { new: true })
                    rta = reportToUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else if (body.reportState == 5) { // Se sanciona el reporte
                const limits = await reportingLimitServices.getLimits()
                if (limits.length > 0) {
                    reportToUpdate = await postReportModel.findOneAndUpdate({ _id: body.id }, body, { new: true })

                    if (reportToUpdate) { // Al actualziar el reporte, se procede a sancionar debidamente al usuario
                        entity = await model.findOne({ _id: entityID, isEnabled: true })
                        if (entity) {
                            const limitForUser = limits[0].limitForUser
                            const proxBannedPost = (entity.bannedPosts + 1)
                            dataEntityToUpdate = new model(entity)

                            dataEntityToUpdate.bannedPosts = proxBannedPost
                            if (proxBannedPost >= limitForUser) {
                                const proxStrike = (entity.strikeCounter + 1)
                                const banData = await banLimitServices.getLimitByQuantity(proxStrike)
                                if (!banData.code) { // Se determina el baneo, fecha de inicio y fin del mismo de acuerdo a la cantidad de strikes
                                    let banDate = moment();
                                    dataEntityToUpdate.strikeCounter = proxStrike
                                    dataEntityToUpdate.isBanned = true
                                    dataEntityToUpdate.banStartDate = banDate

                                    if (banData.isLimit == false) {
                                        dataEntityToUpdate.banEndDate = moment(banDate).add(banData.banDays, 'days');
                                    } else if (banData.isLimit == true) {
                                        dataEntityToUpdate.isEnabled = false
                                    }
                                }
                            }

                            const entityToUpdate = await model.findOneAndUpdate({ _id: entityID }, dataEntityToUpdate, { new: true });
                            if (entityToUpdate) {
                                if (entityToUpdate.isEnabled == false) {
                                    switch (entityToUpdate.type) {
                                        case "user":
                                            await userServices.actionsWhenDeletingUser(entityID)
                                            break;
                                        case "marks":
                                            await trademarksServices.actionsWhenDeletingBrand(entityID)
                                            break;
                                        case "professional":
                                            await professionalProfileServices.actionsWhenDeletingProfessional(entityID)
                                            break;
                                    }
                                }
                                rta = reportToUpdate
                            } else {
                                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                            }
                        } else {
                            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.NO_LIMIT_REPORT_EXISTS
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getByState(reportState: any) {
        let rta, rtaError
        const reports = await postReportModel.find({
            $and: [{ reportState: reportState }, { isEnabled: true }]
        }).populate([
            {
                path: 'postID',
                model: 'Posts',
            },
            {
                path: 'professionalPostID',
                model: 'ProfessionalPosts',
            },
            {
                path: 'reportedUserID',
                model: 'Users',
            },
            {
                path: 'reportedTrademarkID',
                model: 'Trademarks',
            },
            {
                path: 'reportedProfessionalProfileID',
                model: 'ProfessionalProfiles',
            },
            {
                path: 'reportedCommunityID',
                model: 'Communities',
            },
            {
                path: 'reportedCommunityUserID',
                model: 'Users',
            },
            {
                path: 'reportedCommunityTrademarkID',
                model: 'Trademarks',
            },
            {
                path: 'reportedCommunityProfessionalProfileID',
                model: 'ProfessionalProfiles',
            },
            {
                path: 'typeOfReports',
                model: 'TypeOfReports',
                select: 'description'
            }
        ])

        if (reports.length > 0) {
            rta = reports
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByUser(entityID: any) {
        let rta, rtaError
        const reports = await postReportModel.find({
            $and: [
                { reportingEntitiesIDS: { $in: [entityID] } },
                { reportState: 0 },
                { isEnabled: true }
            ]
        }).populate([
            {
                path: 'postID',
                model: 'Posts',
            },
            {
                path: 'professionalPostID',
                model: 'ProfessionalPosts',
            },
            {
                path: 'typeOfReports',
                model: 'TypeOfReports',
                select: 'description'
            },
            {
                path: 'reportedUserID',
                model: 'Users',
            },
            {
                path: 'reportedTrademarkID',
                model: 'Trademarks',
            },
            {
                path: 'reportedProfessionalProfileID',
                model: 'ProfessionalProfiles',
            },
            {
                path: 'reportedCommunityID',
                model: 'Communities',
            },
            {
                path: 'reportedCommunityUserID',
                model: 'Users',
            },
            {
                path: 'reportedCommunityTrademarkID',
                model: 'Trademarks',
            },
            {
                path: 'reportedCommunityProfessionalProfileID',
                model: 'ProfessionalProfiles',
            }
        ])

        if (reports.length > 0) {
            rta = reports
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByUserReported(entityID: any) {
        let rta, rtaError
        const reports = await postReportModel.find({
            $or: [
                {
                    $and: [
                        {
                            $or: [
                                { reportedUserID: entityID },
                                { reportedTrademarkID: entityID },
                                { reportedProfessionalProfileID: entityID },
                                { reportedCommunityUserID: entityID },
                                { reportedCommunityTrademarkID: entityID },
                                { reportedCommunityProfessionalProfileID: entityID }
                            ]
                        },
                        {
                            $or: [
                                { reportState: { $in: 1 } },
                                { reportState: { $in: 2 } },
                                { reportState: { $in: 3 } }
                            ]
                        },
                        { isEnabled: true }
                    ]
                }
            ]
        }).populate([
            {
                path: 'postID',
                model: 'Posts',
            },
            {
                path: 'professionalPostID',
                model: 'ProfessionalPosts',
            },
            {
                path: 'typeOfReports',
                model: 'TypeOfReports',
                select: 'description'
            }
        ])

        if (reports.length > 0) {
            rta = reports
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    /* public async indentifyEntityPostReport(report: any) {
        let model, entityID, data
        if (report.reportedUserID != undefined || report.reportedCommunityUserID != undefined) {
            model = userModel
            entityID = report.reportedUserID ? report.reportedUserID : report.reportedCommunityUserID
        } else if (report.reportedTrademarkID != undefined || report.reportedCommunityTrademarkID != undefined) {
            model = trademarksModel
            entityID = report.reportedTrademarkID ? report.reportedUserID : report.reportedCommunityTrademarkID
        } else if (report.reportedProfessionalProfileID != undefined || report.reportedCommunityProfessionalProfileID != undefined) {
            model = professionalProfileModel
            entityID = report.reportedProfessionalProfileID ? report.reportedUserID : report.reportedCommunityProfessionalProfileID
        }

        const entity = await model.findOne({ _id: entityID, isEnabled: true })

        data = {
            entity: entity ? entity : null,
            model: model
        }
        return data
    } */
}

export const postReportServices = new PostReportServices()