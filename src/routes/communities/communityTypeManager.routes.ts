import { Router } from 'express';
import { communityTypesManagerController } from '../../controllers/communities/communityTypesManager.controller';

const communityManagerTypesRoutes: Router = Router();

communityManagerTypesRoutes.post('/create', communityTypesManagerController.createTypeCommunityManager );
communityManagerTypesRoutes.post('/update', communityTypesManagerController.updateTypeCommunityManager);
communityManagerTypesRoutes.post('/delete', communityTypesManagerController.deleteTypeCommunityManager);
communityManagerTypesRoutes.get('/get/actives', communityTypesManagerController.getAllActiveTypeCommunityManager);
communityManagerTypesRoutes.get('/get/inactives', communityTypesManagerController.getAllInActiveTypeCommunityManager);
communityManagerTypesRoutes.post('/get/id', communityTypesManagerController.getTypeCommunityManagerById);

export default communityManagerTypesRoutes;