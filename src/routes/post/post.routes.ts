import { Router } from 'express';
import { postController } from "../../controllers/post/post.controller";

const postRoutes: Router = Router();

postRoutes.post('/create', postController.createPost);
postRoutes.post('/postsuser', postController.getPostByUserID);
postRoutes.post('/delete-id', postController.deletePostByIdOnlyDev);
postRoutes.post('/generals', postController.getGeneralPost);
postRoutes.post('/home', postController.getPostsForHome);
postRoutes.post('/update', postController.updatePost);
postRoutes.post('/delete', postController.deletePost);
postRoutes.post('/post-id', postController.postByID);
postRoutes.post('/move', postController.movePosts);
postRoutes.post('/copy', postController.copyPosts);
postRoutes.post('/community', postController.getPostsByCommunityID);

export default postRoutes;