import { Request, Response } from 'express';
import { awsServiceS3 } from '../../services/aws/aws.services';
import { responses } from '../../controllers/utils/response/response';

// classes
import { ConstantsRS } from '../../utils/constants';

class AwsController {

    public async getFile(req: Request, res: Response) {
        try {
            awsServiceS3.getObject().then((data: any) => {
                console.log(data, "en controller");

                res.setHeader('Content-disposition', 'attachment; filename=Screenshot_2020-11-24 Selene visualization.png');
                res.setHeader('Content-length', data.ContentLength);
                res.end(data.Body);

            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getURLFile(req: Request, res: Response) {
        try {
            awsServiceS3.getURLFile()
                .then((urlData: any) => {
                    res.status(200).send(urlData);
                })
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async uploadFile(req: any, res: Response) {
        try {
            const file = req.files.files;
            const { entityId } = req.body;

            awsServiceS3.UploadFile({ entityId, file })
                .then((urlData: any) => {
                    res.status(200).send(urlData);
                })
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

}

export const awsController = new AwsController();