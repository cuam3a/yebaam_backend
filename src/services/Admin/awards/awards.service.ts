import { ConstantsRS } from '../../../utils/constants';
import { awsServiceS3 } from '../../aws/aws.services';
import { userChallengeServices } from '../../userchallenges/userchallenges.services';
const awardModel = require('../../../models/admin/awards/Awards.model');

class AwardServices {
    public async saveAward(body: any, files: any) {
        let rta, rtaError, fileSaved

        const award = await awardModel.findOne({ name: body.name })

        if (!award) {
            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: body.adminID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }

            const awardToSave = new awardModel(body)
            awardToSave.image = fileSaved
            const awardSaved = await awardToSave.save()

            if (awardSaved) {
                const awardInfo = await awardModel.findById(awardSaved.id)
                    .populate("typeOfAwardID")
                    .populate("challengeIDS")

                rta = awardInfo
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateAwardByID(body: any, files: any) {
        let rta, rtaError, awardToUpdate, fileSaved
        const award = await awardModel.findById(body.id)
        if (award) {
            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: body.adminID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                    body.image = fileSaved
                }
            }

            awardToUpdate = await awardModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
                .populate("typeOfAwardID")
                .populate("challengeIDS")

            if (awardToUpdate) {
                rta = awardToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteAwardByID(body: any) {
        let rta, rtaError, awardToDelete
        const useAward = await userChallengeServices.getUserChallengesByAwrad({awardId:body.id})
        if (useAward.length == 0) {    
            const award = await awardModel.findById(body.id)
            if (award) {
                awardToDelete = await awardModel.findOneAndUpdate({ _id: body.id }, { isEnabled: false }, { new: true })
                if (awardToDelete) {
                    rta = 'Premio eliminado satisfactoriamente'
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError
        const awards = await awardModel.find({ isEnabled: true })
            .populate("typeOfAwardID")
            .populate("challengeIDS")

        if (awards.length > 0) {
            rta = awards
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByID(id: any) {
        let rta, rtaError
        const award = await awardModel.findOne({ _id: id, isEnabled: true })
            .populate("typeOfAwardID")
            .populate("challengeIDS")

        if (award) {
            rta = award
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAllByChallenge(challengeID: any) {
        let rta, rtaError
        const awards = await awardModel.find({
            $and: [{ challengeIDS: { $in: [challengeID] } }, { isEnabled: true }],
        }).populate("typeOfAwardID")
            .populate("challengeIDS")

        if (awards.length > 0) {
            rta = awards
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getAwardByTypeAward(body: any) {
        try {            
            const award = await awardModel.find({ typeOfAwardID: body.typeOfAwardID, isEnabled: true })
            return award
        } catch (error) {
            console.log(error);            
        }
    }

    public async getAwardByChallenge(body: any) {
        try {            
            const award = await awardModel.find({
                $and: [{ challengeIDS: { $in: [body.challengeId] } }, { isEnabled: true }],
              })
            return award
        } catch (error) {
            console.log(error);            
        }
    }
}

export const awardServices = new AwardServices()