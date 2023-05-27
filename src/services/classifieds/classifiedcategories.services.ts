import { ConstantsRS } from "../../utils/constants";
const classifiedCategoriesModel = require("../../models/classifieds/ClassifiedCategories.model");

class ClassifiedCategoriesServices {
    public async saveClassifiedCategory(body: any) {
        let rta, rtaError

        const categoryExist = await classifiedCategoriesModel.findOne({ name: body.name })

        if (!categoryExist) {
            const classifiedStatusToSave = new classifiedCategoriesModel(body);
            const classifiedStatusSaved = classifiedStatusToSave.save();
            if (classifiedStatusSaved) {
                rta = classifiedStatusSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        return rta ? rta : rtaError
    }

    public async updateClassifiedCategory(body: any) {
        let rta, rtaError

        let categoryToUpdate = await classifiedCategoriesModel.findById(body.id)
        if (categoryToUpdate) {
            const categoryUpdated = await classifiedCategoriesModel.findOneAndUpdate({ _id: body.id }, body, { new: true });
            if (categoryUpdated) {
                rta = categoryUpdated
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteCategoryByID(body: any) {
        let rta, rtaError
        let getCategory = await this.getCategoryClassifiedByID(body);
        if (!getCategory.code) {
            if (!getCategory.inUse) {
                const reportToDelete = await classifiedCategoriesModel.deleteOne({ _id: body.id });
                if (reportToDelete) {
                    rta = "Categoría de clasificado eliminada correctamente"
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

    public async getCategoryClassifiedByID(body: any) {
        let rta, rtaError

        let getCategorie = await classifiedCategoriesModel.findById(body.id);
        if (getCategorie) {
            rta = getCategorie;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError

        let categories = await classifiedCategoriesModel.find({});
        if (categories) {
            rta = categories;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }
}

export const classifiedCategoriesServices = new ClassifiedCategoriesServices();