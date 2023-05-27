import { Router } from 'express';
import { userChallengesController } from '../../controllers/userchallenges/userchallenges.controller';

const userChallengesRoutes: Router = Router();

userChallengesRoutes.post('/user-id', userChallengesController.getUserChallengesByUserID);

export default userChallengesRoutes;