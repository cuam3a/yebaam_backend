import { Router } from 'express';
import { mercadoController } from '../../controllers/mercadoPago/mercadoPago.controller';

const mercadoRoutes: Router = Router();

mercadoRoutes.post('/pay', mercadoController.checkoutProLink);
mercadoRoutes.get('/process', mercadoController.processPayment);
mercadoRoutes.post('/webhook', mercadoController.webHook);

export default mercadoRoutes;