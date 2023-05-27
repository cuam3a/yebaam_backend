import { ConstantsRS } from '../../../utils/constants';
import moment from "moment";
import { awardServices } from './awards.service';
const typeOfAwardModel = require('../../../models/typeofawards/TypeOfAwards.model');

class TypeOfAwardsServices {
    public async saveType(body: any) {
        let rta, rtaError

        const award = await typeOfAwardModel.findOne({ name: body.name })

        if (!award) {
            const typeOfAwardToSave = new typeOfAwardModel(body);
            const typeOfAwardSaved = await typeOfAwardToSave.save();

            if (typeOfAwardSaved) {
                rta = typeOfAwardSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateTypeByID(body: any) {
        let rta, rtaError, typeOfAwardToUpdate
        const type = await typeOfAwardModel.findById(body.id)
        if (type) {
            typeOfAwardToUpdate = await typeOfAwardModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
            if (typeOfAwardToUpdate) {
                rta = typeOfAwardToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteTypeByID(body: any) {
        let rta, rtaError, typeOfAwardToDelete
        const useTypeOA = await awardServices.getAwardByTypeAward({typeOfAwardID:body.id})
        if (!useTypeOA) {            
            const type = await typeOfAwardModel.findById(body.id)
            if (type) {
                typeOfAwardToDelete = await typeOfAwardModel.findOneAndUpdate({ _id: body.id }, { isEnabled: false }, { new: true })
                if (typeOfAwardToDelete) {
                    rta = 'Tipo de premio eliminado satisfactoriamente'
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
        const awards = await typeOfAwardModel.find({ isEnabled: true })
        if (awards.length > 0) {
            rta = awards
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByID(id: any) {
        let rta, rtaError
        const type = await typeOfAwardModel.findOne({ _id: id, isEnabled: true })
        if (type) {
            rta = type
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }
}

export const typeOfAwardsServices = new TypeOfAwardsServices()