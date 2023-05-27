import { communityTypeManagerService } from './communityTypeManager.service';
import { ConstantsRS } from '../../utils/constants';
const CommunitymanagerPermissionsModel = require('../../models/communities/CommunityManagerPermissions.model');

class CommunityManagerPermissionsService {

    public async createPermission(body: { name: string, description: string }) {
        const permissionTosave = new CommunitymanagerPermissionsModel(body);
        return await permissionTosave.save();
    }

    public async updatePermission(id: string, body: any) {
        await CommunitymanagerPermissionsModel.updateOne({ _id: id }, body);
        return await CommunitymanagerPermissionsModel.findOne({ _id: id });
    }

    public async deletePermission(id: string) {
        let rta, rtaError
        const usePermission = await communityTypeManagerService.getTypeManagerByPermission(id)
        if (!usePermission) {
            rta =  await CommunitymanagerPermissionsModel.deleteOne({ _id: id });
        } else {
            rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
        }
        return rta ? rta : rtaError
    }

    public async getPermissionById(id: string) {
        return await CommunitymanagerPermissionsModel.findOne({ _id: id });
    }

    public async getAllActivePermission() {
        return await CommunitymanagerPermissionsModel.find({ isEnabled: true });
    }

    public async getAllInActivePermission() {
        return await CommunitymanagerPermissionsModel.find({ isEnabled: false });
    }

    public async getAllIdActivePermission() {

        let permiss = await CommunitymanagerPermissionsModel.find({ isEnabled: true });
        permiss = permiss.map((permissObject: any) => permissObject._id);
        return permiss;
    }
}

export const communityManagerPermissionsService = new CommunityManagerPermissionsService();