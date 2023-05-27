import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
const typeOfReportModel = require('../../models/postsreports/TypeOfReports.model');

class TypeOfReportServices {
    public async saveType(body: any) {
        let rta, rtaError

        const type = await typeOfReportModel.findOne({ description: body.description })

        if (!type) {
            const typeOfReportToSave = new typeOfReportModel(body);
            const typeOfReportSaved = await typeOfReportToSave.save();

            if (typeOfReportSaved) {
                rta = typeOfReportSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateTypeByID(body: any) {
        let rta, rtaError, typeOfReportToUpdate
        const type = await typeOfReportModel.findById(body.id)
        if (type) {
            typeOfReportToUpdate = await typeOfReportModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
            if (typeOfReportToUpdate) {
                rta = typeOfReportToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteTypeByID(body: any) {
        let rta, rtaError
        const type = await typeOfReportModel.findById(body.id)

        if (type) {
            if (!type.inUse) {
                const certificateClassToDelete = await typeOfReportModel.deleteOne({ _id: body.id })
                if (certificateClassToDelete.deletedCount == 1) {
                    rta = 'Tipo de reporte eliminado satisfactoriamente'
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError
        const getAll = await typeOfReportModel.find({})
        if (getAll.length > 0) {
            rta = getAll
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByID(id: any) {
        let rta, rtaError
        const type = await typeOfReportModel.findById(id)
        if (type) {
            rta = type
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }
}

export const typeOfReportServices = new TypeOfReportServices()