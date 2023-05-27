import { Router } from 'express';
import { adminController } from "../../controllers/admin/usersManagement/admin.controller";
import { adminRolesController } from "../../controllers/admin/usersManagement/admin.roles.controller";
import { adminPermissionsController } from "../../controllers/admin/usersManagement/admin.permission.controller";
import permissionRankRoutes from './permissionRank.routes';

const adminRoutes: Router = Router();

//#region adminUsers
adminRoutes.post('/create-user-admin', adminController.createAdminUser);
adminRoutes.post('/get-user-admin-name', adminController.getAdminUserByName);
adminRoutes.post('/get-user-admin-id', adminController.getAdminUserById);
adminRoutes.post('/get-all-user-admin', adminController.getAllAdminUsers);
adminRoutes.post('/get-user-admin-role', adminController.getAdminUsersByRole);
adminRoutes.post('/get-user-admin-code', adminController.getAdminUsersByCodeOfRole);
adminRoutes.post('/update-user-admin', adminController.updateAdminUser);
adminRoutes.post('/delete-user-admin', adminController.deleteAdminUser);
adminRoutes.post('/search-user-admin', adminController.searchAdminUsers);
//#endregion
//#region adminRole
adminRoutes.post('/create-role-admin', adminRolesController.createRole);
adminRoutes.post('/get-role-admin-name', adminRolesController.geRoleByName);
adminRoutes.post('/get-role-admin-id', adminRolesController.getRoleById);
adminRoutes.post('/get-all-role-admin', adminRolesController.getAllRoles);
adminRoutes.post('/update-role-admin', adminRolesController.updateRole);
adminRoutes.post('/delete-role-admin', adminRolesController.deleteRole);
adminRoutes.post('/search-role-admin', adminRolesController.searchRoles);
//#endregion
//#region adminPermission
adminRoutes.post('/create-permission-admin', adminPermissionsController.createPermission);
adminRoutes.post('/get-permission-admin-name', adminPermissionsController.getPermissionByName);
adminRoutes.post('/get-permission-admin-id', adminPermissionsController.getPermissionById);
adminRoutes.post('/get-all-permission-admin', adminPermissionsController.getAllPermission);
adminRoutes.post('/update-permission-admin', adminPermissionsController.updatePermission);
adminRoutes.post('/delete-permission-admin', adminPermissionsController.deletePermission);
adminRoutes.post('/search-permission-admin', adminPermissionsController.searchPermission);
//#endregion

// permission ranks routes
adminRoutes.use('/permissions/ranks', permissionRankRoutes);

export default adminRoutes;