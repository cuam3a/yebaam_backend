import { Router } from 'express';
import { postReportController } from "../../controllers/postreports/postreports.controller";

const postReportRoutes: Router = Router();

postReportRoutes.post('/create', postReportController.createPostReport);
postReportRoutes.post('/user-id', postReportController.getReportsByUserID);
postReportRoutes.post('/state', postReportController.getReportsByState);
postReportRoutes.post('/delete-id', postReportController.deletePostReportById);
postReportRoutes.post('/delete-post-id', postReportController.deletePostReportByPostId);
postReportRoutes.post('/change-state-user', postReportController.changeReportStateForUserByID);
postReportRoutes.post('/change-state', postReportController.changeReportStateByID);
postReportRoutes.post('/user-reported-id', postReportController.getReportsByUserReportedID);

export default postReportRoutes;