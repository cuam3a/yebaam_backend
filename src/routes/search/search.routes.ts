import { Router } from 'express';
import { searchController } from '../../controllers/search/search.controller';

const searchRoutes: Router = Router();

searchRoutes.post('/', searchController.searchGeneral);
searchRoutes.post('/fullsearch', searchController.fullSearch);

export default searchRoutes;