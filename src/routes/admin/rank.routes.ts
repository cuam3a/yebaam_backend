import { Router } from 'express';
import { rankcontroller } from '../../controllers/admin/ranks/rank.controller';

const rankRoutes: Router = Router();
rankRoutes.get('/', rankcontroller.getAllRanks);
rankRoutes.post('/create', rankcontroller.createRank);
rankRoutes.post('/update-id', rankcontroller.updateRankById);
rankRoutes.post('/delete-id', rankcontroller.deleteRankById);
rankRoutes.post('/id', rankcontroller.getRankById);
// rankRoutes.post('/add/permission', rankcontroller.addPermissionToRank);
// rankRoutes.post('/delete/permission', rankcontroller.deletePermissionToRank);

export default rankRoutes;