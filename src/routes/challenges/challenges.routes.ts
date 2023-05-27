import { Router } from 'express';
import { challengesController } from '../../controllers/challenges/challenges.controller';

const challengeRoutes: Router = Router();

challengeRoutes.post('/id', challengesController.getChallengeByID);
challengeRoutes.get('/enabled', challengesController.getActiveChallenges);
challengeRoutes.post('/create', challengesController.createChallenge);
challengeRoutes.post('/update-id', challengesController.updateChallengeByID);
challengeRoutes.post('/delete-id', challengesController.deleteChallengeByID);

export default challengeRoutes;