import { communityManagerPermissionsService } from "./communityManagerPermissions.service";
import { communityManagerService } from './communityManager.service';
import { ConstantsRS } from '../../utils/constants';

const CommunityTypeManagerModel = require('../../models/communities/CommunityTypeManagers.model');

class CommunityTypeManagerService {

    public async createManagerName(body: { name: string, description: string, permissions: [string] }) {
        const nameTosave = new CommunityTypeManagerModel(body);
        const saveCom =  await nameTosave.save();
        if (saveCom) {
            return await CommunityTypeManagerModel.findOne({ _id: saveCom.id }).populate({
                path: "permissions",
                model: 'CommunitymanagerPermissions',
                match: { isEnabled: true },
                select: 'name description'
            });
        }
        return saveCom
    }

    public async createAdminManagerName() {

        let permissions = await communityManagerPermissionsService.getAllIdActivePermission(); //get all permissions on collection

        const body = {
            code: 0,
            name: 'Administrador',
            description: "admin to manage community",
            permissions
        }
        const nameTosave = new CommunityTypeManagerModel(body);
        return await nameTosave.save();
    }

    public async editManagerName(id: string, body: any) {

        await CommunityTypeManagerModel.updateOne({ _id: id }, body);

        return await CommunityTypeManagerModel.findOne({ _id: id }).populate({
            path: "permissions",
            model: 'CommunitymanagerPermissions',
            match: { isEnabled: true },
            select: 'name description'
        });
    }

    public async deleteManagerName(id: string) {
        let rta
        const useRole = await communityManagerService.getCommunityManagerByType(id)
        if (!useRole) {
           rta = await CommunityTypeManagerModel.findOneAndDelete({ _id: id });
        } else {
           rta = ConstantsRS.THE_REGISTRY_IS_IN_USE 
        }
        return rta
    }

    public async getManagerNameById(id: string) {
        return await CommunityTypeManagerModel.findOne({ _id: id, isEnabled: true })
            .populate({
                path: "permissions",
                model: 'CommunitymanagerPermissions',
                match: { isEnabled: true },
                select: 'name description'
            })
    }

    public async getAllManagerName() {
        return await CommunityTypeManagerModel.find({ isEnabled: true })
            .populate('permissions', { name: 1, description: 1 });
    }

    public async getAllInactiveManagerName() {
        return await CommunityTypeManagerModel.find({ isEnabled: false })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getManagerNameByName(name: string) {
        return await CommunityTypeManagerModel.findOne({ isEnabled: true, name })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getManagerNameByCode(code: Number) {
        return await CommunityTypeManagerModel.findOne({ isEnabled: true, code })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getTypeManagerByPermission(id: string) {
        try {
            const getRol = await CommunityTypeManagerModel.find({
                $and:[{permissions: { $in: [id] }},{isEnabled: true}]
            })   
            return getRol
        } catch (error) {
            console.log(error);            
        }
    }

}

export const communityTypeManagerService = new CommunityTypeManagerService();