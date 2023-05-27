import { ConstantsRS } from '../../utils/constants';
const studyModel = require('../../models/studies/Studies.model');
const professionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');

class StudyServices {
    public async saveStudy(body: any) {
        let rta, rtaError, response = {}

        const existProfile = await professionalProfileModel.findOne({ _id: body.professionalProfileID })

        if (existProfile) {
            const study = await studyModel.findOne({
                $and: [
                    { degree: body.degree },
                    { professionalProfileID: body.professionalProfileID },
                    { isEnabled: true }
                ]
            })

            if (!study) {
                const studyToSave = new studyModel(body);
                const studySaved = await studyToSave.save()
                if (studySaved) {
                    const dataToUpdate = new professionalProfileModel(existProfile);
                    dataToUpdate.studyIDS.push(studySaved._id)
                    const professionalUpdated = await professionalProfileModel.updateOne({ _id: body.professionalProfileID }, dataToUpdate)
                    if (professionalUpdated.nModified == 1) {
                        rta = studySaved
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            }
        } else {
            rtaError = ConstantsRS.ACCOUNT_PROFESSIONAL_NON_EXISTENT
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : []
        }
    }

    public async updateStudy(body: any) {
        let rta, rtaError, response = {}
        const study = await studyModel.findOne({ _id: body.id }).exec()

        if (study) {
            const studyToUpdate = await studyModel.updateOne({ _id: body.id }, body);

            if (studyToUpdate.nModified == 1) {
                rta = await studyModel.findById({ _id: body.id })
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : null
        }
    }

    public async deleteStudy(body: any) {
        let rta, rtaError, response = {}
        const study = await studyModel.findOne({ _id: body.id }).exec()

        if (study) {
            const studyToDelete = await studyModel.updateOne({ _id: body.id }, { isEnabled: false })
            if (studyToDelete.nModified == 1) {
                rta = 'Estudio eliminado satisfactoriamente'
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : null
        }
    }

    public async getStudiesByProfessional(body: any) {
        let studies, rtaError
        const professional = await professionalProfileModel.findById(body.professionalProfileID)

        if (professional) {
            studies = await studyModel.find({
                $and: [{ professionalProfileID: body.professionalProfileID }, { isEnabled: true }]
            })
                .populate({
                    path: 'certificateIDS',
                    model: 'Certificates',
                    match: { isEnabled: true },
                    populate: {
                        path: 'certificateClassID',
                        model: 'ClassOfCertificates',
                    }
                })
                .sort('-creationDate')
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }
        return {
            error: rtaError ? rtaError : null,
            success: studies ? true : false,
            data: studies ? studies : null
        }
    }

    public async getUnfinishedStudies(body: any) {
        let unfinishedStudies, rtaError
        const professional = await professionalProfileModel.findById(body.professionalProfileID)

        if (professional) {
            unfinishedStudies = await studyModel.find({
                $and: [
                    { professionalProfileID: body.professionalProfileID },
                    { isCurrently: true },
                    { isEnabled: true }
                ]
            })
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return {
            error: rtaError ? rtaError : null,
            success: unfinishedStudies ? true : false,
            data: unfinishedStudies ? unfinishedStudies : null
        }
    }
}

export const studyServices = new StudyServices()