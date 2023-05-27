import { Router } from 'express';
import { communityReportController } from "../../controllers/communityreports/communityreports.controller";

const communityReportRoutes: Router = Router();

communityReportRoutes.post('/create', communityReportController.createCommunityReport);
communityReportRoutes.post('/entity-id', communityReportController.getReportsByUserID);
communityReportRoutes.post('/state', communityReportController.getReportsByState);
communityReportRoutes.post('/delete-id', communityReportController.deletePostReportById);
communityReportRoutes.post('/delete-community-id', communityReportController.deleteCommunityReportByCommunityId);
communityReportRoutes.post('/change-state-user', communityReportController.changeReportStateForUserByID);
communityReportRoutes.post('/change-state', communityReportController.changeReportStateByID);
communityReportRoutes.post('/user-reported-id', communityReportController.getReportsByUserReportedID);

export default communityReportRoutes;