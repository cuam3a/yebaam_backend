import { Router } from 'express';
import { vendorBlockingController } from "../../controllers/vendorblocking/vendorblocking.controller";

const vendorBlockingRoutes: Router = Router();

vendorBlockingRoutes.post('/block-cancel', vendorBlockingController.createOrDeleteVendorBlocking);
vendorBlockingRoutes.post('/blocker-id', vendorBlockingController.getVendorBlocksByBlockerID);
vendorBlockingRoutes.post('/delete-id', vendorBlockingController.deleteVendorBlockingByID);

export default vendorBlockingRoutes;