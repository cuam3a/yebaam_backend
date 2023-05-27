import { ConstantsRS } from '../../utils/constants';
const certificateClassTypesModel = require('../../models/certificates/CertificateClassTypes.model');

class CertificateClassTypesServices {
    public async saveCertificateClassType(body: any) {
        let rta, rtaError
        const certificateClassType = await certificateClassTypesModel.findOne({ codeType: body.codeType })

        if (!certificateClassType) {
            const certificateClassTypeToSave = new certificateClassTypesModel(body);
            const certificateClassTypeSaved = await certificateClassTypeToSave.save()
            if (certificateClassTypeSaved) {
                rta = certificateClassTypeSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateCertificateClassType(body: any) {
        let rta, rtaError
        const certificateClassType = await certificateClassTypesModel.findOne({ _id: body.id })

        if (certificateClassType) {
            const certificateClassToUpdate = await certificateClassTypesModel.updateOne({ _id: body.id }, body);

            if (certificateClassToUpdate.nModified == 1) {
                rta = await certificateClassTypesModel.findById({ _id: body.id })
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteCertificateClassType(body: any) {
        let rta, rtaError
        const certificateClassType = await certificateClassTypesModel.findOne({ _id: body.id })

        if (certificateClassType) {
            if (!certificateClassType.inUse) {
                const certificateClassToDelete = await certificateClassTypesModel.deleteOne({ _id: body.id })
                if (certificateClassToDelete) {
                    rta = 'Tipo de clase de certificado eliminado satisfactoriamente'
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

    public async getByID(body: any) {
        let rta, rtaError
        const certificateClassType = await certificateClassTypesModel.findById(body.id)

        if (certificateClassType) {
            rta = certificateClassType
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError
        const certificateClassTypes = await certificateClassTypesModel.find()

        if (certificateClassTypes) {
            rta = certificateClassTypes
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }
}

export const certificateClassTypesServices = new CertificateClassTypesServices()