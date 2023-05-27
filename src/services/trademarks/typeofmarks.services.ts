import { ConstantsRS } from '../../utils/constants';
const typeofmarksModel = require('../../models/typeofmarks/TypeOfMarks.model');
class TypeofmarksServices {
    public async createTypeofmark(obj: any) {
        let rta, rtaError
        const validateName = await this.getTypeofmarkByName(obj.name)

        if (validateName.code) {
            const typeMarkToSave = new typeofmarksModel(obj)
            const typeMarkSaved = await typeMarkToSave.save();
            if (typeMarkSaved) {
                rta = typeMarkSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async getTypeofmarks() {
        let rta, rtaError

        const typeMarks = await typeofmarksModel.find({});
        if (typeMarks.length > 0) {
            rta = typeMarks
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }

    public async getTypeofmarkByID(id: string) {
        let rta, rtaError

        const typeMark = await typeofmarksModel.findOne({ _id: id });
        if (typeMark) {
            rta = typeMark
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getTypeofmarkByName(name: string) {
        let rta, rtaError
        const typeMark = await typeofmarksModel.findOne({ name: name });
        if (typeMark) {
            rta = typeMark
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }
        return rta ? rta : rtaError
    }

    public async updateTypeofmark(obj: any) {
        let rta, rtaError, typeUpdated
        const validateName = await this.getTypeofmarkByName(obj.name)
        if (validateName.code != undefined) {
            typeUpdated = await typeofmarksModel.findOneAndUpdate({ _id: obj.id }, obj, { new: true });
            if (typeUpdated) {
                rta = typeUpdated
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            if (validateName.id == obj.id) {
                typeUpdated = await typeofmarksModel.findOneAndUpdate({ _id: obj.id }, obj, { new: true });
                if (typeUpdated) {
                    rta = typeUpdated
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            }
        }
        return rta ? rta : rtaError
    }

    public async deleteTypeofmark(id: string) {
        let rta, rtaError

        let typeBrandExist = await typeofmarksModel.findById(id)
        if (typeBrandExist) {
            if (!typeBrandExist.inUse) {
                const typeMark = await typeofmarksModel.deleteOne({ _id: id });
                if (typeMark) {
                    rta = typeMark
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
}

export const typeofmarksServices = new TypeofmarksServices()