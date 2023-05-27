import { Router } from 'express';
import { generalLimitController } from "../../controllers/admin/generallimits/generallimits.controller";

const reportingLimitRoutes: Router = Router();

reportingLimitRoutes.get('/', generalLimitController.getLimits);
reportingLimitRoutes.post('/id', generalLimitController.getLimitByID);
reportingLimitRoutes.post('/create', generalLimitController.createGeneralLimit);
reportingLimitRoutes.post('/update-id', generalLimitController.updateGeneralLimitByID);

export default reportingLimitRoutes;