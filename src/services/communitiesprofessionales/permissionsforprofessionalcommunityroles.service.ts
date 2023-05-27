import { userRolesInTheCommunityService } from './userrolesinthecommunity.service';
import { ConstantsRS } from '../../utils/constants';
const PermissionForProfessionalCommunityRolesModel = require('../../models/communitiesprofessionales/PermissionForProfessionalCommunityRoles.model');

class PermissionForProfessionalCommunityRolesService {

    public async createPermission(body: { name: string, description: string }) {
        const permissionTosave = new PermissionForProfessionalCommunityRolesModel(body);
        return await permissionTosave.save();
    }

    public async updatePermission(id: string, body: any) {
        await PermissionForProfessionalCommunityRolesModel.updateOne({ _id: id }, body);
        return await PermissionForProfessionalCommunityRolesModel.findOne({ _id: id });
    }

    public async deletePermission(id: string) {
        let rta, rtaError
        const usePermission = await userRolesInTheCommunityService.getRoleByPermission(id)
        if (!usePermission) {
            rta =  await PermissionForProfessionalCommunityRolesModel.deleteOne({ _id: id });
        } else {
            rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
        }
        return rta ? rta : rtaError
    }

    public async getPermissionById(id: string) {
        return await PermissionForProfessionalCommunityRolesModel.findOne({ _id: id });
    }

    public async getAllActivePermission() {
        return await PermissionForProfessionalCommunityRolesModel.find({ isEnabled: true });
    }

    public async getAllInActivePermission() {
        return await PermissionForProfessionalCommunityRolesModel.find({ isEnabled: false });
    }

    public async getAllIdActivePermission() {

        let permiss = await PermissionForProfessionalCommunityRolesModel.find({ isEnabled: true });
        permiss = permiss.map((permissObject: any) => permissObject._id);
        return permiss;
    }
}

export const permissionForProfessionalCommunityRolesService = new PermissionForProfessionalCommunityRolesService();