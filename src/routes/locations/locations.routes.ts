import { Router } from 'express';
import { countriesController } from "../../controllers/locations/countries.controller";
import { statesController } from "../../controllers/locations/states.controller";
import { citiesController } from "../../controllers/locations/cities.controller";

const locationsRoutes: Router = Router();

locationsRoutes.post('/create-country', countriesController.createCountry);
locationsRoutes.post('/get-countries', countriesController.getAllCountries);

locationsRoutes.post('/create-state', statesController.createState);
locationsRoutes.post('/get-states', statesController.getStatesByCountryID);

locationsRoutes.post('/create-city', citiesController.createCity);
locationsRoutes.post('/get-cities', citiesController.getCitiesByStateID);

export default locationsRoutes;