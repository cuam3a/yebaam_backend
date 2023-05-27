const RolCommunitiesModel = require("../../models/communities/CommunityRoles.model");
import { ConstantsRS } from "../../utils/constants";
import { userRequestCommunityService } from "./userRequestCommunity.service";

class RolCommunitiesServices {

    public async getRolCommunityByName(name: string) {
        try {
            let rolCommunity = await RolCommunitiesModel.findOne({ name: name });
            if (rolCommunity) {
                return rolCommunity;
            } else {
                return rolCommunity;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async getRolCommunityByID(id: string) {
        try {
            let rolCommunity = await RolCommunitiesModel.findOne({ _id: id });
            if (rolCommunity) {
                return rolCommunity;
            } else {
                return rolCommunity;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async createRolCommunity(obj: any) {
        try {
            let createRol;
            const getRolCommunity = await this.getRolCommunityByName(obj.name);
            const saveRolCommunity = new RolCommunitiesModel(obj);

            if (!getRolCommunity) {
                createRol = saveRolCommunity.save();
            } else {
                createRol = ConstantsRS.THE_RECORD_ALREDY_EXISTS;
            }
            return createRol;
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteRolCommunityByName(name: string) {
        try {
            let deleteResponse;
            let getRolCommunity = await this.getRolCommunityByName(name);
            if (getRolCommunity) {
                deleteResponse = await RolCommunitiesModel.deleteOne({ name: name });
                return deleteResponse;
            } else {
                return deleteResponse;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async updateRolCommunity(obj: any) {
        try {
            let updateResponse;
            let getRolCommunity = await this.getRolCommunityByID(obj.id);
            if (getRolCommunity) {
                updateResponse = await RolCommunitiesModel.updateOne({ _id: obj.id }, obj, { new: true });
                return updateResponse;
            } else {
                return updateResponse;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async validateCommunityRoleChange(score: Number) {
        let response;
        try {
            const roleScore = await RolCommunitiesModel.findOne({ requiredScore: score });
            if (roleScore) {
                response = roleScore;
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async assignRolToUser(userId: string, rolId: string, communityId: string) {

        const userToupdate = await userRequestCommunityService.getRequestOnCommunityByUserId(userId, communityId); //get instance of requestCommunity

        const dataToUpdate = {
            rolInCommunity: rolId
        }

        return await userRequestCommunityService.updateRequest(userToupdate._id, dataToUpdate); //update request with rolId
    }
}

export const rolCommunitiesServices = new RolCommunitiesServices();