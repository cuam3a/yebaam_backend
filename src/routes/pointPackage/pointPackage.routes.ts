import { Router } from 'express';
import { pointPackageController } from '../../controllers/admin/pointPackages/pointPackages.controller';
const pointPackageRoutes: Router = Router();

pointPackageRoutes.post('/create', pointPackageController.createPointPackage);
pointPackageRoutes.post('/update', pointPackageController.updatePointPackage);
pointPackageRoutes.get('/getall', pointPackageController.getAllPointPackage);
pointPackageRoutes.get('/getall-deactivate', pointPackageController.getAllPointPackageDeactivate);
pointPackageRoutes.post('/get-id', pointPackageController.getPointPackageById);
pointPackageRoutes.post('/deactivate-id', pointPackageController.DeactivatePointPackage);
pointPackageRoutes.post('/delete-id', pointPackageController.DeletePointPackage);

export default pointPackageRoutes;