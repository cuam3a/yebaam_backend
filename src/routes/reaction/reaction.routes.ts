import { Router } from 'express';
import { reactionsController } from '../../controllers/reactions/reactions.controller';

const reactionRoutes: Router = Router();

reactionRoutes.get('/', reactionsController.getallReactions);
reactionRoutes.post('/create', reactionsController.createReaction);
reactionRoutes.post('/id', reactionsController.getReactionById);
reactionRoutes.post('/delete-id', reactionsController.deleteReactionById);
reactionRoutes.post('/update-id', reactionsController.updateReactionById);

export default reactionRoutes;