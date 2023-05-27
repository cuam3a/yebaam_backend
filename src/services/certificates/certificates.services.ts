import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../aws/aws.services';
import { similarServices } from '../similarservices/similar.services';
import { generalLimitServices } from '../Admin/generallimits/generallimits.service';
import { notificationsServices } from '../notifications/notifications.services';
const certificateModel = require('../../models/certificates/Certificates.model');
const certificateClassModel = require('../../models/certificates/ClassOfCertificates.model');
const profesionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');
const studyModel = require('../../models/studies/Studies.model');
const experienceModel = require('../../models/experience/Experiences.model');
import { userChallengeServices } from '../userchallenges/userchallenges.services';
import { userRankServices } from '../userranks/userranks.service';
import { brandRankingServices } from '../brandranking/brandranking.service';

class CertificatesServices {
    public async saveCertificateByProfessional(body: any, files: any) {
        try {
            let rta, rtaError, model, fileSaved, codeType

            const professional = await profesionalProfileModel.findById(body.professionalProfileID)
            if (professional) {
                const content = await similarServices.identifyStudyOrExperience(body.contentID)
                if (!content.code) {
                    switch (content.type) {
                        case "study":
                            model = studyModel
                            codeType = "COC001"
                            break;
                        case "experience":
                            model = experienceModel
                            codeType = "COC002"
                            break;
                        default:
                            model = studyModel
                            codeType = "COC001"
                            break;
                    }

                    const certificateClass = await certificateClassModel.findOne({ codeType: codeType })
                    if (certificateClass) {
                        body.certificateClassID = certificateClass._id
                        body.certificateClass = certificateClass.codeType
                        body.certificateConcept = certificateClass.forConcept
                    }
                    body.userID = professional.userID

                    if (files != undefined) {
                        console.log(files)
                        if (files.files) {
                            const file = files.files;
                            const objSaveFile = {
                                entityId: professional.userID,
                                file
                            }
                            fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                        }
                    }

                    const certificateToSave = new certificateModel(body);
                    certificateToSave.file = fileSaved
                    const certificateSaved = await certificateToSave.save()
                    if (certificateSaved) {
                        if (certificateClass) {
                            await certificateClassModel.updateOne({ _id: certificateClass.id }, { inUse: true })
                        }

                        const dataToUpdate = new model(content);
                        dataToUpdate.certificateIDS.push(certificateSaved._id)
                        const entityUpdated = await model.updateOne({ _id: body.contentID }, dataToUpdate)
                        if (entityUpdated) {
                            rta = certificateSaved
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                }

            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }

            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_SAVING_RECORD
        }
    }

    public async saveAuthCertificates(body: any, files: any) {
        let rta, rtaError, entityModel, fileSaved, concept

        const entity = await similarServices.identifyUserBrandOrCommunity(body.entityID)
        if (!entity.code) {
            switch (entity.type) {
                case "user":
                    body.userID = body.entityID
                    entityModel = userModel
                    concept = "user_auth"
                    break;
                case "marks":
                    body.trademarkID = body.entityID
                    entityModel = trademarkModel
                    concept = "mark_auth"
                    break;
                default:
                    body.userID = body.entityID
                    entityModel = userModel
                    concept = "user_auth"
                    break;
            }

            if (entity) {
                const certificateClass = await certificateClassModel.findOne({ forConcept: concept })

                if (certificateClass) {
                    body.certificateClassID = certificateClass._id
                    body.certificateClass = certificateClass.codeType
                    body.certificateConcept = certificateClass.forConcept
                }

                if (files != undefined) {
                    if (files.files) {
                        const file = files.files;
                        const objSaveFile = {
                            entityId: body.entityID,
                            file
                        }
                        fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                    }
                }

                const certificateToSave = new certificateModel(body);
                certificateToSave.file = fileSaved
                const certificateSaved = await certificateToSave.save()
                if (certificateSaved) {
                    if (certificateClass) {
                        await certificateClassModel.updateOne({ _id: certificateClass.id }, { inUse: true })
                    }

                    let dataEntityToUpdate = new entityModel(entity);
                    dataEntityToUpdate.authenticationData = {
                        certificateID: certificateSaved._id,
                        authenticated: false
                    }
                    const entityUpdated = await entityModel.updateOne({ _id: body.entityID }, dataEntityToUpdate)
                    if (entityUpdated) {
                        rta = certificateSaved
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.USER_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async changeStateByUser(body: any) {
        let rta, rtaError, certificateToUpdate

        const certificate = await certificateModel.findById(body.id)
        if (certificate) {
            if (certificate.state == 0 || certificate.state == 2) {
                if (body.state == 1) {
                    if (certificate.certificateConcept != "user_auth" && certificate.certificateConcept != "mark_auth") {
                        body.invalidationCounter = 0
                        body.requestPaid = true,
                        body.requestDate = new Date()
                    }

                    certificateToUpdate = await certificateModel.findOneAndUpdate({ _id: body.id }, body, { new: true });

                    if (certificateToUpdate) {
                        rta = certificateToUpdate
                        let whoIsNotified = 'A1', toNotify
                        toNotify = new certificateModel(certificateToUpdate)
                        toNotify.whoIsNotified = whoIsNotified
                        toNotify.notification = 'Notificación de certificado'
                        await notificationsServices.generateNotification(toNotify)
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.CANNOT_RUN_ACTION
                }
            } else {
                rtaError = ConstantsRS.CANNOT_RUN_ACTION
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async changeStateByAdmin(body: any) {
        let rta, rtaError, entityID, entityModel, authObject = {}, certificateToUpdate

        const certificate = await certificateModel.findById(body.id)

        if (certificate) {
            if (certificate.userID != undefined) {
                entityModel = userModel
                entityID = certificate.userID
            } else if (certificate.trademarkID != undefined) {
                entityModel = trademarkModel
                entityID = certificate.trademarkID
            } else if (certificate.professionalProfileID != undefined) {
                entityModel = profesionalProfileModel
                entityID = certificate.professionalProfileID
            }
            const entity = await similarServices.identifyUserBrandOrCommunity(entityID);

            if (body.state == 2) { // Se invalida la autenticación de usuario
                let proxInvalidationCounter
                if (certificate.certificateConcept != "user_auth" && certificate.certificateConcept != "mark_auth") {
                    let authDeniedLimit = 100
                    const deniedLimit = await generalLimitServices.getLimits()
                    if (!deniedLimit.code) {
                        if (deniedLimit.authDeniedLimit != undefined) {
                            authDeniedLimit = deniedLimit.authDeniedLimit
                        }
                    }

                    if (certificate.invalidationCounter != undefined) {
                        proxInvalidationCounter = certificate.invalidationCounter + 1
                    } else {
                        proxInvalidationCounter = 1
                    }

                    if (proxInvalidationCounter == authDeniedLimit) {
                        body.requestPaid = false
                    }
                }

                if (proxInvalidationCounter != null) {
                    certificateToUpdate = await certificateModel.findOneAndUpdate({ _id: body.id }, { state: 2, invalidationReason: body.invalidationReason, invalidationCounter: proxInvalidationCounter }, { new: true });
                } else {
                    certificateToUpdate = await certificateModel.findOneAndUpdate({ _id: body.id }, { state: 2, invalidationReason: body.invalidationReason }, { new: true });
                }
            } else if (body.state == 3) { // Se autentica la cuenta de usuario                
                if (certificate.certificateConcept == "user_auth" || certificate.certificateConcept == "mark_auth") {
                    let authenticatedUser = certificate.userID ? certificate.userID : certificate.trademarkID

                    authObject = {
                        authenticationData: {
                            certificateID: entity.authenticationData.certificateID,
                            authenticated: true
                        },
                    };
                    await entityModel.updateOne({ _id: entity._id }, authObject)

                    if (certificate.userID != undefined) {
                        /// Sumar avance de reto
                        await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_AUTHENTICATE_ACCOUNT.code, authenticatedUser, authenticatedUser)
                        // Sumar avance de ranking
                        await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_AUTHENTICATE_ACCOUNT.code, authenticatedUser, authenticatedUser)
                    } else if (certificate.trademarkID != undefined) {
                        // Sumar avance de ranking
                        await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_AUTHENTICATE_ACCOUNT.code, authenticatedUser, authenticatedUser)
                    }
                }

                certificateToUpdate = await certificateModel.findOneAndUpdate({ _id: body.id }, { state: 3 }, { new: true });

                if (certificateToUpdate) {
                    if (certificate.certificateClassID != undefined) {
                        let certificateClass = await certificateClassModel.findById(certificate.certificateClassID)
                        if (certificateClass) {
                            if (certificate.userID != undefined) {
                                await userRankServices.addSubstractScoreToEntity(entityID, certificateClass.scoreValue)
                            } else if (certificate.trademarkID != undefined) {
                                await brandRankingServices.addScoreToBrand(entityID, certificateClass.scoreValue)
                            }
                        }
                    }
                }
            }

            if (certificateToUpdate) {
                rta = certificateToUpdate
                let whoIsNotified, toNotify
                switch (certificateToUpdate.certificateConcept) {
                    case 'professional_auth':
                        whoIsNotified = 'P1'
                        break;
                    case 'user_auth':
                        whoIsNotified = 'U1'
                        break;
                    case 'mark_auth':
                        whoIsNotified = 'M1'
                        break;
                }
                toNotify = new certificateModel(certificateToUpdate)
                toNotify.whoIsNotified = whoIsNotified
                toNotify.notification = 'Notificación de certificado'
                await notificationsServices.generateNotification(toNotify)
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async updateCertificate(body: any, files: any) {
        let rta, rtaError, fileSaved
        const certificate = await certificateModel.findOne({ _id: body.id }).exec()

        if (certificate) {
            // if (certificate.state == 0) {
            if (body.state != undefined) {
                body.state = certificate.state
            }

            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: body.entityID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                    body.file = fileSaved
                }
            }

            const certificateToUpdate = await certificateModel.findOneAndUpdate({ _id: body.id }, body, { new: true });

            if (certificateToUpdate) {
                rta = certificateToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
            /* } else {
                rtaError = ConstantsRS.CANNOT_RUN_ACTION
            } */
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteCertificate(body: any) {
        let rta, rtaError
        const certificate = await certificateModel.findOne({ _id: body.id }).exec()

        if (certificate) {
            const certificateToDelete = await certificateModel.updateOne({ _id: body.id }, { isEnabled: false })
            if (certificateToDelete.nModified == 1) {
                rta = 'Certificado eliminado satisfactoriamente'
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteAuthCertificate(body: any) {
        let rta, rtaError, entityID, entityModel
        const certificate = await certificateModel.findOne({ _id: body.id }).exec()

        if (certificate) {
            if (certificate.userID != undefined) {
                entityModel = userModel
                entityID = certificate.userID
            } else if (certificate.trademarkID != undefined) {
                entityModel = trademarkModel
                entityID = certificate.trademarkID
            }

            const certificateToDelete = await certificateModel.deleteOne({ _id: body.id })
            if (certificateToDelete) {
                await entityModel.updateOne({ _id: entityID }, { authenticationData: {} })
                rta = 'Certificado de autenticación eliminado satisfactoriamente'
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getCertificatesByStateNConcept(body: any) {
        let rta, rtaError
        const certificates = await certificateModel.find({
            $and: [
                { certificateConcept: body.concept },
                { state: body.state },
                { isEnabled: true }
            ]
        }).populate([
            {
                path: 'userID',
                model: 'Users',
                match: { isEnabled: true },
            },
            {
                path: 'trademarkID',
                model: 'Trademarks',
                match: { isEnabled: true },
            },
            {
                path: 'professionalProfileID',
                model: 'ProfessionalProfiles',
                match: { isEnabled: true },
            },
            {
                path: 'certificateClassID',
                model: 'ClassOfCertificates'
            }
        ])

        if (certificates) {
            rta = certificates
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAuthCertificateByEntityID(body: any) {
        let rta, rtaError
        const certificate = await certificateModel.findOne({
            $and: [
                {
                    $or: [
                        { userID: body.entityID },
                        { trademarkID: body.entityID },
                    ]
                },
                {
                    $or: [
                        { certificateConcept: "user_auth" },
                        { certificateConcept: "mark_auth" },
                    ]
                }
            ]
        }).populate([
            {
                path: 'userID',
                model: 'Users'
            },
            {
                path: 'trademarkID',
                model: 'Trademarks'
            },
            {
                path: 'certificateClassID',
                model: 'ClassOfCertificates'
            }
        ])

        if (certificate) {
            rta = certificate
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    /* public async getCertificatesByProfessional(body: any) {
        let certificates, rtaError
        const professional = await profesionalProfileModel.findById(body.professionalProfileID)

        if (professional) {
            if (body.type != undefined) {
                certificates = await certificateModel.find({
                    $and: [{ professionalProfileID: professional.professionalProfileID }, { isEnabled: true }]
                })
                    .populate({
                        path: 'certificateClass',
                        model: 'ClassOfCertificates'
                    })
                    .sort('-creationDate')
            } else {
                certificates = await certificateModel.find({
                    $and: [{ userID: professional.userID }, { isEnabled: true }]
                })
                    .populate({
                        path: 'certificateClass',
                        model: 'ClassOfCertificates'
                    })
                    .sort('-creationDate')
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }
        return {
            error: rtaError ? rtaError : null,
            success: certificates ? true : false,
            data: certificates ? certificates : null
        }
    } */
}

export const certificatesServices = new CertificatesServices()