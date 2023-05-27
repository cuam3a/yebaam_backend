import { Router } from 'express';
import { userRolesInTheCommunityController } from '../../controllers/communitiesprofessional/userrolesinthecommunity.controller';
const userrolesinthecommunityRoutes: Router = Router();

userrolesinthecommunityRoutes.post('/create', userRolesInTheCommunityController.createRole);
userrolesinthecommunityRoutes.post('/update', userRolesInTheCommunityController.editRole);
userrolesinthecommunityRoutes.post('/delete', userRolesInTheCommunityController.deleteRole);
userrolesinthecommunityRoutes.get('/get/actives', userRolesInTheCommunityController.getAllRoles);
userrolesinthecommunityRoutes.get('/get/inactives', userRolesInTheCommunityController.getAllInactiveRoles);
userrolesinthecommunityRoutes.post('/get/id', userRolesInTheCommunityController.getRoleById);

export default userrolesinthecommunityRoutes;