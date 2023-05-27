import { Request, Response } from 'express';
import { GlobalConstants } from '../../../config/GlobalConstants';
import { ConstantsRS } from '../../../utils/constants';
const seedrandom = require('seedrandom');

class UploadFiles {

    // public async uploadimages(req: any, res: Response) {
    //     try {
    //         if (req.files) {

    //             const file = req.files.files;
    //             console.log(file);

    //             let urlFilesUploadded: any[] = [];

    //             if (file.length) {

    //                 file.map(async (fileObj: any, index: number) => {

    //                     const fileSaved = await uploadImage(fileObj);

    //                     urlFilesUploadded.push(fileSaved)

    //                     if (index == file.length - 1) {
    //                         res.status(200).send({
    //                             error: null,
    //                             success: true,
    //                             data: urlFilesUploadded
    //                         })
    //                     }
    //                 })

    //             } else {

    //                 const fileSaved = await uploadImage(file);

    //                 res.status(200).send({
    //                     error: null,
    //                     success: true,
    //                     data: fileSaved
    //                 })
    //             }

    //         }

    //     } catch (error) {
    //         res.send({
    //             error: { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error.error },
    //             success: false,
    //             data: null
    //         });
    //     }
    // }

    // public async uploadMedia(req: any, res: Response) {
    //     try {
    //         if (req.files) {

    //             const file = req.files.files;

    //             let urlFilesUploadded: any[] = [];

    //             if (file.length) {

    //                 file.map(async (fileObj: any, index: number) => {

    //                     const fileSaved = await uploadMedia(fileObj);

    //                     urlFilesUploadded.push(fileSaved);

    //                     if (index == file.length - 1) {
    //                         res.status(200).send({
    //                             error: null,
    //                             success: true,
    //                             data: urlFilesUploadded
    //                         })
    //                     }
    //                 })

    //             } else {

    //                 const fileSaved = await uploadMedia(file);

    //                 res.status(200).send({
    //                     error: null,
    //                     success: true,
    //                     data: fileSaved
    //                 })
    //             }

    //         }

    //     } catch (error) {
    //         res.send({
    //             error: { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error.error },
    //             success: false,
    //             data: null
    //         });
    //     }
    // }

    // public async uploadDocuments(req: any, res: Response) {
    //     try {
    //         if (req.files) {

    //             const file = req.files.files;

    //             let urlFilesUploadded: any[] = [];

    //             if (file.length) {

    //                 file.map(async (fileObj: any, index: number) => {

    //                     const fileSaved = await uploadDocuments(fileObj);

    //                     urlFilesUploadded.push(fileSaved);

    //                     if (index == file.length - 1) {
    //                         res.status(200).send({
    //                             error: null,
    //                             success: true,
    //                             data: urlFilesUploadded
    //                         })
    //                     }
    //                 })

    //             } else {

    //                 const fileSaved = await uploadDocuments(file);

    //                 res.status(200).send({
    //                     error: null,
    //                     success: true,
    //                     data: fileSaved
    //                 })
    //             }

    //         }

    //     } catch (error) {
    //         res.send({
    //             error: { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error.error },
    //             success: false,
    //             data: null
    //         });
    //     }
    // }

    // public async uploadImages(file: any): Promise<any> {

    //     return new Promise(async (resolve, reject) => {

    //         try {

    //             let urlFilesUploadded: any[] = [];

    //             if (file.length) {

    //                 file.map(async (fileObj: any, index: number) => {

    //                     const fileSaved = await uploadImage(fileObj);

    //                     urlFilesUploadded.push(fileSaved)

    //                     if (index == file.length - 1) {
    //                         resolve(urlFilesUploadded)
    //                     }
    //                 })

    //             } else {

    //                 const fileSaved = await uploadImage(file);
    //                 resolve(fileSaved)
    //             }

    //         } catch (error) {

    //             reject("Error en el server, No es posible guardar el archivo")
    //         }
    //     })

    // }

}

export const uploadFiles = new UploadFiles();