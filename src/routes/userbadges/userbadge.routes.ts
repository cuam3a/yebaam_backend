import { Router } from 'express';
import { userBadgeController } from '../../controllers/userbadges/userbadge.controller';

const userBadgeRoutes: Router = Router();

userBadgeRoutes.post('/user-id', userBadgeController.getUserBadgesByUserID);

export default userBadgeRoutes;