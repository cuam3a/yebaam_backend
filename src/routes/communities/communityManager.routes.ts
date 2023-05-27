import { Router } from 'express';
import { communityManagerController } from '../../controllers/communities/communityManager.controller';
import communityManagerPermissionsRoutes from './communityManagerPermission.routes';


const communityManagerRouter: Router = Router();

communityManagerRouter.post('/create', communityManagerController.createCommunityManager);
communityManagerRouter.post('/update', communityManagerController.updateCommunityManager);
communityManagerRouter.post('/delete', communityManagerController.deleteCommunityManager);
communityManagerRouter.post('/get/communityId', communityManagerController.getAllCommunityManagerOnCommunity);
communityManagerRouter.get('/get/all', communityManagerController.getAllCommunityManager);
communityManagerRouter.post('/get/id', communityManagerController.getCommunityManagerById);
communityManagerRouter.post('/asign/type', communityManagerController.asignTypeToUser);
communityManagerRouter.post('/get/members', communityManagerController.getMembersCommunity);

//permissions
communityManagerRouter.use('/permissions', communityManagerPermissionsRoutes);

export default communityManagerRouter;