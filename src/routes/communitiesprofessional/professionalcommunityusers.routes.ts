import { Router } from 'express';
import { professionalCommunityUsersController } from '../../controllers/communitiesprofessional/professionalcommunityusers.controller';
import permissionsforprofessionalcommunityrolesRoutes from './permissionsforprofessionalcommunityroles.routes';


const professionalcommunityusersRouter: Router = Router();

professionalcommunityusersRouter.post('/create', professionalCommunityUsersController.createProfessionalCommunityUser);
professionalcommunityusersRouter.post('/update', professionalCommunityUsersController.updateProfessionalCommunityUser);
professionalcommunityusersRouter.post('/delete', professionalCommunityUsersController.deleteProfessionalCommunityUser);
professionalcommunityusersRouter.post('/get/communityId', professionalCommunityUsersController.getAllProfessionalCommunityUserOnCommunity);
professionalcommunityusersRouter.get('/get/all', professionalCommunityUsersController.getAllProfessionalCommunityUsers);
professionalcommunityusersRouter.post('/get/id', professionalCommunityUsersController.getProfessionalCommunityUserById);
professionalcommunityusersRouter.post('/asign/type', professionalCommunityUsersController.asignRoleToProfessional);
professionalcommunityusersRouter.post('/get/members', professionalCommunityUsersController.getMembersCommunity);

//permissions
professionalcommunityusersRouter.use('/permissions', permissionsforprofessionalcommunityrolesRoutes);

export default professionalcommunityusersRouter;