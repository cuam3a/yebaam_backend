import { Router } from 'express';
import { typeOfAwardController } from '../../controllers/admin/awards/typeofawards.controller';

const awardsRoutes: Router = Router();

awardsRoutes.get('/', typeOfAwardController.getAllTypes);
awardsRoutes.post('/id', typeOfAwardController.getTypeOfReportByID);
awardsRoutes.post('/create', typeOfAwardController.createTypeOfAward);
awardsRoutes.post('/update-id', typeOfAwardController.updateTypeOfAward);
awardsRoutes.post('/delete-id', typeOfAwardController.deleteTypeOfAward);

export default awardsRoutes;