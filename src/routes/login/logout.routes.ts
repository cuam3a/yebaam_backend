import { Router } from 'express';
import { logoutController } from '../../controllers/login/logout.controller';

const logoutRoutes: Router = Router();

logoutRoutes.post('/', logoutController.logout);

export default logoutRoutes;