import { ConstantsRS } from "../../utils/constants";
const classifiedStatusModel = require("../../models/classifieds/ClassifiedsStatus.model");


class ClassifiedStatusServices {
    public async createClassifiedStatus(body: any) {
        let rta, rtaError

        const classifiedExist = await classifiedStatusModel.findOne({
            $or: [{ order: body.order }, { name: body.name }]
        })

        if (!classifiedExist) {
            const classifiedStatusToSave = new classifiedStatusModel(body);
            const classifiedStatusSaved = classifiedStatusToSave.save();
            if (classifiedStatusSaved) {
                rta = classifiedStatusSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS;
        }

        return rta ? rta : rtaError
    }

    public async updateClassifiedStatus(body: any) {
        let rta, rtaError

        let statusCategory = await classifiedStatusModel.findById(body.id)
        if (statusCategory) {
            const classifiedExist = await classifiedStatusModel.findOne({
                $or: [{ order: body.order }]
            })

            if (!classifiedExist) {
                const classifiedStatusUpdate = await classifiedStatusModel.findOneAndUpdate({ _id: body.id }, body, { new: true });
                if (classifiedStatusUpdate) {
                    rta = classifiedStatusUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                if (body.id == classifiedExist.id) {
                    const classifiedStatusUpdate = await classifiedStatusModel.findOneAndUpdate({ _id: body.id }, body, { new: true });
                    if (classifiedStatusUpdate) {
                        rta = classifiedStatusUpdate
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS;
                }
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteClassifiedStatusByID(body: any) {
        let rta, rtaError

        const status = await classifiedStatusModel.findById(body.id);
        if (status) {
            if (!status.inUse) {
                const classifiedStatusDeleted = await classifiedStatusModel.deleteOne({ _id: body.id });
                if (classifiedStatusDeleted) {
                    rta = "Estado de clasificado eliminado correctamente"
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

    public async getClassifiedStatusByID(id: any) {
        let rta, rtaError

        let status = await classifiedStatusModel.findById(id);
        if (status) {
            rta = status;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError

        let status = await classifiedStatusModel.find({}).sort({ order: 1 })
        if (status) {
            rta = status;
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }

    public async getFirstStatus() {
        let rta, rtaError

        let status = await classifiedStatusModel.findOne({}).sort({ order: 1 }).limit(1)
        if (status) {
            rta = status;
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }
}

export const classifiedStatusServices = new ClassifiedStatusServices();