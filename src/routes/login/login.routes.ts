import { Router } from 'express';
import { loginController } from '../../controllers/login/login.controller';

const loginRoutes: Router = Router();

loginRoutes.post('/email', loginController.loginEmailValidation);
loginRoutes.post('/password', loginController.loginPassswordValidation);
loginRoutes.post('/login', loginController.loginUser);

export default loginRoutes;