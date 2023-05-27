import { permissionForProfessionalCommunityRolesService } from './permissionsforprofessionalcommunityroles.service';
import { professionalCommunityUsersService } from './professionalcommunityusers.service';
import { ConstantsRS } from '../../utils/constants';

const UserRolesInTheCommunityModel = require('../../models/communitiesprofessionales/UserRolesInTheCommunity.model');

class UserRolesInTheCommunityService {

    public async createRole(body: { name: string, description: string, permissions: [string] }) {
        const nameTosave = new UserRolesInTheCommunityModel(body);
        const saveCom =  await nameTosave.save();
        if (saveCom) {
            return await UserRolesInTheCommunityModel.findOne({ _id: saveCom.id }).populate({
                path: "permissions",
                model: 'PermissionForProfessionalCommunityRoles',
                match: { isEnabled: true },
                select: 'name description'
            });
        }
        return saveCom
    }

    public async createAdminRole() {

        let permissions = await permissionForProfessionalCommunityRolesService.getAllIdActivePermission(); //get all permissions on collection

        const body = {
            code: 0,
            name: 'Administrador',
            description: "admin to manage community",
            permissions
        }
        const nameTosave = new UserRolesInTheCommunityModel(body);
        return await nameTosave.save();
    }

    public async editRole(id: string, body: any) {

        await UserRolesInTheCommunityModel.updateOne({ _id: id }, body);

        return await UserRolesInTheCommunityModel.findOne({ _id: id }).populate({
            path: "permissions",
            model: 'PermissionForProfessionalCommunityRoles',
            match: { isEnabled: true },
            select: 'name description'
        });
    }

    public async deleteRole(id: string) {
        let rta
        const useRole = await professionalCommunityUsersService.getProfessionalCommunityUserByRole(id)
        if (!useRole) {
           rta = await UserRolesInTheCommunityModel.findOneAndDelete({ _id: id });
        } else {
           rta = ConstantsRS.THE_REGISTRY_IS_IN_USE 
        }
        return rta
    }

    public async getRoleById(id: string) {
        return await UserRolesInTheCommunityModel.findOne({ _id: id, isEnabled: true })
            .populate({
                path: "permissions",
                model: 'PermissionForProfessionalCommunityRoles',
                match: { isEnabled: true },
                select: 'name description'
            })
    }

    public async getAllRoles() {
        return await UserRolesInTheCommunityModel.find({ isEnabled: true })
            .populate('permissions', { name: 1, description: 1 });
    }

    public async getAllInactiveRoles() {
        return await UserRolesInTheCommunityModel.find({ isEnabled: false })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getRoleByName(name: string) {
        return await UserRolesInTheCommunityModel.findOne({ isEnabled: true, name })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getRoleByCode(code: Number) {
        return await UserRolesInTheCommunityModel.findOne({ isEnabled: true, code })
            .populate('permissions', { name: 1, description: 1 });

    }

    public async getRoleByPermission(id: string) {
        try {
            const getRol = await UserRolesInTheCommunityModel.find({
                $and:[{permissions: { $in: [id] }},{isEnabled: true}]
            })   
            return getRol
        } catch (error) {
            console.log(error);            
        }
    }

}

export const userRolesInTheCommunityService = new UserRolesInTheCommunityService();