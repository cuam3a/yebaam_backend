import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../../services/aws/aws.services';
import { responses } from '../utils/response/response'

class UserUploadFiles {

    public async uploadimages(req: any, res: Response) {
        try {
            if (req.files) {
                const file = req.files.files;
                const { entityId } = req.body;

                let urlFilesUploadded: any[] = [];

                if (file.length) {

                    let filesUplaoded = 0;
                    file.map(async (fileOne: any, index: number) => {

                        if (fileOne.mimetype.indexOf('image') >= 0) {

                            const dataToSave = { entityId, file: fileOne };
                            const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                            urlFilesUploadded.push(fileSaved);
                            filesUplaoded += 1;
                        }
                        else {
                            const message = {
                                file: fileOne.mimetype,
                                message: ConstantsRS.INCORRECT_FILE_IMG
                            }
                            urlFilesUploadded.push(message);
                            filesUplaoded += 1;
                        }

                        if (filesUplaoded == file.length) {
                            responses.success(req, res, urlFilesUploadded);
                        }

                    })

                } else {

                    if (file.mimetype.indexOf('image') >= 0) {

                        const dataToSave = { entityId, file };

                        const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                        responses.success(req, res, fileSaved);

                    } else {
                        responses.error(req, res, ConstantsRS.INCORRECT_FILE_IMG);
                    }
                }
            }

        } catch (error) {
            const err = { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error };
            responses.error(req, res, err);
        }
    }

    public async uploadMedia(req: any, res: Response) {
        try {
            if (req.files) {                
                const file = req.files.files;
                const { entityId } = req.body;

                let urlFilesUploadded: any[] = [];

                if (file.length) {

                    let filesUplaoded = 0;

                    for await (let fileOne of file) {
                        if (fileOne.mimetype.indexOf('image') >= 0 || fileOne.mimetype.indexOf('video') >= 0 || fileOne.mimetype.indexOf('audio') >= 0) {
                            const dataToSave = { entityId, file: fileOne };
                            const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                            urlFilesUploadded.push(fileSaved);
                            
                            filesUplaoded += 1;

                        } else {
                            const message = {
                                file: fileOne.mimetype,
                                message: ConstantsRS.INCORRECT_FILE_FORMAT
                            }
                            urlFilesUploadded.push(message);
                            filesUplaoded += 1;
                        }

                        if (filesUplaoded == file.length) {
                            responses.success(req, res, urlFilesUploadded);
                        }
                    }
                } else {

                    if (file.mimetype.indexOf('image') >= 0 || file.mimetype.indexOf('video') >= 0 || file.mimetype.indexOf('audio') >= 0) {
                        const dataToSave = { entityId, file};
                        const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                        responses.success(req, res, fileSaved);

                    } else {
                        responses.error(req, res, ConstantsRS.INCORRECT_FILE_FORMAT);
                    }
                }

            }

        } catch (error) {

            const err = { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error };
            responses.error(req, res, err);
        }
    }

    public async uploadDocuments(req: any, res: Response) {
        try {
            if (req.files) {

                const file = req.files.files;
                const { entityId } = req.body;

                let urlFilesUploadded: any[] = [];

                if (file.length) {

                    let filesUplaoded = 0;

                    file.map(async (fileOne: any) => {

                        if (fileOne.mimetype.indexOf('application/pdf') >= 0 || fileOne.mimetype.indexOf('image') >= 0 || fileOne.mimetype.indexOf('video') >= 0 || fileOne.mimetype.indexOf('audio') >= 0) {

                            const dataToSave = { entityId, file: fileOne };
                            const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                            urlFilesUploadded.push(fileSaved);
                            filesUplaoded += 1;

                        } else {
                            const message = {
                                file: fileOne.mimetype,
                                message: ConstantsRS.INCORRECT_FILE_FORMAT
                            }
                            urlFilesUploadded.push(message);
                            filesUplaoded += 1;
                        }

                        if (filesUplaoded == file.length) {
                            responses.success(req, res, urlFilesUploadded);
                        }
                    })

                } else {

                    if (file.mimetype.indexOf('application/pdf') >= 0 || file.mimetype.indexOf('image') >= 0 || file.mimetype.indexOf('video') >= 0 || file.mimetype.indexOf('audio') >= 0) {

                        const dataToSave = { entityId, file };
                        const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                        responses.success(req, res, fileSaved);

                    } else {
                        responses.error(req, res, ConstantsRS.INCORRECT_FILE_FORMAT);
                    }
                }

            }

        } catch (error) {

            const err = { ...ConstantsRS.ERROR_UPLOAD_FILE, error: error };
            responses.error(req, res, err);

        }
    }

    public async getFilesByUserId(req: any, res: Response) {

        const { entityId } = req.body;

        awsServiceS3.getFilesByUserId(entityId)
            .then(files => responses.success(req, res, files))
            .catch(error => responses.error(req, res, error))
    }

    public async deleteImageByUrl(req: Request, res: Response) {

        const dataToRemove = {
            entityId: req.body.entityId,
            url: req.body.url
        }

        awsServiceS3.DeleteFileByUrl(dataToRemove)
            .then(fileToDelete => responses.success(req, res, fileToDelete))
            .catch(error => responses.error(req, res, error))
    }

}

export const userUploadFiles = new UserUploadFiles();
