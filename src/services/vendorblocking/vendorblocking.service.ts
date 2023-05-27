import { ConstantsRS } from '../../utils/constants';

const vendorBlockingModel = require('../../models/vendorblocking/VendorBlocking.model');

class VendorBlockingServices {
    public async saveOrCancelVendorBlocking(body: any) {
        let rta, rtaError

        const vendorBlockingExist = await vendorBlockingModel.findOne({
            $and: [
                { sellerID: body.sellerID },
                { blockerID: body.blockerID }
            ]
        })

        if (!vendorBlockingExist) {
            let vendorBlockingToSave = new vendorBlockingModel(body)
            const vendorBlockingSaved = await vendorBlockingToSave.save()
            if (vendorBlockingSaved) {
                rta = vendorBlockingSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            let vendorLockCanceled = this.deleteLockById(vendorBlockingExist.id)
            if (vendorLockCanceled) {
                rta = vendorLockCanceled
            } else {
                rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
            }
        }

        return rta ? rta : rtaError
    }

    public async getBlockingExistence(body: any) {
        let rta, rtaError;
        const vendorBlockingExist = await vendorBlockingModel.findOne({
            $and: [
                { sellerID: body.sellerID },
                { blockerID: body.blockerID }
            ]
        })

        if (vendorBlockingExist) {
            rta = vendorBlockingExist
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError;
    }

    public async getLocksByBlockerID(blockerID: any) {
        let rta, rtaError;

        const sellersBlocked = await vendorBlockingModel.find({ blockerID: blockerID }).
            select('sellerID')

        if (sellersBlocked) {
            rta = sellersBlocked
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError;
    }

    public async getaAllLocksByBlockerID(body: any) {
        let rta, rtaError;

        const sellersBlocked = await vendorBlockingModel.find({ blockerID: body.blockerID })
            .populate({
                path: 'sellerID',
                model: 'Users'
            })

        if (sellersBlocked) {
            rta = sellersBlocked
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError;
    }

    public async deleteLockById(id: any) {
        let rta, rtaError;

        const vendorBlockingDeleted = await vendorBlockingModel.deleteOne({ _id: id })

        if (vendorBlockingDeleted) {
            rta = "Bloqueo cancelado correctamente"
        } else {
            rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
        }

        return rta ? rta : rtaError;
    }
}

export const vendorBlockingServices = new VendorBlockingServices()