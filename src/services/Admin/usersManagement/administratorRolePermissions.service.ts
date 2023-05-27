import { administratorRolesServices } from './administratorRoles.service';
import { ConstantsRS } from '../../../utils/constants';
const administratorRolePermissionsModel =  require('../../../models/admin/usersManagement/AdministratorPermission.model')

class AdministratorRolePermissionsServices{
    public async createPermission(body:any) {
        try {
            let adminPermissionSaved
            const getAdminPermission = await this.getPermissionByName(body.name)
            if (!getAdminPermission) {
                const adminPermissionToSaved = new administratorRolePermissionsModel(body);
                adminPermissionSaved = await adminPermissionToSaved.save();
            }
            return adminPermissionSaved
        } catch (error) {
            console.log(error);            
        }
    }

    public async getPermissionByName(name:String) {
        try {
            const getAdminPermission = await administratorRolePermissionsModel.findOne({name:name});
            return getAdminPermission
        } catch (error) {
            console.log(error);            
        }
    }

    public async getPermissionById(permissionId:String) {
        try {
            const getAdminPermission = await administratorRolePermissionsModel.findOne({_id:permissionId});
            return getAdminPermission
        } catch (error) {
            console.log(error);            
        }
    }

    public async getAllPermission() {
        try {
            const getAdminPermission = await administratorRolePermissionsModel.find({});
            return getAdminPermission
        } catch (error) {
            console.log(error);            
        }
    }

    public async searchPermission(body:any) {
        try {
            const getAdminPermission = await administratorRolePermissionsModel.find({
                name: { $regex: body.search, $options: "i" } 
            });
            return getAdminPermission
        } catch (error) {
            console.log(error);            
        }
    }

    public async updatePermission(body:any) {
        try {
            let adminPermissionUpdate
            const getAdminPermission = await this.getPermissionByName(body.name)
            if (!getAdminPermission || getAdminPermission.id == body.permissionId) {
                adminPermissionUpdate = await administratorRolePermissionsModel.findOneAndUpdate({_id:body.permissionId},body,{new:true});
            }
            return adminPermissionUpdate
        } catch (error) {
            console.log(error);            
        }
    }
    
    public async deletePermission(body:any) {
        try {
            let adminPermissionDelete
            const usePermisionAdmind = await administratorRolesServices.getAdminRoleByPermsion({roleId:body.permissionId})
            if (!usePermisionAdmind) {
                adminPermissionDelete = await administratorRolePermissionsModel.findOneAndDelete({_id:body.permissionId});
            } else {
                adminPermissionDelete = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return adminPermissionDelete
        } catch (error) {
            console.log(error);            
        }
    }

}

export const administratorRolePermissionsServices = new AdministratorRolePermissionsServices()