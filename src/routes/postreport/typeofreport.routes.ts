import { Router } from 'express';
import { typeOfReportController } from "../../controllers/postreports/typeofreports.controller";

const typeOfReportRoutes: Router = Router();

typeOfReportRoutes.get('/', typeOfReportController.getAllTypes);
typeOfReportRoutes.post('/id', typeOfReportController.getTypeOfReportByID);
typeOfReportRoutes.post('/create', typeOfReportController.createTypeOfReport);
typeOfReportRoutes.post('/update-id', typeOfReportController.updateTypeOfReport);
typeOfReportRoutes.post('/delete-id', typeOfReportController.deleteTypeOfReport);

export default typeOfReportRoutes;