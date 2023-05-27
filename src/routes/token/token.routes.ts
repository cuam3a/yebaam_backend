import { Router } from 'express';
import { tokenController } from '../../controllers/token/token.controller';

const tokenRoutes: Router = Router();

tokenRoutes.post('/', tokenController.getNewToken);
tokenRoutes.post('/get-new', tokenController.getNewTokenAccess);

export default tokenRoutes;