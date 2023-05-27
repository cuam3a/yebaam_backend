import { Router } from 'express';
import { contentSavedController } from "../../controllers/savedcontents/savedcontents.controller";

const savedContentsRoutes: Router = Router();

// savedContentsRoutes.get('/', contentSavedController.getAllCertificateClassTypes);
savedContentsRoutes.post('/user-type', contentSavedController.getSavedContentByUserNTypeID);
savedContentsRoutes.post('/create', contentSavedController.createSavedContent);
// savedContentsRoutes.post('/update-id', contentSavedController.updateCertificateClassTypeByID);
savedContentsRoutes.post('/delete-id', contentSavedController.deleteSavedContentByID);

export default savedContentsRoutes;