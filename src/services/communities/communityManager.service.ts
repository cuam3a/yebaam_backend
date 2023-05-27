import { communityTypeManagerService } from "./communityTypeManager.service";
import { userRequestCommunityService } from './userRequestCommunity.service';
import { notificationsServices } from '../notifications/notifications.services';

const CommunityManagerModel = require('../../models/communities/CommunityManagers.model');

class CommunityManagerService {

    public async createManager(body: { typeId: string, assignedUserId: string, allocatorUserId: string, communityId: string }) {
        const nameTosave = new CommunityManagerModel(body);

        return await nameTosave.save();
    }

    public async createAdminManager(body: { allocatorUserId: string, assignedUserId: string, communityId: string }) {

        let typeId = await communityTypeManagerService.getManagerNameByCode(0); //get object admin name

        if (!typeId) {
            typeId = await communityTypeManagerService.createAdminManagerName(); //if nos exist then create and return the object admin name
        }

        const adminManager = new CommunityManagerModel({ ...body, typeId: typeId._id }); //nameId is field to save the id on name admin
        return await adminManager.save();
    }

    public async updateManager(id: string, body: any) {

        await CommunityManagerModel.updateOne({ _id: id }, body);

        return await CommunityManagerModel.findOne({ _id: id });
    }

    public async deleteManager(id: string) {
        return await CommunityManagerModel.deleteOne({ _id: id });
    }

    public async getManagerById(id: string) {
        return await CommunityManagerModel.findOne({ _id: id, isEnabled: true })
            .populate([
                {
                    path: 'assignedUserId',
                    model: 'Users',
                    select: 'name score alias  rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
            .populate([
                {
                    path: 'allocatorUserId',
                    model: 'Users',
                    select: 'name score alia rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
            .populate('communityId', { name: 1, description: 1 })
            .populate('typeId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'typeId',
                    model: 'CommunityTypeManager',
                    select: 'code permissions name description',
                    populate: [
                        {
                            path: 'permissions',
                            model: 'CommunitymanagerPermissions',
                            select: 'name description'
                        }]
                }
            ])
    }
    public async getManagerByUserId(id: string) {
        return await CommunityManagerModel.findOne({ assignedUserId: id, isEnabled: true })
            // .populate('assignedUserId', { name: 1, score: 1, alias: 1 })
            .populate([
                {
                    path: 'assignedUserId',
                    model: 'Users',
                    select: 'birthday email profilePicture name id score gender phone alias relationshipStatus rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
            // .populate('communityId', { name: 1, description: 1 })
            .populate('typeId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'typeId',
                    model: 'CommunityTypeManager',
                    select: 'code permissions name description',
                    // populate: [
                    //     {
                    //         path: 'permissions',
                    //         model: 'CommunitymanagerPermissions',
                    //         select: 'name description'
                    //     }]
                }
            ])
    }

    public async getAllManagers() {
        return await CommunityManagerModel.find({ isEnabled: true });
    }

    public async getAllManagersOnCommunity(communityId: string) {
        return await CommunityManagerModel.find({ communityId })
            .populate([
                {
                    path: 'assignedUserId',
                    model: 'Users',
                    select: 'name score alias  rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
            .populate([
                {
                    path: 'allocatorUserId',
                    model: 'Users',
                    select: 'name score alia rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
            .populate('communityId', { name: 1, description: 1 })
            .populate('typeId', { permissions: 1, name: 1, description: 1 })
            .populate([
                {
                    path: 'typeId',
                    model: 'CommunityTypeManager',
                    select: 'code permissions name description',
                    populate: [
                        {
                            path: 'permissions',
                            model: 'CommunitymanagerPermissions',
                            select: 'name description'
                        }]
                }
            ])
    }

    public async getAllInactiveManager() {
        return await CommunityManagerModel.find({ isEnabled: false });
    }

    public async acceptRequestUser(body: any) {
        const newRegister = new CommunityManagerModel(body)
        const saveMember = newRegister.save()
        return saveMember
    }

    public async asignTypeToUser(body: any) {
        try {
            let asignRole
            const validateExist = await CommunityManagerModel.findOne({
                $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
            })
            if (validateExist) {
                if (body.isNormalUser != undefined && body.isNormalUser != false) {
                    asignRole = await CommunityManagerModel.findOneAndUpdate({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
                    }, { isNormalUser: true, typeId: null }, { new: true })
                } else {
                    asignRole = await CommunityManagerModel.findOneAndUpdate({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.assignedUserId }]
                    }, { isNormalUser: false, typeId: body.typeId }, { new: true })
                }
            }
            if (asignRole) {
                await notificationsServices.sendNotificationAssignRoleAnyCommunities(body, true)
            }
            return asignRole
        } catch (error) {
            console.log(error);
        }
    }

    public async getMembersCommunity(body: any) {
        try {
            let members: any = [], getUsers: any = []
            getUsers = await userRequestCommunityService.getAllUsersAcceptedIDS(body.communityId);

            if (getUsers.length > 0) {
                for await (let member of getUsers) {
                    const memberComplete = await CommunityManagerModel.findOne({
                        $and: [{ communityId: member.communityId }, { assignedUserId: member.userId }]
                    })
                        .populate([
                            {
                                path: 'assignedUserId',
                                model: 'Users',
                                select: 'birthday email profilePicture name id score gender phone alias relationshipStatus rankID',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks',
                                }
                            }
                        ])
                        .populate([
                            {
                                path: 'allocatorUserId',
                                model: 'Users',
                                select: 'birthday email profilePicture name id score gender phone alias relationshipStatus rankID',
                                populate: {
                                    path: 'rankID',
                                    model: 'Ranks',
                                }
                            }
                        ])
                        .populate([
                            {
                                path: 'typeId',
                                model: 'CommunityTypeManager',
                                select: 'code permissions name description',
                            }
                        ])

                    if (!memberComplete) members.push(member)
                    else members.push(memberComplete)
                }
            }
            return members
        } catch (error) {
            console.log(error);
        }
    }

    public async getCommunityManagerByType(id: string) {
        try {
            const getuser = await CommunityManagerModel.find({
                $and: [{ typeId: id }, { isEnabled: true }]
            })
            return getuser
        } catch (error) {
            console.log(error);
        }
    }

}

export const communityManagerService = new CommunityManagerService();