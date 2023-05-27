import { Router } from 'express';
import { awsController } from '../../controllers/aws/aws.controller';

const awsRouter: Router = Router();

awsRouter.get('/', awsController.getFile);
awsRouter.get('/url', awsController.getURLFile);
awsRouter.post('/upload', awsController.uploadFile);

export default awsRouter;
