const categoriesOfCommunitiesModel = require("../../models/communities/CategoriesOfCommunities.model");
import { ConstantsRS } from '../../utils/constants';
import { communitiesServices } from './community.services';

class CategoriesCommunityServices {
    public async getCategoryByID(id: string) {
        try {
            let Category = await categoriesOfCommunitiesModel.findOne({ _id: id });
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
            let getCommunity = await categoriesOfCommunitiesModel.findOne({ $and: [{ _id: id }, { isEnabled: true }] });
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
            Category = await categoriesOfCommunitiesModel.findOne({ name: name });
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
                const saveCategory = new categoriesOfCommunitiesModel(obj);
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
            let deleteResponse, rta, rtaError;
            const useCategory = await communitiesServices.getCommunityByCategory({categoryCommunityId:id})
            if (!useCategory) {
                let getCategoryCommunity = await this.getCategoryByID(id);
                if (getCategoryCommunity) {
                    deleteResponse = await categoriesOfCommunitiesModel.deleteOne({ _id: id });
                    rta = deleteResponse;
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
        }
    }
    public async updateCategoryCommunity(obj: any) {
        try {
            let updateResponse;
            let getCategory = await this.getCategoryByID(obj.id);
            if (getCategory) {
                updateResponse = await categoriesOfCommunitiesModel.findOneAndUpdate({ _id: obj.id }, obj, { new: true });
                return updateResponse;
            } else {
                return ConstantsRS.ERROR_UPDATING_RECORD
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllCategoriesEnabled() {
        return await categoriesOfCommunitiesModel.find({ isEnabled: true });
    }

    public async searchCategoryByNameEnabled(bodySearch: { search: string, limit: number, nextSkip: number, skip: number }) {

        let { limit, nextSkip, skip, search } = bodySearch;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (!search) limit = 5;

        const results = await categoriesOfCommunitiesModel.find({ name: { $regex: `.*${search}`, $options: "i" } }, { name: 1, description: 1 })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }
}

export const categoriesCommunityServices = new CategoriesCommunityServices();