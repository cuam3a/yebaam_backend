import { Router } from 'express';
import { reportingLimitController } from "../../controllers/postreports/reportinglimits.controller";

const reportingLimitRoutes: Router = Router();

reportingLimitRoutes.get('/', reportingLimitController.getLimits);
reportingLimitRoutes.post('/id', reportingLimitController.getLimitByID);
reportingLimitRoutes.post('/create', reportingLimitController.createReportLimit);
reportingLimitRoutes.post('/update-id', reportingLimitController.updateReportLimitByID);

export default reportingLimitRoutes;