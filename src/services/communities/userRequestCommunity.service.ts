import { ConstantsRS } from '../../utils/constants';
import { communitiesServices } from './community.services';
import { communityManagerService } from './communityManager.service';
import { notificationsServices } from '../notifications/notifications.services';

const userRequestCommunityModel = require('../../models/communities/userRequestToCommunity.model');
const CommunityManagerModel = require('../../models/communities/CommunityManagers.model');

class UserRequestCommunityService {

    public async createRequest(userId: string, communityId: string) {

        const exist = await userRequestCommunityModel.findOne({ userId, communityId });
        if (exist) {
            if (exist.isBlocked == true) {
                return ConstantsRS.YOUR_ARE_BLOCKED_FROM_THIS_COMMUNITY
            } else {
                await userRequestCommunityModel.updateOne({ userId, communityId }, { isDeclined: false, isPending: true, isAccepted: false, isBlocked: false });
                const requestToupdate = await userRequestCommunityModel.findOne({ userId, communityId });
                if (requestToupdate) {
                    await notificationsServices.sendNotificationRequestCommunities(exist, false)
                }
                return requestToupdate
            }
        }
        //if not exist
        const requestTosave = new userRequestCommunityModel({ userId, communityId });
        const requestTosaved = await requestTosave.save();
        if (requestTosaved) {
            await notificationsServices.sendNotificationRequestCommunities(requestTosaved, false)
        }
        return requestTosaved
    }

    public async acceptRequest(requestId: string) {

        const requestToAccept = await userRequestCommunityModel.findOne({ _id: requestId });

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await userRequestCommunityModel.updateOne({ _id: requestId }, {
            isPending: false,
            isAccepted: true,
            isDeclined: false,
            isBlocked: false
        });

        return await userRequestCommunityModel.findOne({ _id: requestId });
    }

    public async deleteRequest(requestId: string) {
        return await userRequestCommunityModel.deleteOne({ _id: requestId });
    }

    public async deleteUserRequest(userId: string, communityId: string) {
        const documentDelete = await userRequestCommunityModel.findOne({ userId, communityId });
        return await userRequestCommunityModel.deleteOne({ _id: documentDelete.id });
    }

    public async refuseRequest(requestId: string) {

        const request = await userRequestCommunityModel.findOne({ _id: requestId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await userRequestCommunityModel.updateOne({ _id: requestId }, { isDeclined: true, isPending: false, isAccepted: false, isBlocked: false });
    }

    public async blockedRequest(requestId: string) {

        const request = await userRequestCommunityModel.findOne({ _id: requestId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await userRequestCommunityModel.updateOne({ _id: requestId }, { isDeclined: false, isPending: false, isAccepted: false, isBlocked: true });
    }

    public async blockedUserRequest(userId: string, communityId: string) {

        const request = await userRequestCommunityModel.findOne({ userId, communityId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await userRequestCommunityModel.updateOne({ userId, communityId }, { isDeclined: false, isPending: false, isAccepted: false, isBlocked: true });
    }

    public async getRequestById(requestId: string) {
        return await userRequestCommunityModel.findOne({ _id: requestId });
    }

    public async getAllrefuseRequest() {
        return await userRequestCommunityModel.find({ isDeclined: true });
    }

    public async getAllPendingRequest() {
        return await userRequestCommunityModel.find({ isPending: true });
    }

    public async getAllAcceptedRequest() {
        return await userRequestCommunityModel.find({ isAccepted: true });
    }

    public async updateRequest(requestId: string, body: any) {

        const requestToAccept = await userRequestCommunityModel.findOne({ _id: requestId });

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await userRequestCommunityModel.updateOne({ _id: requestId }, body);

        return await userRequestCommunityModel.findOne({ _id: requestId });
    }

    // communities
    public async getAllrefuseRequestByCommunity(communityId: string) {
        return await userRequestCommunityModel.find({ isDeclined: true, communityId })
            .populate([
                {
                    path: 'userId',
                    model: 'Users',
                    select: 'name birthday email profilePicture roleInTheCommunityID alias rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
    }

    public async getAllPendingRequestByCommunity(communityId: string) {
        return await userRequestCommunityModel.find({ isPending: true, communityId })
            .populate([
                {
                    path: 'userId',
                    model: 'Users',
                    select: 'name birthday email profilePicture roleInTheCommunityID alias rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
    }

    public async getAllAcceptedRequestByCommunity(communityId: string) {
        return await userRequestCommunityModel.find({ isAccepted: true, communityId })
            .populate([
                {
                    path: 'userId',
                    model: 'Users',
                    select: 'name birthday email profilePicture roleInTheCommunityID alias rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
    }

    public async getAllBlockedRequestByCommunity(communityId: string) {
        return await userRequestCommunityModel.find({ isBlocked: true, communityId })
            .populate([
                {
                    path: 'userId',
                    model: 'Users',
                    select: 'name birthday email profilePicture roleInTheCommunityID alias rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])
    }

    public async getAllUsersAcceptedRequestByCommunity(communityId: string) {
        const users = await userRequestCommunityModel.find({ isAccepted: true, communityId }, { isPending: 0, isDeclined: 0, __v: 0 })
            .populate([
                {
                    path: 'userId',
                    model: 'Users',
                    select: 'name birthday email profilePicture roleInTheCommunityID alias rankID',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                }
            ])

        const foundator = await communitiesServices.getfoundatorCommunity(communityId);
        users.push(foundator);
        return users;
    }

    public async communitiesIBelong(userId: string) {
        return await userRequestCommunityModel.find({ isAccepted: true, userId }, { isAccepted: 1, _id: 0 })
            .populate([{
                path: 'communityId',
                model: 'Communities',
                select: 'name description CategoriesOfCommunitiesIDS profilePicture',
                populate: [{
                    path: 'CategoriesOfCommunitiesIDS',
                    model: 'CategoriesOfCommunities',
                    select: 'name description'
                }]
            }
            ])
    }

    public async communitiesIAmBlocked(userId: string) {
        return await userRequestCommunityModel.find({ isBlocked: true, userId })
            .populate([{
                path: 'communityId',
                model: 'Communities',
                select: 'name description CategoriesOfCommunitiesIDS',
                populate: [{
                    path: 'CategoriesOfCommunitiesIDS',
                    model: 'CategoriesOfCommunities',
                    select: 'name description'
                }]
            }
            ])
    }

    public async getRequestOnCommunityByUserId(userId: string, communityId: string) {
        let infoUser = await userRequestCommunityModel.find({ userId, communityId }, { __v: 0 });
        return infoUser;
    }

    public async getInfoUserOnCommunityByUserId(userId: string, communityId: string) {

        /* let infoUser = await userRequestCommunityModel.find({ userId, communityId }, { __v: 0 })
            .populate('userId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, alias: 1
            }); */

        const infoManager = await communityManagerService.getManagerByUserId(userId);

        let members: any = [], getUsers: any = []
        infoManager ? members.push(infoManager) : members
        getUsers = await userRequestCommunityService.getAllUsersAcceptedIDS(communityId);

        if (getUsers.length > 0) {
            for await (let member of getUsers) {
                const memberComplete = await CommunityManagerModel.findOne({
                    $and: [{ communityId: member.communityId }, { assignedUserId: member.userId }]
                })
                    .populate('assignedUserId', { birthday: 1, email: 1, profilePicture: 1, name: 1, _id: 1, score: 1, gender: 1, phone: 1, alias: 1, relationshipStatus: 1 })
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
        let response = null;

        response = members;
        if (members.length == 0 && !infoManager) response = 'User Not in community';

        return response;
    }

    public async acceptRequestOther(body: any) {

        const requestToAccept = await userRequestCommunityModel.findOne({ _id: body.requestId }).populate('communityId');

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await notificationsServices.sendNotificationRequestCommunities(requestToAccept, true)

        await userRequestCommunityModel.updateOne({ _id: body.requestId }, {
            isPending: false,
            isAccepted: true,
            isDeclined: false,
            isBlocked: false
        });
        let bodyUserRole = {
            assignedUserId: requestToAccept.userId,
            allocatorUserId: requestToAccept.communityId.userID,
            communityId: requestToAccept.communityId.id,
            isNormalUser: true
        }
        await communityManagerService.acceptRequestUser(bodyUserRole)
        return await userRequestCommunityModel.findOne({ _id: body.requestId });
    }

    public async getAllUsersAcceptedIDS(communityId: string) {
        const users = await userRequestCommunityModel.find({ isAccepted: true, communityId }, { isPending: 0, isDeclined: 0, __v: 0 });
        return users;
    }

    public async getByUserIdAndCommunityIdAccepted(body: any) {
        const users = await userRequestCommunityModel.findOne({
            $and: [{ isAccepted: true }, { communityId: body.communityId }, { userId: body.userId }] }, { isPending: 0, isDeclined: 0, __v: 0 });
        return users;
    }

    public async getByUserIdAndCommunityId(body: any) {
        const users = await userRequestCommunityModel.findOne({
            $and: [{ communityId: body.communityId }, { userId: body.userId }] }, { __v: 0 });
        return users;
    }

    public async toUnlockUserRequest(userId: string, communityId: string) {

        const request = await userRequestCommunityModel.findOne({ userId, communityId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await userRequestCommunityModel.updateOne({ userId, communityId }, { isDeclined: false, isPending: false, isAccepted: true, isBlocked: false });
    }
}

export const userRequestCommunityService = new UserRequestCommunityService();