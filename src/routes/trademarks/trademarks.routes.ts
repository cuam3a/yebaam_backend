import { Router } from 'express';
import { trademarksController } from '../../controllers/trademark/trademark.controller';

const trademarkRoutes: Router = Router();

trademarkRoutes.get('/', trademarksController.getallTrademarks);
trademarkRoutes.post('/create', trademarksController.createTradeMark);
trademarkRoutes.post('/new-password', trademarksController.resetPassword);
trademarkRoutes.post('/id', trademarksController.getTrademarkById);
trademarkRoutes.post('/delete-id', trademarksController.deleteTrademarkById);
trademarkRoutes.post('/update-id', trademarksController.updateTrademarkById);
trademarkRoutes.post('/brand-basic', trademarksController.createBrandDataBasic);
//#region typeOfMark
trademarkRoutes.post('/create-type', trademarksController.createTypeofmark);
trademarkRoutes.post('/get-types-brands', trademarksController.getTypeofmarks);
trademarkRoutes.post('/get-type-id', trademarksController.getTypeofmarkByID);
trademarkRoutes.post('/get-type-name', trademarksController.getTypeofmarkByName);
trademarkRoutes.post('/update-type', trademarksController.updateTypeofmark);
trademarkRoutes.post('/delete-type', trademarksController.deleteTypeofmark);
//#endregion

export default trademarkRoutes;