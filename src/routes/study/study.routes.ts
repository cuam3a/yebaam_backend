import { Router } from 'express';
import { studyController } from '../../controllers/study/study.controller';

const studyRoutes: Router = Router();

studyRoutes.post('/create', studyController.createStudy);
studyRoutes.post('/id', studyController.getStudyByID);
studyRoutes.post('/update-id', studyController.updateStudyByID);
studyRoutes.post('/delete-id', studyController.deleteStudyByID);
studyRoutes.post('/professional-id', studyController.getStudiesByProfessionalID);
studyRoutes.post('/unfinished', studyController.getUnfinishedStudiesByProfessionalID);

export default studyRoutes; 1