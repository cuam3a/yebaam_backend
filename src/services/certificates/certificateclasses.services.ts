import { ConstantsRS } from '../../utils/constants';
import { similarServices } from '../similarservices/similar.services';
const certificateClassModel = require('../../models/certificates/ClassOfCertificates.model');
const certificateClassTypesModel = require('../../models/certificates/CertificateClassTypes.model');

class CertificateClassesServices {
    public async saveCertificateClass(body: any) {
        let rta, rtaError
        const certificateClass = await certificateClassModel.findOne({ typeID: body.typeID })

        if (!certificateClass) {
            const certificateClassType = await certificateClassTypesModel.findById(body.typeID)

            if (certificateClassType) {
                const certificateClassToSave = new certificateClassModel(body);
                certificateClassToSave.name = certificateClassType.name
                certificateClassToSave.codeType = certificateClassType.codeType
                certificateClassToSave.forConcept = certificateClassType.forConcept
                const certificateClassSaved = await certificateClassToSave.save()
                if (certificateClassSaved) {
                    await certificateClassTypesModel.updateOne({ _id: certificateClassType.id }, { inUse: true })
                    rta = certificateClassSaved
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.MUST_ASSOCIATE_CERTIFICATE_TYPE
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateCertificateClass(body: any) {
        let rta, rtaError, certificateClassToUpdate, certificateClassType

        const certificateClass = await certificateClassModel.findOne({ _id: body.id }).exec()

        if (certificateClass) {
            if (body.typeID != undefined) {
                const certificateClass = await certificateClassModel.findOne({ typeID: body.typeID })

                if (!certificateClass) {
                    certificateClassType = await certificateClassTypesModel.findById(body.typeID)
                    if (certificateClassType) {
                        body.name = certificateClassType.name
                        body.codeType = certificateClassType.codeType
                        body.forConcept = certificateClassType.forConcept
                    }

                    certificateClassToUpdate = await certificateClassModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
                } else {
                    if (certificateClass.id == body.id) {
                        certificateClassType = await certificateClassTypesModel.findById(body.typeID)
                        if (certificateClassType) {
                            body.name = certificateClassType.name
                            body.codeType = certificateClassType.codeType
                            body.forConcept = certificateClassType.forConcept
                        }

                        certificateClassToUpdate = await certificateClassModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
                    } else {
                        rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
                    }
                }

                if (certificateClassToUpdate && certificateClassType) {
                    await certificateClassTypesModel.updateOne({ _id: certificateClassType.id }, { inUse: true })
                }
            } else {
                certificateClassToUpdate = await certificateClassModel.findOneAndUpdate({ _id: body.id }, body, { new: true })
            }

            if (certificateClassToUpdate) {
                rta = certificateClassToUpdate
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

    public async deleteCertificateClass(body: any) {
        let rta, rtaError
        const certificateClass = await certificateClassModel.findOne({ _id: body.id }).exec()

        if (certificateClass) {
            if (!certificateClass.inUse) {
                const certificateClassToDelete = await certificateClassModel.deleteOne({ _id: body.id })
                if (certificateClassToDelete) {
                    rta = 'Clase de certificado eliminada satisfactoriamente'
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

    public async certificateClassesByConcept(body: any) {
        let rta, rtaError
        const certificateClasses = await certificateClassModel.find({ forConcept: body.concept }).exec()

        if (certificateClasses) {
            rta = certificateClasses
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }
}

export const certificateClassesServices = new CertificateClassesServices()