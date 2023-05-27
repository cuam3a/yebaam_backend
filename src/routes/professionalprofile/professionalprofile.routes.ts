import { Router } from 'express';
import { proffesionalPorifleController } from '../../controllers/professionalprofile/professionalprofile.controller';

const professionalProfilleRoutes: Router = Router();

professionalProfilleRoutes.get('/', proffesionalPorifleController.getAllProfessionalProfile);
professionalProfilleRoutes.post('/create', proffesionalPorifleController.createProfessionalProfile);
professionalProfilleRoutes.post('/id', proffesionalPorifleController.getProfessionalProfileByID);
professionalProfilleRoutes.post('/update-id', proffesionalPorifleController.updateProfessionalProfileByID);
professionalProfilleRoutes.post('/delete-id', proffesionalPorifleController.deleteProfessionalProfileByID);
professionalProfilleRoutes.post('/search', proffesionalPorifleController.searchForProfessionals);
professionalProfilleRoutes.post('/delete-id-od', proffesionalPorifleController.deleteProfessionalByIDOnlyDev);

export default professionalProfilleRoutes;