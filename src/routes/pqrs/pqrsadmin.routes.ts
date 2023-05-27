import {Router} from "express";
import {pqrsController} from "../../controllers/pqrs/pqrsadmin.controller";

const pqrsadminRoutes: Router = Router();

pqrsadminRoutes.post('/', pqrsController.getPqrs);
pqrsadminRoutes.post('/type', pqrsController.getPqrsByType);
pqrsadminRoutes.post('/response/', pqrsController.responsePQRS);
pqrsadminRoutes.post('/disable/', pqrsController.disablePqrs);

export default pqrsadminRoutes;