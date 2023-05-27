import { Router } from 'express';
import { professionalPostController } from "../../controllers/professionalpost/professionalpost.controller";

const professionalPostRoutes: Router = Router();

professionalPostRoutes.post('/create', professionalPostController.createPost);
professionalPostRoutes.post('/professional-id', professionalPostController.getPostByProfessionalID);
professionalPostRoutes.post('/update-id', professionalPostController.updatePostByID);
professionalPostRoutes.post('/delete-id', professionalPostController.deletePostByID);
professionalPostRoutes.post('/home', professionalPostController.getPostsHomeProfessionalById);
professionalPostRoutes.post('/community', professionalPostController.getPostsByCommunityID);
professionalPostRoutes.post('/id', professionalPostController.getProfessionalPostByID);

export default professionalPostRoutes;