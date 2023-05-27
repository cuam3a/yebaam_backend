import { userRolesInTheCommunityService } from './userrolesinthecommunity.service';
import { requestToTheCommunityService } from './requeststothecommunity.service';
import { notificationsServices } from '../notifications/notifications.services';

const ProfessionalCommunityUsersModel = require('../../models/communitiesprofessionales/ProfessionalCommunityUsers.model');

class ProfessionalCommunityUsersService {

    public async createProfessionalCommunityUser(body: { roleCommunityId: string, assignedUserId: string, allocatorUserId: string, communityId: string }) {
        const nameTosave = new ProfessionalCommunityUsersModel(body);

        return await nameTosave.save();
    }

    public async createAdminProfessionalCommunityUser(body: { allocatorUserId: string, assignedUserId: string, communityId: string }) {

        let roleCommunityId = await userRolesInTheCommunityService.getRoleByCode(0); //get object admin name

        if (!roleCommunityId) {
            roleCommunityId = await userRolesInTheCommunityService.createAdminRole(); //if nos exist then create and return the object admin name
        }

        const adminManager = new ProfessionalCommunityUsersModel({ ...body, roleCommunityId: roleCommunityId._id }); //nameId is field to save the id on name admin
        return await adminManager.save();
    }

    public async updateProfessionalCommunityUser(id: string, body: any) {

        await ProfessionalCommunityUsersModel.updateOne({ _id: id }, body);

        return await ProfessionalCommunityUsersModel.findOne({ _id: id });
    }

    public async deleteProfessionalCommunityUser(id: string) {
        return await ProfessionalCommunityUsersModel.deleteOne({ _id: id });
    }

    public async getProfessionalCommunityUserById(id: string) {
        return await ProfessionalCommunityUsersModel.findOne({ _id: id, isEnabled: true })
            .populate('assignedUserId', { name: 1, score: 1, alias: 1 })
            .populate('allocatorUserId', { name: 1, score: 1, alias: 1 })
            .populate('communityId', { name: 1, description: 1 })
            .populate('roleCommunityId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'roleCommunityId',
                    model: 'UserRolesInTheCommunity',
                    select: 'code permissions name description',
                    populate: [
                        {
                            path: 'permissions',
                            model: 'PermissionForProfessionalCommunityRoles',
                            select: 'name description'
                        }]
                }
            ])
    }
    public async getProfessionalCommunityUserId(id: string) {
        return await ProfessionalCommunityUsersModel.findOne({ assignedUserId: id, isEnabled: true })
            // .populate('assignedUserId', { name: 1, score: 1, alias: 1 })
            .populate('allocatorUserId', {birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
            // .populate('communityId', { name: 1, description: 1 })
            .populate('roleCommunityId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'roleCommunityId',
                    model: 'UserRolesInTheCommunity',
                    select: 'code permissions name description',
                    // populate: [
                    //     {
                    //         path: 'permissions',
                    //         model: 'PermissionForProfessionalCommunityRoles',
                    //         select: 'name description'
                    //     }]
                }
            ])
    }

    public async getAllProfessionalCommunityUsers() {
        return await ProfessionalCommunityUsersModel.find({ isEnabled: true });
    }

    public async getAllProfessionalCommunityUserOnCommunity(communityId: string) {
        return await ProfessionalCommunityUsersModel.find({ communityId })
            .populate('assignedUserId', { name: 1, score: 1, alias: 1 })
            .populate('allocatorUserId', { name: 1, score: 1, alias: 1 })
            .populate('communityId', { name: 1, description: 1 })
            .populate('roleCommunityId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'roleCommunityId',
                    model: 'UserRolesInTheCommunity',
                    select: 'code permissions name description',
                    populate: [
                        {
                            path: 'permissions',
                            model: 'PermissionForProfessionalCommunityRoles',
                            select: 'name description'
                        }]
                }
            ])
    }

    public async getAllInactiveProfessionalCommunityUser() {
        return await ProfessionalCommunityUsersModel.find({ isEnabled: false });
    }

    public async acceptRequestProfessional(body: any) {
        const newRegister = new ProfessionalCommunityUsersModel(body)
        const saveMember = newRegister.save()
        return saveMember
    }

    public async asignRoleToProfessional(body: any) {
        try {
            let asignRole
            const validateExist = await ProfessionalCommunityUsersModel.findOne({
                $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
            })
            if (validateExist) {
                if (body.isNormalUser != undefined && body.isNormalUser != false) {
                    asignRole = await ProfessionalCommunityUsersModel.findOneAndUpdate({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
                    }, { isNormalUser: true, roleCommunityId: null }, { new: true })
                } else {
                    asignRole = await ProfessionalCommunityUsersModel.findOneAndUpdate({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
                    }, { isNormalUser: false, roleCommunityId: body.roleCommunityId }, { new: true })
                }
            }
            if (asignRole) {
                await notificationsServices.sendNotificationAssignRoleAnyCommunities(body,false)
            }
            return asignRole
        } catch (error) {
            console.log(error);
        }
    }

    public async getMembersCommunity(body: any) {
        try {
            let members: any = [], getUsers: any = []
            getUsers = await requestToTheCommunityService.getAllProfessionalsAcceptedIDS(body.communityId);
            if (getUsers.length > 0) {
                for await (let member of getUsers) {
                    const memberComplete = await ProfessionalCommunityUsersModel.findOne({
                        $and: [{ communityId: member.communityId }, { assignedUserId: member.professionalId }]
                    })
                        .populate('assignedUserId',{birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
                        .populate('allocatorUserId',{birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
                        .populate([
                            {
                                path: 'roleCommunityId',
                                model: 'UserRolesInTheCommunity',
                                select: 'code permissions name description',
                            }
                        ])
                    if (memberComplete) members.push(memberComplete)
                }
            }
            return members
        } catch (error) {
            console.log(error);
        }
    }

    public async getProfessionalCommunityUserByRole(id: string) {
        try {
            const getuser = await ProfessionalCommunityUsersModel.find({ 
                $and:[{roleCommunityId:id},{isEnabled:true}]
            })
            return getuser
        } catch (error) {
           console.log(error);            
        }
    }

}

export const professionalCommunityUsersService = new ProfessionalCommunityUsersService();