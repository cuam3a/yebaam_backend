import { Router } from 'express';
import { professionalCommunitiesController } from '../../controllers/communitiesprofessional/professionalcommunities.controller';
import { categoriesOfCommunitiesProfessionalController } from '../../controllers/communitiesprofessional/categoriesofcommunitiesprofessional.controller';
import professionalcommunityusersRouter from './professionalcommunityusers.routes';
import userrolesinthecommunityRoutes from './userrolesinthecommunity.routes';
import requeststothecommunityRoutes from './requeststothecommunity.routes';

const professionalCommunitiesRoutes: Router = Router();

//categories
professionalCommunitiesRoutes.post("/getcategorycommunity", categoriesOfCommunitiesProfessionalController.getCategoryByID);
professionalCommunitiesRoutes.post("/createcategorycommunity", categoriesOfCommunitiesProfessionalController.createCategoryCommunity);
professionalCommunitiesRoutes.post("/deletecategorycommunity", categoriesOfCommunitiesProfessionalController.deleteCategoryCommunityByID);
professionalCommunitiesRoutes.post("/updatecategorycommunity", categoriesOfCommunitiesProfessionalController.updateCategoryCommunity);
professionalCommunitiesRoutes.get("/getallcategorycommunity", categoriesOfCommunitiesProfessionalController.getAllCategoriesEnabled);
professionalCommunitiesRoutes.post("/search/categories", categoriesOfCommunitiesProfessionalController.searchCategoryEnabled);
professionalCommunitiesRoutes.post("/get/categoryId", categoriesOfCommunitiesProfessionalController.getCategoryByID);

//communities
professionalCommunitiesRoutes.post("/getcommunitybyid", professionalCommunitiesController.getCommunityByID);
professionalCommunitiesRoutes.post("/createcommunity", professionalCommunitiesController.createCommunity);
professionalCommunitiesRoutes.post("/getcommunitybyname", professionalCommunitiesController.getCommunityByName);
professionalCommunitiesRoutes.post("/deletecommunity", professionalCommunitiesController.deleteCommunityByID);
professionalCommunitiesRoutes.post("/updatecommunity", professionalCommunitiesController.updateCommunity);
professionalCommunitiesRoutes.post("/get/bycategory", professionalCommunitiesController.getCommunitiesByCategoryId);
professionalCommunitiesRoutes.post("/search/communities", professionalCommunitiesController.searchCommunityEnabled);
professionalCommunitiesRoutes.post("/get/byprofessionalId", professionalCommunitiesController.getCommunityByProfessionalId);
professionalCommunitiesRoutes.post("/get/notProfessionalId", professionalCommunitiesController.getCommunityByNotProfessionalId);
professionalCommunitiesRoutes.post("/get-community-category", professionalCommunitiesController.searchCommunityAndCategoryEnabled);
professionalCommunitiesRoutes.post("/get-info-visitor", professionalCommunitiesController.getInformationVisitor);

//
professionalCommunitiesRoutes.use('/request', requeststothecommunityRoutes);
professionalCommunitiesRoutes.use('/professionals', professionalcommunityusersRouter);
professionalCommunitiesRoutes.use('/roles', userrolesinthecommunityRoutes);

export default professionalCommunitiesRoutes;