import { Router } from 'express';
import { postRequestController } from "../../controllers/postrequests/postrequests.controller";

const postRequestRoutes: Router = Router();

postRequestRoutes.post('/update-id', postRequestController.changeStateRequest);
postRequestRoutes.post('/community-id', postRequestController.getRequestsByAnyCommunityID);

export default postRequestRoutes;