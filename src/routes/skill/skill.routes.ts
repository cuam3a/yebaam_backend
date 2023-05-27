import { Router } from 'express';
const skillRoutes: Router = Router();
import { skillController } from '../../controllers/skill/skill.controller';

skillRoutes.get('/', skillController.getAllSkill);
skillRoutes.post('/get-id', skillController.getSkillById);
skillRoutes.post('/create', skillController.createSkill);
skillRoutes.post('/update', skillController.UpdateSkillById);
skillRoutes.post('/delete', skillController.DeleteSkillById);
skillRoutes.post('/deleteAdmin', skillController.DeleteSkillByIdAdmin);

export default skillRoutes;