import { Router } from 'express';
import { categoriesCommunityController } from "../../controllers/communities/categoriescommunity.controller";
import { communityController } from "../../controllers/communities/community.controller";
import { rolCommunitiesServicesController } from "../../controllers/communities/rolcommunities.controller";
import { scoreCommunityServicesController } from '../../controllers/communities/scorecommunity.controller';
import communityManagerRouter from './communityManager.routes';
import communityManagerTypesRoutes from './communityTypeManager.routes';
import userRequestCommunitiesRoutes from './userRequestCommunities.routes';

const communitiesRoutes: Router = Router();

//categories
communitiesRoutes.post("/getcategorycommunity", categoriesCommunityController.getCategoryByID);
communitiesRoutes.post("/createcategorycommunity", categoriesCommunityController.createCategoryCommunity);
communitiesRoutes.post("/deletecategorycommunity", categoriesCommunityController.deleteCategoryCommunityByID);
communitiesRoutes.post("/updatecategorycommunity", categoriesCommunityController.updateCategoryCommunity);
communitiesRoutes.get("/getallcategorycommunity", categoriesCommunityController.getAllCategoriesEnabled);
communitiesRoutes.post("/search/categories", categoriesCommunityController.searchCategoryEnabled);
communitiesRoutes.post("/get/categoryId", categoriesCommunityController.getCategoryByID);

//communities
communitiesRoutes.post("/getcommunitybyid", communityController.getCommunityByID);
communitiesRoutes.post("/createcommunity", communityController.createCommunity);
communitiesRoutes.post("/getcommunitybyname", communityController.getCommunityByName);
communitiesRoutes.post("/deletecommunity", communityController.deleteCommunityByID);
communitiesRoutes.post("/updatecommunity", communityController.updateCommunity);
communitiesRoutes.post("/get/bycategory", communityController.getCommunitiesByCategoryId);
communitiesRoutes.post("/search/communities", communityController.searchCommunityEnabled);
communitiesRoutes.post("/get/byuserId", communityController.getCommunityByUserID);
communitiesRoutes.post("/get/notUserId", communityController.getCommunityByNotUserID);
communitiesRoutes.post("/get-community-category", communityController.searchCommunityAndCategoryEnabled);
communitiesRoutes.post("/get-info-visitor", communityController.getInformationVisitor);

//roles
communitiesRoutes.post("/getrolcommunity", rolCommunitiesServicesController.getRolCommunityByName);
communitiesRoutes.post("/createrolcommunity", rolCommunitiesServicesController.createRolCommunity);
communitiesRoutes.post("/deleterolcommunity", rolCommunitiesServicesController.deleteRolCommunityByName);
communitiesRoutes.post("/updaterolcommunity", rolCommunitiesServicesController.updateRolCommunity);
communitiesRoutes.post("/assign/rol", rolCommunitiesServicesController.assignRolCommunity);

//score
communitiesRoutes.post("/createscorecommunity", scoreCommunityServicesController.createScoreCommunity);
communitiesRoutes.post("/getscorecommunitybyid", scoreCommunityServicesController.getScoreCommunityByID);
communitiesRoutes.post("/getscorecommunitybyuserid", scoreCommunityServicesController.getScoreCommunityByUserID);
communitiesRoutes.post("/updatescorecommunity", scoreCommunityServicesController.updateScoreCommunity);
communitiesRoutes.post("/deletescorecommunity", scoreCommunityServicesController.deleteScoreCommunityByID);

//
communitiesRoutes.use('/request', userRequestCommunitiesRoutes);
communitiesRoutes.use('/manager', communityManagerRouter);
communitiesRoutes.use('/typeManager', communityManagerTypesRoutes);

export default communitiesRoutes;