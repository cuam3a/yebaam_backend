import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
import { awardServices } from '../Admin/awards/awards.service';
import { userChallengeServices } from '../userchallenges/userchallenges.services';
const challengeModel = require('../../models/challenges/Challenges.model');
const systemActionModel = require('../../models/systemactions/SystemActions.model');

class ChallengeServices {
    public async saveChallenge(body: any) {
        let rta, rtaError
        const systemAction = await systemActionModel.findById(body.systemActionID)
        const challenge = await challengeModel.findOne({
            $and: [{ systemActionID: body.systemActionID }, { quantity: body.quantity }]
        })

        if (!challenge) {
            if (systemAction) {
                body.actionCode = systemAction.actionCode
                const challengeToSave = new challengeModel(body);
                const challengeSaved = await challengeToSave.save();

                if (challengeSaved) {
                    rta = await challengeModel.findById(challengeSaved.id)
                        .populate({
                            path: 'systemActionID',
                            model: 'SystemActions'
                        })
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateChallenge(body: any) {
        let rta, rtaError, challengeToUpdate
        const challenge = await challengeModel.findById(body.id).exec()

        if (challenge) {
            if (body.systemActionID != undefined) {
                const systemAction = await systemActionModel.findById(body.systemActionID)
                if (systemAction) {
                    body.actionCode = systemAction.actionCode
                    challengeToUpdate = await challengeModel.updateOne({ _id: body.id }, body);
                    if (challengeToUpdate.nModified == 1) {
                        rta = await challengeModel.findById(body.id)
                            .populate({
                                path: 'systemActionID',
                                model: 'SystemActions'
                            })
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
                }
            } else {
                challengeToUpdate = await challengeModel.updateOne({ _id: body.id }, body);
                if (challengeToUpdate.nModified == 1) {
                    rta = await challengeModel.findById(body.id)
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteChallenge(body: any) {
        let rta, rtaError
        const useChallengeA = await awardServices.getAwardByChallenge({challengeId:body.id})
        const useChallengeU = await userChallengeServices.getUserChallengesByChallenge({challengeId:body.id})
        if (!useChallengeA && !useChallengeU) {
            const challenge = await challengeModel.findById(body.id).exec()
            if (challenge) {
                const challengeToDelete = await challengeModel.updateOne({ _id: body.id }, { isEnabled: false });
    
                if (challengeToDelete.nModified == 1) {
                    rta = "Reto eliminado satisfactoriamente"
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

    public async getAllActive(body: any) {
        let rta, rtaError, date = moment(Date.now()).toDate();
        const challenges = await challengeModel.find({
            $or: [
                { $and: [{ validity: { $lt: date } }, { isEnabled: true }] },
                { isEnabled: true }
            ]
        }).populate(
            {
                path: 'systemActionID',
                model: 'SystemActions'
            }
        )

        if (challenges.length > 0) {
            rta = challenges
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getChallenegeByAction(body: any) {
        const challenges = await challengeModel.find({
             $and: [{ systemActionID: body.systemActionID }, { isEnabled: true }] 
            })
        return challenges
    }
}

export const challengeServices = new ChallengeServices()
