import { Router } from 'express';
import { commentsController } from '../../controllers/comments/comments.controller';

const commentRoutes: Router = Router();

// commentRoutes.get('/', reactionsController.getallReactions);
commentRoutes.post('/create', commentsController.createComment);
commentRoutes.post('/post-id', commentsController.getCommentsNRepliesNReactionsByPostID);
commentRoutes.post('/comment-id', commentsController.getCommentNRepliesNReactionsByID);
commentRoutes.post('/delete-id', commentsController.deleteCommentById);
commentRoutes.post('/update-id', commentsController.updateCommentById);

export default commentRoutes;