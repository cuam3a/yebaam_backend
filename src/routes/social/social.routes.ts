import { Router } from 'express';
import { socialController } from '../../controllers/social/social.controller';
import { socialProfessionalController } from '../../controllers/social/socialprofessional.controller';

const socialRoutes: Router = Router();

socialRoutes.post('/', socialController.actionsSocials);
socialRoutes.post('/byids', socialController.getSocialConnectionByIDS);
socialRoutes.post('/get-social', socialController.getSocialConnections);
socialRoutes.post('/get-requests', socialController.getFriendRequests);
socialRoutes.post('/social-count', socialController.getSocialConnectionsCount);
socialRoutes.post('/search', socialController.searchFrendsOrFollowers);
socialRoutes.post('/can-i-notify', socialController.canINotify);
socialRoutes.post('/disable-notifications', socialController.disableNotificationsUser);
socialRoutes.post('/get-user-notifications-options', socialController.getUserNotificationsOptions);
//professional
socialRoutes.post('/professional', socialProfessionalController.actionsSocialProfessional);
socialRoutes.post('/professional-byids', socialProfessionalController.getSocialProfessionalConnectionByIDS);
socialRoutes.post('/professional-get-social', socialProfessionalController.getSocialProfessionalConnections);
socialRoutes.post('/professional-get-requests', socialProfessionalController.getContacsRequests);
socialRoutes.post('/professional-social-count', socialProfessionalController.getSocialProfessionalConnectionsCount);
socialRoutes.post('/search-contacts', socialProfessionalController.searchContacts);
socialRoutes.post('/professional-can-i-notify', socialProfessionalController.canINotify);
socialRoutes.post('/professional-disable-notifications', socialProfessionalController.disableNotificationsUser);
socialRoutes.post('/get-professional-notifications-options', socialProfessionalController.getProfessionalNotificationsOptions);


export default socialRoutes;