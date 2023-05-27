import { Router } from 'express';
import { storiesController } from '../../controllers/stories/stories.controller';

const storiesRoutes: Router = Router();

storiesRoutes.post('/id', storiesController.getStoryByID);
storiesRoutes.post('/createstories', storiesController.createStories);
storiesRoutes.post('/deletestory', storiesController.deleteStories);
storiesRoutes.post('/storieshome', storiesController.getHomeStoriesByEntityId);
storiesRoutes.post('/setview', storiesController.setViewToStory);
storiesRoutes.post('/to-archive', storiesController.toArchiveStory);
storiesRoutes.post('/archived', storiesController.getAarchivedStoriesByEntityId);

export default storiesRoutes;