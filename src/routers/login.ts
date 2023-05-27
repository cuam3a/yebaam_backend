import { Router } from 'express';
import { loginController } from '../controllers/login/login.controller';

const loginRoutes: Router = Router();

loginRoutes.post('/email', loginController.loginEmailValidation);
loginRoutes.post('/password', loginController.loginPassswordValidation);

export default loginRoutes;