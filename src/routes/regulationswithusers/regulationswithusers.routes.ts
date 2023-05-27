import { Router } from 'express';
import { regulationsWithUsersController } from '../../controllers/regulationswithusers/regulationswithusers.controller';

const regulationswithusersRoutes: Router = Router();

regulationswithusersRoutes.get('/', regulationsWithUsersController.getRegulationsWithUsers);
regulationswithusersRoutes.post('/create', regulationsWithUsersController.createRegulationsWithUsers);
regulationswithusersRoutes.post('/id', regulationsWithUsersController.validateRegulationsWithUsers);
regulationswithusersRoutes.post('/delete-id', regulationsWithUsersController.deleteRegulationsWithUsers);
regulationswithusersRoutes.post('/update-id', regulationsWithUsersController.updateRegulationsWithUsers);

export default regulationswithusersRoutes;