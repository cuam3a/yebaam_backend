import { ConstantsRS } from '../../utils/constants';
const professionalProfileModel = require('../../models/professionalprofile/ProfessionalProfiles.model');
const userModel = require('../../models/user/Users.model');
import { socialProfessionalServices } from '../social/socialprofessional.services';
import { userSettingsServices } from '../usersettings/usersettings.service';
const seedrandom = require('seedrandom');

class ProfessionalProfileServices {
    public async saveProfessionalProfile(body: any) {
        let rta, rtaError, entityUpdated
        const user = await userModel.findById({ _id: body.userID })

        if (user) {
            if (user.isEmailVerified) {
                const existProfile = await professionalProfileModel.findOne({ userID: body.userID })
                if (!existProfile) {
                    let prof = { ...body, socketID:user.socketID }
                    const professionalToSave = new professionalProfileModel(prof);
                    const professionalSaved = await professionalToSave.save()
                    if (professionalSaved) {
                        entityUpdated = await userModel.updateOne({ _id: body.userID }, { professionalProfileID: professionalSaved._id, hasProfessionalProfile: true })
                        if (entityUpdated.nModified == 1) {
                            rta = professionalSaved
                            let rng = new seedrandom();
                            const code = (rng()).toString().substring(3, 10);
                            let res = Number(code)
                            let numericIdentifier = res
                            await professionalProfileModel.findOneAndUpdate({ _id: professionalSaved }, { numericIdentifier: numericIdentifier }, { new: true })
                            let bodySettings = { entityId: professionalSaved.id }
                            const getUserSettings = await userSettingsServices.getUserSettingsByEntityId({ entityId: professionalSaved.id })
                            if (!getUserSettings) {
                                await userSettingsServices.createUserSettings(bodySettings)
                            }
                        } else {
                            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }
                } else {
                    if (existProfile.isEnabled) {
                        rtaError = ConstantsRS.ACCOUNT_PROFESSIONAL_ENABLED
                    } else {
                        let professionalProfileUpdated = await professionalProfileModel.findOneAndUpdate({ _id: existProfile.id }, { socketID:user.socketID, isEnabled: true }, { new: true })
                        if (professionalProfileUpdated) {
                            entityUpdated = await userModel.updateOne({ _id: body.userID }, { professionalProfileID: professionalProfileUpdated._id, hasProfessionalProfile: true })
                            if (entityUpdated) {
                                await this.actionsWhenRestoreProfessional(body.id)
                            }
                            rta = professionalProfileUpdated
                        }
                    }
                }
            } else {
                rtaError = ConstantsRS.EMAIL_IS_NOT_VERIFY
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return {
            error: rtaError ? rtaError : null,
            success: rta ? true : false,
            data: rta ? rta : []
        }
    }

    public async updateProfessionalProfile(body: any) {
        let rta, rtaError
        const professional = await professionalProfileModel.findOne({ _id: body.id }).exec()

        if (professional) {
            const professionalToUpdated = await professionalProfileModel.updateOne({ _id: body.id }, body);

            if (professionalToUpdated.nModified == 1) {
                rta = await professionalProfileModel.findById({ _id: body.id })
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

    public async deleteProfessionalProfile(body: any) {
        let rta, rtaError
        const professional = await professionalProfileModel.findOne({ _id: body.id }).exec()

        if (professional) {
            const professionalToDelete = await professionalProfileModel.updateOne({ _id: body.id }, { isEnabled: false })
            if (professionalToDelete.nModified == 1) {
                const entityUpdated = await userModel.updateOne({ _id: professional.userID }, { hasProfessionalProfile: false })
                if (entityUpdated.nModified == 1) {
                    await this.actionsWhenDeletingProfessional(body.id)
                    rta = 'Perfil profesional eliminado satisfactoriamente'
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
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

    public async getAllProfessionalProfile() {
        try {
            let allProfessional
            const getProfessional = await professionalProfileModel.find({})
            getProfessional ? allProfessional = getProfessional : allProfessional
            return allProfessional
        } catch (error) {
            console.log(error);
        }
    }

    public async getProfessionalsProfilesByCriteria(body: any) {
        try {
            let rta, rtaError, professionals

            if (body.limit != undefined) {
                professionals = await professionalProfileModel.find({ name: { $regex: body.textString, $options: "i" } })
                    .limit(body.limit)
                    .sort({ name: 1 })
            }

            if (professionals.length > 0) {
                if (body.professionalProfileID != undefined) {
                    for await (let professional of professionals) {
                        const socialIDS = {
                            firstID: body.professionalProfileID,
                            secondID: professional._id
                        }
                        const socialConnection = await socialProfessionalServices.getSocialConnectionByIDSWithOutRes(socialIDS)
                        if (socialConnection) {
                            professional.socialWith = socialConnection
                        }
                    }
                }
                rta = professionals
            } else {
                rtaError = ConstantsRS.NO_PROFESSIONALS_FOUND
            }

            return {
                error: rtaError ? rtaError : null,
                success: rta ? true : false,
                data: rta ? rta : null
            }
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    public async deleteProfessionalByIDOnlyDev(body: any) {
        let rta, rtaError
        const professional = await professionalProfileModel.findById(body.id)

        if (professional) {
            const professionalProfileToDelete = await professionalProfileModel.deleteOne({ _id: body.id })
            if (professionalProfileToDelete.deletedCount == 1) {
                rta = 'Perfil profesional eliminado satisfactoriamente'
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async actionsWhenDeletingProfessional(professionalID: any) {
        let socialConections = await socialProfessionalServices.getSocialConnectionsByEntityID(professionalID)
        if (!socialConections.code) {
            await socialProfessionalServices.disableSocialConnections(socialConections)
        }
    }

    public async actionsWhenRestoreProfessional(professionalID: any) {
        let socialConections = await socialProfessionalServices.getSocialConnectionsByEntityID(professionalID)
        if (!socialConections.code) {
            await socialProfessionalServices.enableSocialConnections(socialConections)
        }
    }
}

export const professionalProfileServices = new ProfessionalProfileServices()