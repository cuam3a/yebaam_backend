import { Router } from 'express';
import { awardController } from '../../controllers/admin/awards/awards.controller';

const awardsRoutes: Router = Router();

awardsRoutes.get('/', awardController.getAllAwards);
awardsRoutes.post('/id', awardController.getAwardByID);
awardsRoutes.post('/create', awardController.createAward);
awardsRoutes.post('/update-id', awardController.updateAwardByID);
awardsRoutes.post('/delete-id', awardController.deleteAwardByID);

export default awardsRoutes;