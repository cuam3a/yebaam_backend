import { Router } from 'express';
import { certificateClassTypeController } from "../../controllers/certificates/certificateclasstypes.controller";

const certificateClassTypesRoutes: Router = Router();

certificateClassTypesRoutes.get('/', certificateClassTypeController.getAllCertificateClassTypes);
certificateClassTypesRoutes.post('/id', certificateClassTypeController.getCertificateClassTypeByID);
certificateClassTypesRoutes.post('/create', certificateClassTypeController.createCertificateClassType);
certificateClassTypesRoutes.post('/update-id', certificateClassTypeController.updateCertificateClassTypeByID);
certificateClassTypesRoutes.post('/delete-id', certificateClassTypeController.deleteCertificateClassTypeByID);

export default certificateClassTypesRoutes;