import { Router } from 'express';
import { trendController } from '../../controllers/trends/trend.controller';

const trendRoutes: Router = Router();
trendRoutes.get('/', trendController.getAllTrends)

export default trendRoutes;