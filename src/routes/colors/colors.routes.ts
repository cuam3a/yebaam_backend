import { Router } from 'express';
import { colorsController } from '../../controllers/colors/colors.controller';

const colorsRouter: Router = Router();

colorsRouter.post('/create', colorsController.createColor);
colorsRouter.post('/get-all', colorsController.getAllColors);
colorsRouter.post('/get-color-by-any-field', colorsController.getColorByAnyField);
colorsRouter.post('/update', colorsController.updateColorById);
colorsRouter.post('/delete', colorsController.deleteColor);

export default colorsRouter;