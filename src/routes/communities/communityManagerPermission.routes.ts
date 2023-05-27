import { Router } from 'express';
import { communityManagerPermissionsController } from '../../controllers/communities/communityManagerPermissions.controller';

const communityManagerPermissionsRoutes: Router = Router();

communityManagerPermissionsRoutes.post('/create', communityManagerPermissionsController.createPermission);
communityManagerPermissionsRoutes.post('/update', communityManagerPermissionsController.updatePermission);
communityManagerPermissionsRoutes.post('/delete', communityManagerPermissionsController.deletePermission);
communityManagerPermissionsRoutes.post('/get/id', communityManagerPermissionsController.getPermissionbyId);
communityManagerPermissionsRoutes.get('/get/activePermissions', communityManagerPermissionsController.getAllPermissionActive);
communityManagerPermissionsRoutes.get('/get/inactivePermissions', communityManagerPermissionsController.getAllPermissionInavtive);

export default communityManagerPermissionsRoutes;