import { ConstantsRS } from "../../utils/constants";
import { professionalCommunitiesServices } from './professionalcommunities.service';
import { professionalCommunityUsersService } from './professionalcommunityusers.service';
import { notificationsServices } from '../notifications/notifications.services';
const RequestToTheCommunityModel = require('../../models/communitiesprofessionales/RequestToTheCommunity.model');
const ProfessionalCommunitiesModel = require('../../models/communitiesprofessionales/ProfessionalCommunities.model');

class RequestToTheCommunityService {

    public async createRequest(professionalId: string, communityId: string) {

        const exist = await RequestToTheCommunityModel.findOne({ professionalId, communityId });

        if (exist) {
            if (exist.isBlocked == true) {
                return ConstantsRS.YOUR_ARE_BLOCKED_FROM_THIS_COMMUNITY
            } else {
                await RequestToTheCommunityModel.updateOne({ professionalId, communityId }, { isDeclined: false, isPending: true, isAccepted: false, isBlocked: false });
                const requestToupdate = await RequestToTheCommunityModel.findOne({ professionalId, communityId });
                if (requestToupdate) {
                    await notificationsServices.sendNotificationRequestProfessionalCommunities(exist,false)
                }
                return requestToupdate
            }
        }

        //if not exist
        const requestTosave = new RequestToTheCommunityModel({ professionalId, communityId });
        const requestTosaved = await requestTosave.save();
        if (requestTosaved) {
            await notificationsServices.sendNotificationRequestProfessionalCommunities(requestTosaved,false)
        }
        return requestTosaved
    }

    public async acceptRequest(requestId: string) {

        const requestToAccept = await RequestToTheCommunityModel.findOne({ _id: requestId });

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await RequestToTheCommunityModel.updateOne({ _id: requestId }, {
            isPending: false,
            isAccepted: true,
            isDeclined: false,
            isBlocked: false
        });

        return await RequestToTheCommunityModel.findOne({ _id: requestId });
    }

    public async deleteRequest(requestId: string) {
        return await RequestToTheCommunityModel.deleteOne({ _id: requestId });
    }

    public async deleteUserRequest(professionalId: string, communityId: string) {
        const documentDelete = await RequestToTheCommunityModel.findOne({ professionalId, communityId });
        return await RequestToTheCommunityModel.deleteOne({ _id: documentDelete.id });
    }

    public async refuseRequest(requestId: string) {

        const request = await RequestToTheCommunityModel.findOne({ _id: requestId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await RequestToTheCommunityModel.updateOne({ _id: requestId }, { isDeclined: true, isPending: false, isAccepted: false, isBlocked: false });
    }

    public async blockedRequest(requestId: string) {

        const request = await RequestToTheCommunityModel.findOne({ _id: requestId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await RequestToTheCommunityModel.updateOne({ _id: requestId }, { isDeclined: false, isPending: false, isAccepted: false, isBlocked: true });
    }

    public async blockedUserRequest(professionalId: string, communityId: string) {

        const request = await RequestToTheCommunityModel.findOne({ professionalId, communityId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await RequestToTheCommunityModel.updateOne({ professionalId, communityId }, { isDeclined: false, isPending: false, isAccepted: false, isBlocked: true });
    }

    public async getRequestById(requestId: string) {
        return await RequestToTheCommunityModel.findOne({ _id: requestId });
    }

    public async getAllrefuseRequest() {
        return await RequestToTheCommunityModel.find({ isDeclined: true });
    }

    public async getAllPendingRequest() {
        return await RequestToTheCommunityModel.find({ isPending: true });
    }

    public async getAllAcceptedRequest() {
        return await RequestToTheCommunityModel.find({ isAccepted: true });
    }

    public async updateRequest(requestId: string, body: any) {

        const requestToAccept = await RequestToTheCommunityModel.findOne({ _id: requestId });

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await RequestToTheCommunityModel.updateOne({ _id: requestId }, body);

        return await RequestToTheCommunityModel.findOne({ _id: requestId });
    }

    // communities
    public async getAllrefuseRequestByCommunity(communityId: string) {
        return await RequestToTheCommunityModel.find({ isDeclined: true, communityId })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });
    }

    public async getAllPendingRequestByCommunity(communityId: string) {
        return await RequestToTheCommunityModel.find({ isPending: true, communityId })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });
    }

    public async getAllAcceptedRequestByCommunity(communityId: string) {
        return await RequestToTheCommunityModel.find({ isAccepted: true, communityId })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, alias: 1
            })
    }

    public async getAllBlockedRequestByCommunity(communityId: string) {
        return await RequestToTheCommunityModel.find({ isBlocked: true, communityId })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });
    }

    public async getAllUsersAcceptedRequestByCommunity(communityId: string) {
        const users = await RequestToTheCommunityModel.find({ isAccepted: true, communityId }, { isPending: 0, isDeclined: 0, __v: 0 })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });

        const foundator = await professionalCommunitiesServices.getfoundatorCommunity(communityId);
        users.push(foundator);
        return users;
    }

    public async communitiesIBelong(professionalId: string) {
        return await RequestToTheCommunityModel.find({ isAccepted: true, professionalId }, { isAccepted: 1, _id: 0 })
            .populate([{
                path: 'communityId',
                model: 'ProfessionalCommunities',
                select: 'name description CategoriesOfCommunitiesIDS profilePicture',
                populate: [{
                    path: 'CategoriesOfCommunitiesIDS',
                    model: 'CategoriesOfCommunitiesProfessional',
                    select: 'name description'
                }]
            }
            ])
    }

    public async communitiesIAmBlocked(professionalId: string) {
        return await RequestToTheCommunityModel.find({ isBlocked: true, professionalId })
            .populate([{
                path: 'communityId',
                model: 'ProfessionalCommunities',
                select: 'name description CategoriesOfCommunitiesIDS',
                populate: [{
                    path: 'CategoriesOfCommunitiesIDS',
                    model: 'CategoriesOfCommunitiesProfessional',
                    select: 'name description'
                }]
            }
            ])
    }

    public async getRequestOnCommunityByProfessionalId(professionalId: string, communityId: string) {
        let infoUser = await RequestToTheCommunityModel.find({ professionalId, communityId }, { __v: 0 });
        return infoUser;
    }

    public async getInfoUserOnCommunityByProfessionalId(professionalId: string, communityId: string) {

        /* let infoUser = await RequestToTheCommunityModel.find({ professionalId, communityId }, { __v: 0 })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, alias: 1
            }); */

        const infoManager = await professionalCommunityUsersService.getProfessionalCommunityUserId(professionalId);

        let members: any = [], getUsers: any = []
        infoManager ? members.push(infoManager) : members
            getUsers = await this.getAllProfessionalsAcceptedIDS(communityId);

            if (getUsers.length > 0) {
                for await (let member of getUsers) {
                    const memberComplete = await ProfessionalCommunitiesModel.findOne({
                        $and: [{ communityId: member.communityId }, { assignedUserId: member.professionalId }]
                    })
                        .populate('assignedUserId', {birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
                        .populate([
                            {
                                path: 'roleCommunityId',
                                model: 'UserRolesInTheCommunity',
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

        const requestToAccept = await RequestToTheCommunityModel.findOne({ _id: body.requestId }).populate('communityId');

        if (!requestToAccept) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        await notificationsServices.sendNotificationRequestProfessionalCommunities(requestToAccept,true)

        await RequestToTheCommunityModel.updateOne({ _id: body.requestId }, {
            isPending: false,
            isAccepted: true,
            isDeclined: false,
            isBlocked: false
        });
        let bodyUserRole = {
            assignedUserId:requestToAccept.professionalId,
            allocatorUserId:requestToAccept.communityId.professionalId,
            communityId:requestToAccept.communityId.id,
            isNormalUser: true
        }
        await professionalCommunityUsersService.acceptRequestProfessional(bodyUserRole)
        return await RequestToTheCommunityModel.findOne({ _id: body.requestId });
    }

    public async getAllProfessionalsAcceptedIDS(communityId: string) {
        const users = await RequestToTheCommunityModel.find({ isAccepted: true, communityId }, { isPending: 0, isDeclined: 0, __v: 0 });
        return users;
    }

    public async getByProfessionalsIdAndCommunityIdAccepted(body: any) {
        const users = await RequestToTheCommunityModel.findOne({
            $and:[{isAccepted: true},{communityId:body.communityId},{professionalId:body.professionalId}]}, { isPending: 0, isDeclined: 0, __v: 0 });
        return users;
    }

    public async getByProfessionalsIdAndCommunityId(body: any) {
        const users = await RequestToTheCommunityModel.findOne({
            $and:[{communityId:body.communityId},{professionalId:body.professionalId}]}, { __v: 0 });
        return users;
    }

    public async toUnlockUserRequest(professionalId: string, communityId: string) {

        const request = await RequestToTheCommunityModel.findOne({ professionalId, communityId });
        if (!request) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return await RequestToTheCommunityModel.updateOne({ professionalId, communityId }, { isDeclined: false, isPending: false, isAccepted: true, isBlocked: false });
    }
}

export const requestToTheCommunityService = new RequestToTheCommunityService();