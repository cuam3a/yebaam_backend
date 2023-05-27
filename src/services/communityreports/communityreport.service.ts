import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
import { similarServices } from '../similarservices/similar.services';
import { reportingLimitServices } from '../../services/postreports/reportinglimits.services';
import { banLimitServices } from '../postreports/banLimits.services';
import { userServices } from '../users/users.services';
import { professionalProfileServices } from '../professionalprofile/professionalprofile.services';

const communityReportModel = require('../../models/communityreports/CommunityReports.model');
const communityModel = require('../../models/communities/Communities.model');
const professionalCommunityModel = require('../../models/communitiesprofessionales/ProfessionalCommunities.model');
const userModel = require('../../models/user/Users.model');
const professionalModel = require('../../models/professionalprofile/ProfessionalProfiles.model');

class CommunityReportServices {
    public async saveCommunityReport(body: any) {
        let rta, rtaError, communityExist, communityReportExist, userCommunityReport, communityTypeModel

        communityExist = await similarServices.identifyTypeOfCommunity(body.communityID)

        if (!communityExist.code) {
            if (communityExist.type === "community") {
                communityTypeModel = communityModel
                communityReportExist = await communityReportModel.findOne({ reportedCommunityID: body.communityID })
                if (communityReportExist) {
                    userCommunityReport = await communityReportModel.find({
                        $and: [{ reportingEntitiesIDS: { $in: [body.entityID] } }, { reportedCommunityID: body.communityID }]
                    })
                }
            } else if (communityExist.type === "professionalcommunity") {
                communityTypeModel = professionalCommunityModel
                communityReportExist = await communityReportModel.findOne({ reportedProfessionalCommunityID: body.communityID })
                if (communityReportExist) {
                    userCommunityReport = await communityReportModel.find({
                        $and: [{ reportingEntitiesIDS: { $in: [body.entityID] } }, { reportedProfessionalCommunityID: body.communityID }]
                    })
                }
            }

            if (communityReportExist) {
                if (userCommunityReport.length > 0) { // Si el usuario ya reportó determinado post
                    rtaError = ConstantsRS.COMMUNITY_REPORT_ALREADY_EXIST
                } else {
                    const limits = await reportingLimitServices.getLimits()
                    let dataReportToUpdate = new communityReportModel(communityReportExist);

                    if (limits.length > 0) {
                        if ((communityReportExist.reportingEntitiesIDS.length + 1) >= limits[0].limitForPost) { // si la cantidad de reportes en el post ha llegado al límite
                            const contentToUpdate = await communityModel.updateOne({ _id: body.communityID }, { isEnabled: false })
                            if (contentToUpdate.nModified == 1) {
                                dataReportToUpdate.reportState = 1
                            }
                        }

                        for (let i = 0; i < body.typeOfReports.length; i++) {
                            let existType = communityReportExist.typeOfReports.find((type: any) => type == body.typeOfReports[i]);
                            if (!existType) {
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
                        if (communityReportExist.reportState == 4) {
                            dataReportToUpdate.reportState = 0
                        }
                        const postReportToUpdate = await communityReportModel.findOneAndUpdate({ _id: communityReportExist.id }, dataReportToUpdate, { new: true })
                        if (postReportToUpdate) {
                            rta = postReportToUpdate
                        } else {
                            rtaError = ConstantsRS.ERROR_TO_SAVE_COMMUNITY_REPORT
                        }
                    } else {
                        rtaError = ConstantsRS.NO_LIMIT_REPORT_EXISTS
                    }
                }
            } else { // Si aún no existe el reporte para determinada comunidad
                const communityReportToSave: any = new communityReportModel(body);
                communityReportToSave.reportingEntitiesIDS = [body.entityID]

                const limits = await reportingLimitServices.getLimits()
                if (limits.length > 0) {
                    if (limits[0].limitForPost == 1) { // Si la cantidad de reportes en el post ha llegado al límite
                        communityReportToSave.reportState = 1
                    }
                }

                if (body.description != undefined) {
                    communityReportToSave.descriptions = {
                        entityID: body.entityID,
                        message: body.description
                    }
                }

                switch (communityExist.type) {
                    case "community":
                        communityReportToSave.reportedCommunityID = body.communityID
                        communityReportToSave.reportedUserAdminID = communityExist.userID
                        break;
                    case "professionalcommunity":
                        communityReportToSave.reportedProfessionalCommunityID = body.communityID
                        communityReportToSave.reportedProfessionalAdminID = communityExist.professionalId
                        break;
                }

                const communityReportSaved = await communityReportToSave.save();

                if (communityReportSaved) {
                    const dataCommunityToUpdate = new communityTypeModel(communityExist);
                    dataCommunityToUpdate.reportID = communityReportSaved._id
                    if (communityReportSaved.reportState == 1) {
                        dataCommunityToUpdate.isEnabled = false
                    }
                    await communityTypeModel.updateOne({ _id: body.communityID }, dataCommunityToUpdate)

                    rta = communityReportSaved
                } else {
                    rtaError = ConstantsRS.ERROR_TO_SAVE_COMMUNITY_REPORT
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteReportById(body: any) {
        let rta, rtaError, reportToUpdate
        const report = await communityReportModel.findOne({
            $and: [{ _id: body.id }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
        })
        if (report) {
            if (report.reportState == 0) {
                let descriptions = report.descriptions.filter((desc: any) => desc.entityID != body.entityID)

                if (report.reportingEntitiesIDS.length == 1) {
                    reportToUpdate = await communityReportModel.findOneAndUpdate(
                        { _id: body.id },
                        { $pull: { reportingEntitiesIDS: body.entityID }, descriptions, isEnabled: false },
                        { new: true }
                    )
                } else {
                    reportToUpdate = await communityReportModel.findOneAndUpdate(
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

    public async deleteReportByCommunityId(body: any) {
        let rta, rtaError, reportToUpdate, communityReportExist, reportExist

        communityReportExist = await similarServices.identifyCommunityReportByCommunityID(body.communityID)

        if (!communityReportExist.code) {
            if (communityReportExist.reportedCommunityID != undefined) {
                reportExist = await communityReportModel.findOne({
                    $and: [{ reportedCommunityID: body.communityID }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
                })
            } else if (communityReportExist.reportedProfessionalCommunityID != undefined) {
                reportExist = await communityReportModel.findOne({
                    $and: [{ reportedProfessionalCommunityID: body.communityID }, { reportingEntitiesIDS: { $in: [body.entityID] } }]
                })
            }

            if (reportExist) {
                if (reportExist.reportState == 0) {
                    let descriptions = reportExist.descriptions.filter((desc: any) => desc.entityID != body.entityID)

                    if (reportExist.reportingEntitiesIDS.length == 1) {
                        reportToUpdate = await communityReportModel.findOneAndUpdate(
                            { _id: reportExist.id },
                            { $pull: { reportingEntitiesIDS: body.entityID }, descriptions, isEnabled: false },
                            { new: true }
                        )
                    } else {
                        reportToUpdate = await communityReportModel.findOneAndUpdate(
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
        let rta, rtaError, dataToUpdate: any, reportToUpdate, entityModel, entityID, entity, dataEntityToUpdate
        const report = await communityReportModel.findOne({ _id: body.id, isEnabled: true })

        if (report) {
            if (report.reportState == 1) {
                dataToUpdate = new communityReportModel(report)
                if (body.reportState == 2) { // Se olvida el reporte (acepta infracción)
                    dataToUpdate.reportingEntitiesIDS = []
                    dataToUpdate.typeOfReports = []
                    dataToUpdate.descriptions = []
                    dataToUpdate.objection = ""
                    dataToUpdate.isEnabled = false
                    dataToUpdate.reportState = 2

                    const limits = await reportingLimitServices.getLimits()
                    if (limits.length > 0) {
                        if (report.reportedUserAdminID != undefined) {
                            entityID = report.reportedUserAdminID
                            entityModel = userModel
                        } else if (report.reportedProfessionalAdminID != undefined) {
                            entityID = report.reportedProfessionalAdminID
                            entityModel = professionalModel
                        }
                        entity = await entityModel.findOne({ _id: entityID, isEnabled: true })
                        if (entity) {
                            const limitForUser = limits[0].limitForUser
                            const proxBannedCommunity = (entity.bannedCommunities + 1)
                            dataEntityToUpdate = new entityModel(entity)

                            dataEntityToUpdate.bannedCommunities = proxBannedCommunity
                            if (proxBannedCommunity >= limitForUser) { // Si la cantidad de baneos de post llega al límite por usuario
                                const proxStrike = (entity.strikeCommunitiesCounter + 1)
                                const banData = await banLimitServices.getLimitByQuantity(proxStrike)
                                if (!banData.code) { // Se determina el baneo, fecha de inicio y fin del mismo de acuerdo a la cantidad de strikes                                            
                                    let banDate = moment();
                                    dataEntityToUpdate.strikeCommunitiesCounter = proxStrike
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

                reportToUpdate = await communityReportModel.findOneAndUpdate({ _id: body.id }, dataToUpdate, { new: true })
                if (reportToUpdate) { // al actualizar el reporte
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
        let rta, rtaError, entityModel, communityTypeModel, entity, entityID, communityID, dataToUpdate: any, reportToUpdate, dataEntityToUpdate
        const report = await communityReportModel.findOne({ _id: body.id, isEnabled: true })

        if (report) {
            if (report.reportedUserAdminID != undefined) {
                communityTypeModel = communityModel
                entityModel = userModel
                entityID = report.reportedUserAdminID
                communityID = report.reportedCommunityID
            } else if (report.reportedProfessionalAdminID != undefined) {
                communityTypeModel = professionalCommunityModel
                entityModel = professionalModel
                entityID = report.reportedProfessionalAdminID
                communityID = report.reportedProfessionalCommunityID
            }

            if (body.reportState == 4) { // Se omite el reporte
                dataToUpdate = new communityReportModel(report)
                dataToUpdate.reportingEntitiesIDS = []
                dataToUpdate.typeOfReports = []
                dataToUpdate.descriptions = []
                dataToUpdate.isEnabled = false
                dataToUpdate.reportState = 4
                reportToUpdate = await communityReportModel.findOneAndUpdate({ _id: body.id }, dataToUpdate, { new: true })
                if (reportToUpdate) { // Al actualziar el reporte, se habilita la comunidad nuevamente 
                    await communityTypeModel.findOneAndUpdate({ _id: communityID }, { isEnabled: true }, { new: true })
                    rta = reportToUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else if (body.reportState == 5) { // Se sanciona el reporte
                const limits = await reportingLimitServices.getLimits()
                if (limits.length > 0) {
                    reportToUpdate = await communityReportModel.findOneAndUpdate({ _id: body.id }, body, { new: true })

                    if (reportToUpdate) { // Al actualziar el reporte, se procede a sancionar debidamente al usuario
                        entity = await entityModel.findOne({ _id: entityID, isEnabled: true })
                        if (entity) {
                            const limitForUser = limits[0].limitForUser
                            const proxBannedCommunity = (entity.bannedCommunities + 1)
                            dataEntityToUpdate = new entityModel(entity)

                            dataEntityToUpdate.bannedCommunities = proxBannedCommunity
                            if (proxBannedCommunity >= limitForUser) {
                                const proxStrike = (entity.strikeCommunitiesCounter + 1)
                                const banData = await banLimitServices.getLimitByQuantity(proxStrike)
                                if (!banData.code) { // Se determina el baneo, fecha de inicio y fin del mismo de acuerdo a la cantidad de strikes
                                    let banDate = moment();
                                    dataEntityToUpdate.strikeCommunitiesCounter = proxStrike
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
        const reports = await communityReportModel.find({
            reportState: reportState
        }).populate([
            {
                path: 'reportedCommunityID',
                model: 'Communities',
            },
            {
                path: 'reportedProfessionalCommunityID',
                model: 'ProfessionalCommunities',
            },
            {
                path: 'reportedUserAdminID',
                model: 'Users',
            },
            {
                path: 'reportedProfessionalAdminID',
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
        const reports = await communityReportModel.find({
            $and: [
                { reportingEntitiesIDS: { $in: [entityID] } },
                { reportState: 0 },
                { isEnabled: true }
            ]
        }).populate([
            {
                path: 'reportedCommunityID',
                model: 'Communities',
            },
            {
                path: 'reportedProfessionalCommunityID',
                model: 'ProfessionalCommunities',
            },
            {
                path: 'reportedUserAdminID',
                model: 'Users',
            },
            {
                path: 'reportedProfessionalAdminID',
                model: 'ProfessionalProfiles',
            },
            {
                path: 'typeOfReports',
                model: 'TypeOfReports',
                select: 'description'
            }
        ])

        return reports
    }

    public async getByUserReported(entityID: any) {
        const reports = await communityReportModel.find({
            $or: [
                {
                    $and: [
                        {
                            $or: [
                                { reportedUserAdminID: entityID },
                                { reportedProfessionalAdminID: entityID }
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
                path: 'reportedCommunityID',
                model: 'Communities',
            },
            {
                path: 'reportedProfessionalCommunityID',
                model: 'ProfessionalCommunities',
            },
            {
                path: 'typeOfReports',
                model: 'TypeOfReports',
                select: 'description'
            }
        ])

        return reports
    }
}

export const communityReportServices = new CommunityReportServices()