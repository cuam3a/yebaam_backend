import { Router } from 'express';
import { rankingController } from '../../controllers/userranking/userranking.controller';

const rankingRoutes: Router = Router();

rankingRoutes.post('/user-id', rankingController.getUserRanking);

export default rankingRoutes;