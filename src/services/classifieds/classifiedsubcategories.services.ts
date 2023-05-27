const classifiedSubcategoriesModel = require("../../models/classifieds/ClassifiedsSubcategories.model");
const classifiedCategoriesModel = require("../../models/classifieds/ClassifiedCategories.model");
import { classifiedCategoriesServices } from './classifiedcategories.services';
import { ConstantsRS } from '../../utils/constants';

class ClassifiedSubcategoriesServices {
    public async saveClassifiedSubcategory(body: any) {
        let rta, rtaError

        const categoryExist = await classifiedCategoriesServices.getCategoryClassifiedByID(body.categoryID)
        if (categoryExist) {
            let subcategoryExist = await classifiedSubcategoriesModel.findOne({
                $and: [{ name: body.name }, { categoryID: body.categoryID }]
            });

            if (!subcategoryExist) {
                const saveToSubCategory = new classifiedSubcategoriesModel(body);
                const subcategorySaved = saveToSubCategory.save();
                if (subcategorySaved) {
                    await classifiedCategoriesModel.updateOne({ _id: categoryExist.id }, { inUse: true })
                    rta = subcategorySaved
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            }
        } else {
            rtaError = ConstantsRS.MUST_ASSOCIATE_CATEGORY
        }

        return rta ? rta : rtaError;
    }

    public async updateClassifiedSubcategory(body: any) {
        let rta, rtaError

        let subcategoryToUpdate = await classifiedSubcategoriesModel.findById(body.id)
        if (subcategoryToUpdate) {
            const categoryExist = await classifiedCategoriesServices.getCategoryClassifiedByID(body.categoryID)
            if (categoryExist) {
                let subcategoryExist = await classifiedSubcategoriesModel.findOne({
                    $and: [{ name: body.name }, { categoryID: body.categoryID }]
                });

                if (!subcategoryExist) {
                    const subcategoryUpdated = await classifiedSubcategoriesModel.findOneAndUpdate({ _id: body.id }, body, { new: true });

                    if (subcategoryUpdated) {
                        await classifiedCategoriesModel.updateOne({ _id: categoryExist.id }, { inUse: true })
                        rta = subcategoryUpdated
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
                }
            } else {
                rtaError = ConstantsRS.MUST_ASSOCIATE_CATEGORY
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getSubcategoriesByCategoryID(body: any) {
        let rta

        if (body.categoryID != undefined) {
            let subcategories = await classifiedSubcategoriesModel.find({ categoryID: body.categoryID });
            rta = subcategories;
        }

        return rta
    }

    public async deleteSubcategoryClassifiedByID(body: any) {
        let rta, rtaError
        let subcategory = await this.getSubcategoryClassifiedByID(body.id);
        if (!subcategory.code) {
            if (!subcategory.inUse) {
                const reportToDelete = await classifiedSubcategoriesModel.deleteOne({ _id: body.id });
                if (reportToDelete) {
                    rta = "Subcategoría de clasificado eliminada correctamente"
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

    public async getSubcategoryClassifiedByID(id: string) {
        let rta, rtaError
        let subcategorie = await classifiedSubcategoriesModel.findById(id);
        if (subcategorie) {
            rta = subcategorie;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }
        return rta ? rta : rtaError
    }

    public async getAll(id: string) {
        let rta, rtaError
        let subcategories = await classifiedSubcategoriesModel.find({});
        if (subcategories) {
            rta = subcategories;
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }
        return rta ? rta : rtaError
    }
}

export const classifiedSubcategoriesServices = new ClassifiedSubcategoriesServices();