import { GlobalConstants } from "../../config/GlobalConstants";
import { ConstantsRS } from "../../utils/constants";

const aws = require('aws-sdk');
const fs = require('fs');
const seedrandom = require('seedrandom');
const userFileModel = require('../../models/users-files/userFile.model');

class AwsServiceS3 {

    private s3: any;

    constructor() {
        this.s3 = new aws.S3({
            accessKeyId: GlobalConstants.Access_Key_ID_AWS,
            secretAccessKey: GlobalConstants.Secret_Access_Key_AWS,
            signatureVersion: 'v4',
            region: 'us-east-2'
        });

    }


    public async UploadFile(dataFile: { entityId: string, file: any }) {

        return new Promise((resolve, reject) => {

            let rng = new seedrandom();
            const code = (rng()).toString().substring(3, 10);

            const bucketObject = {
                Bucket: GlobalConstants.BUCKET_NAME,
                Key: code + dataFile.file.name,
                ACL: 'public-read',
                ContentType: dataFile.file.mimetype,
                Body: dataFile.file.data
            };

            this.s3.upload(bucketObject, async (err: any, data: any) => {
                if (err) {
                    console.log("keys Error", GlobalConstants.Access_Key_ID_AWS, GlobalConstants.Secret_Access_Key_AWS, err);
                    reject(err);
                }

                // save data on db
                let objectFileToSave = {
                    entityId: dataFile.entityId,
                    nameFile: data.key,
                    nameInLanding: dataFile.file.name,
                    type: dataFile.file.mimetype,
                    url: data.Location,
                    Bucket: data.Bucket
                }

                const dataFileToSaved = new userFileModel(objectFileToSave);
                const dataFileSaved = await dataFileToSaved.save();

                resolve(dataFileSaved);
            })
            // upload return
            //{
            //   Location: 'https://todotspotfiles.s3.us-east-2.amazonaws.com/Tom+Odell+-+Another+Love.mp3',
            //   Bucket: 'todotspotfiles',
            //   Key: 'Tom Odell - Another Love.mp3',
            //   ETag: '"4dea3521db4a43ff72f2b895c6d12136-2"'
            // }
        })
    }

    public async UploadFileVideo(dataFile: { entityId: string, file: any }) {

        return new Promise((resolve, reject) => {

            let rng = new seedrandom();
            const code = (rng()).toString().substring(3, 10);

            const bucketObject = {
                Bucket: "todotspotfiles",
                Key: code + dataFile.file.name,
                ACL: 'public-read',
                Body: dataFile.file.data
            };

            this.s3.upload(bucketObject, async (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                // save data on db
                const objectFileToSave = {
                    entityId: dataFile.entityId,
                    nameFile: data.key,
                    nameInLanding: dataFile.file.name,
                    type: dataFile.file.mimetype,
                    url: data.Location,
                    Bucket: data.Bucket
                }

                const dataFileToSaved = new userFileModel(objectFileToSave);
                const dataFileSaved = await dataFileToSaved.save();

                resolve(dataFileSaved);
            })
            // upload return
            //{
            //   Location: 'https://todotspotfiles.s3.us-east-2.amazonaws.com/Tom+Odell+-+Another+Love.mp3',
            //   Bucket: 'todotspotfiles',
            //   Key: 'Tom Odell - Another Love.mp3',
            //   ETag: '"4dea3521db4a43ff72f2b895c6d12136-2"'
            // }
        })
    }

    public async DeleteFileByUrl(dataFile: { entityId: string, url: string }) {

        return new Promise(async (resolve, reject) => {
            const fileToRemove = await userFileModel.findOne({ entityId: dataFile.entityId, url: dataFile.url });

            // resolve(fileToRemove);

            if (fileToRemove) {

                const params = {
                    Bucket: fileToRemove.Bucket,
                    Key: fileToRemove.nameFile
                };

                this.s3.deleteObject(params, async (err: any, data: any) => {

                    if (err) {
                        reject(err);
                    }

                    // delete mongo document
                    await userFileModel.deleteOne({ _id: fileToRemove._id });
                    resolve({ data, message: `file ${fileToRemove.nameFile} was remove` });
                });

            } else {
                reject(ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
        })

    }

    public async getBuckets() {

        this.s3.listBuckets({}, (err: any, data: any) => {
            if (err) {
                console.log(err);
                return
            }
            console.log("success", data);
        })
    }

    public async getListObject() {

        const bucketName = {
            Bucket: "todotspotfiles"
        }

        this.s3.listObjectsV2(bucketName, (err: any, data: any) => {
            if (err) {
                console.log(err);
                return
            }
            console.log("success", data);
        })
    }

    public async getObject() {

        return new Promise((resolve, reject) => {

            const bucketObject = {
                Bucket: "todotspotfiles",
                Key: "Screenshot_2020-11-24 Selene visualization.png"
            }

            this.s3.getObject(bucketObject, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    reject()
                }
                console.log("success", data);
                resolve(data);
            })
        })

    }

    public async UploadObject() {

        fs.readFile(`${__dirname + '/../../storage/img/Tom Odell - Another Love.mp3'}`, (err: any, data: any) => {

            const bucketObject = {
                Bucket: "todotspotfiles",
                Key: "Tom Odell - Another Love.mp3",
                ACL: 'public-read',
                Body: data
            }

            // this.s3.putObject(bucketObject, (err: any, data: any) => {
            //     if (err) {
            //         console.log(err);
            //         return
            //     }
            //     console.log("success", data);
            //     console.log("location ...", data.Location);
            // })
            this.s3.upload(bucketObject, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("success", data);
                console.log("location ...", data.Location);
            })
            // upload return 
            //{
            //   Location: 'https://server-socialtic.s3.us-east-2.amazonaws.com/Tom+Odell+-+Another+Love.mp3',
            //   Bucket: 'server-socialtic',
            //   Key: 'Tom Odell - Another Love.mp3',
            //   ETag: '"4dea3521db4a43ff72f2b895c6d12136-2"'
            // }
        })

    }

    public async getURLFile() {

        return new Promise((resolve, reject) => {

            const bucketObject = {
                Bucket: "todotspotfiles",
                Key: "videoexample",
                Expires: 100,
                ContentType: "audio/mp3"
            }

            this.s3.getSignedUrl('putObject', bucketObject, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    reject()
                }
                console.log("success", data);
                resolve(data)
            })

        });
    }

    public async getFilesByUserId(entityId: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const files = await userFileModel.find({ entityId })
                resolve(files);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export const awsServiceS3 = new AwsServiceS3();