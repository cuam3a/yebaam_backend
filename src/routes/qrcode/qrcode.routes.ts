import { Router } from 'express';
import { qrCodeController } from '../../controllers/qrcode/qrcode.controller';

const qrcodeRouter: Router = Router()

qrcodeRouter.post('/create-qr',qrCodeController.createQRCode)
qrcodeRouter.post('/get-qrs',qrCodeController.getCodeQR)
qrcodeRouter.post('/delete-qr',qrCodeController.deleteCodeQR)

export default qrcodeRouter