import { Router } from 'express';
import { replyToCommentController } from '../../controllers/replytocomment/replytocomment.controller';

const replyToCommentRoutes: Router = Router();

replyToCommentRoutes.post('/create', replyToCommentController.createReplyComment);
replyToCommentRoutes.post('/delete-id', replyToCommentController.deleteReplyCommentById);
replyToCommentRoutes.post('/update-id', replyToCommentController.updateReplyCommentById);

export default replyToCommentRoutes;