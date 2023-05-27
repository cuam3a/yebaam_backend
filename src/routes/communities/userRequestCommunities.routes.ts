import { Router } from 'express';
import { userRequestCommunityController } from '../../controllers/communities/userRequestCommunity.controller';

const userRequestCommunitiesRoutes: Router = Router();

userRequestCommunitiesRoutes.post('/create', userRequestCommunityController.createRequest);
userRequestCommunitiesRoutes.post('/acept', userRequestCommunityController.acceptRequest);
userRequestCommunitiesRoutes.post('/refuse', userRequestCommunityController.refuseRequest);
userRequestCommunitiesRoutes.post('/blockUser', userRequestCommunityController.blockedUserRequest);
userRequestCommunitiesRoutes.post('/update', userRequestCommunityController.updateRequest);
userRequestCommunitiesRoutes.post('/get/requestId', userRequestCommunityController.getRequestById);
userRequestCommunitiesRoutes.post('/get/refuses/communityId', userRequestCommunityController.getAllrefuseRequestByCommunity);
userRequestCommunitiesRoutes.post('/get/pending/communityId', userRequestCommunityController.getAllPendingRequestByCommunity);
userRequestCommunitiesRoutes.post('/get/accepted/communityId', userRequestCommunityController.getAllAcceptedRequestByCommunity);
userRequestCommunitiesRoutes.post('/get/blocked/communityId', userRequestCommunityController.getAllBlockedRequestByCommunity);
userRequestCommunitiesRoutes.post('/get/users/communityId', userRequestCommunityController.getAllUsersAcceptedRequestByCommunity);
userRequestCommunitiesRoutes.post('/delete/requestId', userRequestCommunityController.deleteRequest);
userRequestCommunitiesRoutes.post('/delete/userId', userRequestCommunityController.deleteUserRequest);
userRequestCommunitiesRoutes.post('/accept', userRequestCommunityController.acceptRequestOther);
userRequestCommunitiesRoutes.post('/to-unlocked', userRequestCommunityController.toUnlockedUserRequest);

export default userRequestCommunitiesRoutes;