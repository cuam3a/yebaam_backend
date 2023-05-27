import { adminUsersServices } from './adminUsers.service';
import { ConstantsRS } from '../../../utils/constants';
const administratorRolesModel =  require('../../../models/admin/usersManagement/AdministratorRoles.model')

class AdministratorRolesServices{
    public async createRole(body:any) {
        try {
            let adminRoleSaved
            const getAdminRole = await this.geRoleByName(body.name)
            if (!getAdminRole) {
                const adminRoleToSaved = new administratorRolesModel(body);
                adminRoleSaved = await adminRoleToSaved.save();
            }
            return adminRoleSaved
        } catch (error) {
            console.log(error);            
        }
    }

    public async geRoleByName(name:String) {
        try {
            const getAdminRole = await administratorRolesModel.findOne({name:name}).populate('permitsID')
            return getAdminRole
        } catch (error) {
            console.log(error);            
        }
    }

    public async getRoleById(roleId:String) {
        try {
            const getAdminRole = await administratorRolesModel.findOne({_id:roleId}).populate('permitsID')
            return getAdminRole
        } catch (error) {
            console.log(error);            
        }
    }

    public async getAllRoles() {
        try {
            const getAdminRole = await administratorRolesModel.find({}).populate('permitsID')
            return getAdminRole
        } catch (error) {
            console.log(error);            
        }
    }

    public async searchRoles(body:any) {
        try {
            const getAdminPermission = await administratorRolesModel.find({
                name: { $regex: body.search, $options: "i" } 
            }).populate('permitsID')
            return getAdminPermission
        } catch (error) {
            console.log(error);            
        }
    }

    public async updateRole(body:any) {
        try {
            let adminRoleUpdate
            const getAdminRole = await this.geRoleByName(body.name)
            if (!getAdminRole || getAdminRole.id == body.roleId) {
                adminRoleUpdate = await administratorRolesModel.findOneAndUpdate({_id:body.roleId},body,{new:true}).populate('permitsID')
            }
            return adminRoleUpdate
        } catch (error) {
            console.log(error);            
        }
    }
    
    public async deleteRole(body:any) {
        try {
            let adminRoleDelete
            const useRolAdmind = await adminUsersServices.getAdminUsersByRole({roleId:body.roleId})
            if (!useRolAdmind) {
                adminRoleDelete = await administratorRolesModel.findOneAndDelete({_id:body.roleId}).populate('permitsID')
            } else {
                adminRoleDelete = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return adminRoleDelete
        } catch (error) {
            console.log(error);            
        }
    }

    public async getAdminRoleByPermsion(body: any) {
        try {
          const getAdminRole = await administratorRolesModel
            .find({
              $and: [{ permitsID: { $in: [body.permissionId] } }, { isEnabled: true }],
            })
            .populate("permitsID");
          return getAdminRole;
        } catch (error) {
          console.log(error);
        }
      }

}

export const administratorRolesServices = new AdministratorRolesServices()