import { Router } from 'express';
const skillProfessionalRoutes: Router = Router();
import { skillProfessionalController } from '../../controllers/skill/skillProfessional.controller';

skillProfessionalRoutes.get('/', skillProfessionalController.getAllSkillProfessional);
skillProfessionalRoutes.post('/skillId', skillProfessionalController.getAllSkillProfessionalBySkillId);
skillProfessionalRoutes.post('/id', skillProfessionalController.getAllSkillProfessionalById);
skillProfessionalRoutes.post('/create', skillProfessionalController.createSkillProfessional);
skillProfessionalRoutes.post('/update', skillProfessionalController.UpdateSkillProfessionalById);
skillProfessionalRoutes.post('/delete', skillProfessionalController.DeleteSkillProfessionalById);
skillProfessionalRoutes.post('/deleteAdmin', skillProfessionalController.DeleteSkillProfessionalByIdAdmin);

export default skillProfessionalRoutes;