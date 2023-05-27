import { Router } from 'express';
import { landingsController } from '../../controllers/landings/landings.controller';
import { dataOfLandingsController } from '../../controllers/landings/dataOfLandings.controller';
const landingsRoutes: Router = Router();

//Landings
landingsRoutes.post('/create', landingsController.createLanding);
landingsRoutes.post('/get-all-landings', landingsController.getAllLandings);
landingsRoutes.post('/get-all-landings-movil', landingsController.getAllLandingsMovil);
landingsRoutes.post('/get-landing-id', landingsController.getLandingByID);
landingsRoutes.post('/get-landing-name', landingsController.getLandingByName);
landingsRoutes.post('/get-landing-default', landingsController.getLandingDefault);
landingsRoutes.post('/update-landing', landingsController.updateLanding);
landingsRoutes.post('/delete-landing', landingsController.deleteLanding);
landingsRoutes.post('/remove-landing', landingsController.deleteLandingAdmin);

//DataLandings
landingsRoutes.post('/use-landing', dataOfLandingsController.useLanding);
landingsRoutes.post('/get-datalanding-id', dataOfLandingsController.getDataLandingByID);
landingsRoutes.post('/change-use-dataLanding', dataOfLandingsController.updateDataLandingUse);
landingsRoutes.post('/assig-me-landing', dataOfLandingsController.assignMeDataOfLandingsFree);
landingsRoutes.post('/update-datalanding', dataOfLandingsController.updateDataOfLandings);
landingsRoutes.post('/get-datalandings-trademark', dataOfLandingsController.getDataLandingsByTrademarkID);
landingsRoutes.post('/get-trademarkid-and-landingid', dataOfLandingsController.getDataLandingByIDS);
landingsRoutes.post('/delete-datalanding', dataOfLandingsController.deleteMyDataLanding);
landingsRoutes.post('/remove-datalanding', dataOfLandingsController.removeMyDataLanding);
landingsRoutes.post('/get-all-landings-brand', dataOfLandingsController.getAllLandingsMovil);

export default landingsRoutes;