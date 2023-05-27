import { Router } from 'express';
import { brandRankingController } from "../../controllers/brandranking/brandranking.controller";

const brandRankingRoutes: Router = Router();

brandRankingRoutes.post('/', brandRankingController.getRankingBrands);

export default brandRankingRoutes;