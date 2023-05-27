import { Router } from 'express';
import { pqrsController } from "../../controllers/pqrs/pqrs.controller";

const pqrsRoutes: Router = Router();

pqrsRoutes.post('/', pqrsController.getPqrs);
pqrsRoutes.post('/type/', pqrsController.getPqrsByType);
pqrsRoutes.post('/send/', pqrsController.sendPQRS);
pqrsRoutes.post('/disable/', pqrsController.disablePqrs);

export default pqrsRoutes;