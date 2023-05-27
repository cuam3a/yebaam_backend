import { ConstantsRS } from '../../utils/constants';
const reportingLimitsModel = require('../../models/postsreports/ReportingLimits.model');

class ReportingLimitServices {
    public async saveReportLimit(body: any) {
        let rta, rtaError
        const limit = await reportingLimitsModel.find({})
        if (limit.length == 0) {
            const limitToSave = new reportingLimitsModel(body);
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

    public async updateReportLimitByID(body: any) {
        let rta, rtaError
        const limit = await reportingLimitsModel.findById(body.id)
        if (limit) {
            const reportLimitToUpdate = await reportingLimitsModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
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
        const limits = await reportingLimitsModel.find({})
        return limits
    }

    public async getByID(body: any) {
        let rta, rtaError
        const limit = await reportingLimitsModel.findById(body.id)
        if (limit) {
            rta = limit
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const reportingLimitServices = new ReportingLimitServices();