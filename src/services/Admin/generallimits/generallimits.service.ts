import { ConstantsRS } from '../../../utils/constants';
const generalLimitsModel = require('../../../models/generallimits/GeneralLimits.model');

class GeneralLimitServices {
    public async saveGeneralLimit(body: any) {
        let rta, rtaError
        const limit = await generalLimitsModel.find({})
        if (limit.length == 0) {
            const limitToSave = new generalLimitsModel(body);
            const limitSaved = await limitToSave.save();

            if (limitSaved) {
                rta = limitSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.ONLY_RECORD
        }

        return rta ? rta : rtaError
    }

    public async updateGeneralLimit(body: any) {
        let rta, rtaError
        const limit = await generalLimitsModel.findById(body.id)
        if (limit) {
            const reportLimitToUpdate = await generalLimitsModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
            if (reportLimitToUpdate) {
                rta = reportLimitToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getLimits() {
        let rta, rtaError

        const limits = await generalLimitsModel.find({})
        if (limits.length > 0) {
            rta = limits
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByID(body: any) {
        let rta, rtaError
        const limit = await generalLimitsModel.findById(body.id)
        if (limit) {
            rta = limit
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const generalLimitServices = new GeneralLimitServices();