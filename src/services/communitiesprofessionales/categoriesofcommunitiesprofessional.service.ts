const CategoriesOfCommunitiesProfessionalModel = require("../../models/communitiesprofessionales/CategoriesOfCommunitiesProfessional.model");
import { ConstantsRS } from '../../utils/constants';
import { professionalCommunitiesServices } from './professionalcommunities.service';

class CategoriesOfCommunitiesProfessionalServices {
    public async getCategoryByID(id: string) {
        try {
            let Category = await CategoriesOfCommunitiesProfessionalModel.findOne({ _id: id });
            if (Category) {
                return Category;
            } else {
                return ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async getCategoryByIDAndIsEnable(id: string) {
        try {
            let getCommunity = await CategoriesOfCommunitiesProfessionalModel.findOne({ $and: [{ _id: id }, { isEnabled: true }] });
            if (getCommunity) {
                return getCommunity;
            } else {
                return getCommunity = false;
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async getCategoryByName(name: string) {
        try {
            let Category
            Category = await CategoriesOfCommunitiesProfessionalModel.findOne({ name: name });
            if (Category) {
                return Category;
            } else {
                return Category
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async createCategoryCommunity(obj: any) {
        try {
            let createCategory;
            const getCategory = await this.getCategoryByName(obj.name);
            if (!getCategory) {
                const saveCategory = new CategoriesOfCommunitiesProfessionalModel(obj);
                createCategory = await saveCategory.save();
            } else {
                return ConstantsRS.THE_RECORD_ALREDY_EXISTS;
            }
            return createCategory;
        } catch (error) {
            console.log(error);
        }
    }
    public async deleteCategoryCommunityByID(id: string) {
        try {
            let deleteResponse;
            const useCategory = await professionalCommunitiesServices.getCommunitiesByCategoryId({categoryId:id})
            if (!useCategory) {
                deleteResponse = await CategoriesOfCommunitiesProfessionalModel.findOneAndDelete({ _id: id });
            } else {
                deleteResponse = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return deleteResponse;
        } catch (error) {
            console.log(error);
        }
    }
    public async updateCategoryCommunity(obj: any) {
        try {
            let updateResponse;
            let getCategory = await this.getCategoryByID(obj.id);
            if (getCategory) {
                updateResponse = await CategoriesOfCommunitiesProfessionalModel.findOneAndUpdate({ _id: obj.id }, obj, { new: true });
                return updateResponse;
            } else {
                return updateResponse;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllCategoriesEnabled() {
        return await CategoriesOfCommunitiesProfessionalModel.find({ isEnabled: true });
    }

    public async searchCategoryByNameEnabled(bodySearch: { search: string, limit: number, nextSkip: number, skip: number }) {

        let { limit, nextSkip, skip, search } = bodySearch;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if(!search) limit = 5;

        const results = await CategoriesOfCommunitiesProfessionalModel.find({ name: { $regex: `.*${search}`, $options: "i" } }, { name: 1, description: 1 })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : ( limit ? limit :ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }
}

export const categoriesOfCommunitiesProfessionalServices = new CategoriesOfCommunitiesProfessionalServices();