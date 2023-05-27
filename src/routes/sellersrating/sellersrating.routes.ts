import { Router } from 'express';
import { sellersRatingController } from "../../controllers/sellersrating/sellersrating.controller";

const banLimitRoutes: Router = Router();

// banLimitRoutes.get('/', sellersRatingController.getAllBanLimits);
banLimitRoutes.post('/seller-id', sellersRatingController.getRatingCounter);
// banLimitRoutes.get('/actual-limit', sellersRatingController.getActualLimit);
banLimitRoutes.post('/create', sellersRatingController.createSellerRating);
// banLimitRoutes.post('/update-id', sellersRatingController.updateBanLimitByID);
// banLimitRoutes.post('/delete-id', sellersRatingController.deleteBanLimitByID);

export default banLimitRoutes;