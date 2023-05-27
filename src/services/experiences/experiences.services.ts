import { ConstantsRS } from '../../utils/constants';
const experienceModel = require('../../models/experience/Experiences.model');
const professionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');

class ExperienceServices {
    public async saveExperience(body: any) {
        let rta, rtaError

        const existProfile = await professionalProfileModel.findOne({ _id: body.professionalProfileID })

        if (existProfile) {
            const experienceToSave = new experienceModel(body);
            const experienceSaved = await experienceToSave.save()
            if (experienceSaved) {
                const dataToUpdate = new professionalProfileModel(existProfile);
                dataToUpdate.experienceIDS.push(experienceSaved._id)
                const professionalUpdated = await professionalProfileModel.updateOne({ _id: body.professionalProfileID }, dataToUpdate)
                if (professionalUpdated) {
                    rta = experienceSaved
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.ACCOUNT_PROFESSIONAL_NON_EXISTENT
        }

        return {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : []
        }
    }

    public async updateExperience(body: any) {
        let rta, rtaError
        const experience = await experienceModel.findOne({ _id: body.id }).exec()

        if (experience) {
            const experienceToUpdate = await experienceModel.updateOne({ _id: body.id }, body);

            if (experienceToUpdate.nModified == 1) {
                rta = await experienceModel.findById({ _id: body.id })
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : null
        }
    }

    public async deleteExperience(body: any) {
        let rta, rtaError
        const experience = await experienceModel.findOne({ _id: body.id }).exec()

        if (experience) {
            const experienceToDelete = await experienceModel.updateOne({ _id: body.id }, { isEnabled: false })
            if (experienceToDelete.nModified == 1) {
                rta = 'Experiencia eliminada satisfactoriamente'
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : null
        }
    }

    public async getExperiencesByProfessional(body: any) {
        let experiences, rtaError
        const professional = await professionalProfileModel.findById(body.professionalProfileID)

        if (professional) {
            experiences = await experienceModel.find({
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
            success: experiences ? true : false,
            data: experiences ? experiences : null
        }
    }

    public async getUnfinishedExperiences(body: any) {
        let unfinishedExperiences, rtaError
        const professional = await professionalProfileModel.findById(body.professionalProfileID)

        if (professional) {
            unfinishedExperiences = await experienceModel.find({
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
            success: unfinishedExperiences ? true : false,
            data: unfinishedExperiences ? unfinishedExperiences : null
        }
    }
}

export const experienceServices = new ExperienceServices()