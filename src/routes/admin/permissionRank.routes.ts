import { Router } from 'express';
import { permissionRankController } from '../../controllers/admin/permissionsRank/permissionRanks.controller';
const permissionRankRoutes: Router = Router();

permissionRankRoutes.post('/create', permissionRankController.createPermissionRank )
permissionRankRoutes.post('/update/id', permissionRankController.updatePermissionRankById )
permissionRankRoutes.post('/delete/id', permissionRankController.deletePermissionRankById )
permissionRankRoutes.post('/get/id', permissionRankController.getPermissionRankById )
permissionRankRoutes.get('/get', permissionRankController.getAllPermissionRank )

export default permissionRankRoutes;
