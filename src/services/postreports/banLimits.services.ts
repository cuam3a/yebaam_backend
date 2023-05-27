import { ConstantsRS } from '../../utils/constants';
import moment from 'moment';
const banLimitModel = require('../../models/postsreports/BanLimits.model');

class BanLimitServices {
    public async saveBanLimit(body: any) {
        let rta, rtaError
        const limit = await banLimitModel.findOne({
            $or: [
                { strikeQuantity: body.strikeQuantity },
                { $and: [{ strikeQuantity: body.strikeQuantity }, { isLimit: true }] },
            ]
        })
        if (!limit) {
            let limitToSave = new banLimitModel(body);

            if (body.limitToClose != undefined) {
                let dataToUpdate = {
                    banDays: body.limitToClose.banDays,
                    isLimit: false
                }
                await banLimitModel.updateOne({ _id: body.limitToClose.id }, dataToUpdate)

                limitToSave.isLimit = true
            }

            const limitSaved = await limitToSave.save();

            if (limitSaved) {
                rta = limitSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateBanLimitByID(body: any) {
        let rta, rtaError, banLimitToUpdate
        const limit = await banLimitModel.findById(body.id)
        if (limit) {
            const existLimit = await banLimitModel.findOne({
                $or: [
                    { strikeQuantity: body.strikeQuantity },
                    { $and: [{ strikeQuantity: body.strikeQuantity }, { isLimit: true }] },
                ]
            })

            if (existLimit) {
                if (existLimit.id == body.id) {
                    banLimitToUpdate = await banLimitModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
                } else {
                    rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
                }
            } else {
                banLimitToUpdate = await banLimitModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
            }

            if (banLimitToUpdate) {
                rta = banLimitToUpdate
            } else {
                if (rtaError.code == undefined) {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteBanLimit(body: any) {
        let rta, rtaError
        const limit = await banLimitModel.findById(body.id).exec()

        if (limit) {
            const banLimitToDelete = await banLimitModel.deleteOne({ _id: body.id });

            if (banLimitToDelete) {
                rta = "Límite de baneo eliminado satisfactoriamente"
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getLimit() {
        let rta, rtaError

        const banLimit = await banLimitModel.findOne({ isLimit: true })
        if (banLimit) {
            rta = banLimit
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getLimitByQuantity(quantity: any) {
        let rta, rtaError

        const banLimit = await banLimitModel.findOne({ strikeQuantity: quantity })
        if (banLimit) {
            rta = banLimit
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getLimitById(body: any) {
        let rta, rtaError

        const banLimit = await banLimitModel.findById(body.id)
        if (banLimit) {
            rta = banLimit
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getAllLimits() {
        let rta, rtaError

        const allBanLimits = await banLimitModel.find({})
        if (allBanLimits) {
            rta = allBanLimits
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const banLimitServices = new BanLimitServices();