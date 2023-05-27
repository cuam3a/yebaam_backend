import { Router } from 'express';
import { banLimitController } from "../../controllers/postreports/banlimits.controller";

const banLimitRoutes: Router = Router();

banLimitRoutes.get('/', banLimitController.getAllBanLimits);
banLimitRoutes.post('/id', banLimitController.getBanLimitByID);
banLimitRoutes.get('/actual-limit', banLimitController.getActualLimit);
banLimitRoutes.post('/create', banLimitController.createBanLimit);
banLimitRoutes.post('/update-id', banLimitController.updateBanLimitByID);
banLimitRoutes.post('/delete-id', banLimitController.deleteBanLimitByID);

export default banLimitRoutes;