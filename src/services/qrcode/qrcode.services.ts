import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../aws/aws.services';
const qrCodeModel = require('../../models/qrcode/qrcode.model')
const qrcode = require('qrcode')

class QRCodeServices {
    public async createQRCode(body:any, files: any){
        try {
            let fileSaved: any, createqr
            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: body.entityID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }

            if (fileSaved) {
                const QR = await qrcode.toDataURL(fileSaved.url)
                if (QR) {
                    const modelQR = new qrCodeModel({
                        entityID: body.entityID,
                        name: body.name,
                        urlImageOrVideos: fileSaved,
                        urlQR: QR
                    })
                    createqr = modelQR.save()
                }
            }
            return createqr
        } catch (error) {
            console.log(error);            
        }
    }

    public async getCodeQR(body:any){
        try {
            const getCodesQr = await qrCodeModel.find({entityID:body.entityID})
            return getCodesQr
        } catch (error) {
            console.log(error);            
        }
    }

    public async deleteCodeQR(body:any){
        try {
            const getCodesQr = await qrCodeModel.findOneAndDelete({_id:body.codeQrId})
            return getCodesQr
        } catch (error) {
            console.log(error);            
        }
    }
}

export const qrCodeServices = new QRCodeServices()