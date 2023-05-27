import { Router } from 'express';
import { userReactionsController } from '../../controllers/userreactions/userreactions.controller';

const userReactionRoutes: Router = Router();

userReactionRoutes.post('/create', userReactionsController.createReact);
userReactionRoutes.post('/entity-id', userReactionsController.getReactionsByIdEntity);

export default userReactionRoutes;