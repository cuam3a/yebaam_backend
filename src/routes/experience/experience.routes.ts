import { Router } from 'express';
import { experienceController } from '../../controllers/experience/experience.controller';

const experienceRoutes: Router = Router();

experienceRoutes.post('/create', experienceController.createExperience);
experienceRoutes.post('/id', experienceController.getExperienceByID);
experienceRoutes.post('/update-id', experienceController.updateExperienceByID);
experienceRoutes.post('/delete-id', experienceController.deleteExperienceByID);
experienceRoutes.post('/professional-id', experienceController.getExperiencesByProfessionalID);
experienceRoutes.post('/unfinished', experienceController.getUnfinishedExperiencesByProfessionalID);

export default experienceRoutes;