import { Router } from 'express';
import { systemActionController } from '../../controllers/systemactions/systemactions.controller';

const systemActionRoutes: Router = Router();

systemActionRoutes.get('/', systemActionController.getAllSystemActions);
systemActionRoutes.post('/id', systemActionController.getSystemActionsByID);
systemActionRoutes.post('/create', systemActionController.createSystemAction);
systemActionRoutes.post('/update-id', systemActionController.updateSystemActionByID);
systemActionRoutes.post('/delete-id', systemActionController.deleteSystemActionByID);

export default systemActionRoutes;