import { Router } from 'express';
import { requestToTheCommunityController } from '../../controllers/communitiesprofessional/requeststothecommunity.controller';

const requeststothecommunityRoutes: Router = Router();

requeststothecommunityRoutes.post('/create', requestToTheCommunityController.createRequest);
requeststothecommunityRoutes.post('/acept', requestToTheCommunityController.acceptRequest);
requeststothecommunityRoutes.post('/refuse', requestToTheCommunityController.refuseRequest);
requeststothecommunityRoutes.post('/blockUser', requestToTheCommunityController.blockedUserRequest);
requeststothecommunityRoutes.post('/update', requestToTheCommunityController.updateRequest);
requeststothecommunityRoutes.post('/get/requestId', requestToTheCommunityController.getRequestById);
requeststothecommunityRoutes.post('/get/refuses/communityId', requestToTheCommunityController.getAllrefuseRequestByCommunity);
requeststothecommunityRoutes.post('/get/pending/communityId', requestToTheCommunityController.getAllPendingRequestByCommunity);
requeststothecommunityRoutes.post('/get/accepted/communityId', requestToTheCommunityController.getAllAcceptedRequestByCommunity);
requeststothecommunityRoutes.post('/get/blocked/communityId', requestToTheCommunityController.getAllBlockedRequestByCommunity);
requeststothecommunityRoutes.post('/get/professionals/communityId', requestToTheCommunityController.getAllUsersAcceptedRequestByCommunity);
requeststothecommunityRoutes.post('/delete/requestId', requestToTheCommunityController.deleteRequest);
requeststothecommunityRoutes.post('/delete/professionalId', requestToTheCommunityController.deleteUserRequest);
requeststothecommunityRoutes.post('/accept', requestToTheCommunityController.acceptRequestOther);
requeststothecommunityRoutes.post('/to-unlocked', requestToTheCommunityController.toUnlockedUserRequest);

export default requeststothecommunityRoutes;