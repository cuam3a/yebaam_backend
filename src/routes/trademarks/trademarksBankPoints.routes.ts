import { Router } from 'express';
import { trademarksBankController } from '../../controllers/trademark/trademarksBankPoints.controller';
const trademarksBankPoints: Router = Router();

trademarksBankPoints.post('/register', trademarksBankController.registerPoints);
// trademarksBankPoints.post('/substract', trademarksBankController.substractPoints);
// trademarksBankPoints.post('/delete-id', trademarksBankController.deletePointsBankById);
// trademarksBankPoints.post('/deactivate-id', trademarksBankController.deactivatePointsBankById);
// trademarksBankPoints.post('/update-id', trademarksBankController.updatePointsBankById);
// trademarksBankPoints.get('/getall-banks', trademarksBankController.getAllPointsBanks);
trademarksBankPoints.post('/getbank-id', trademarksBankController.getPointsBankById);
trademarksBankPoints.post('/entity-id', trademarksBankController.getPointsBankByUserMarkId);

export default trademarksBankPoints;