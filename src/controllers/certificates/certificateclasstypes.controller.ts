import { Request, Response } from "express";
import { certificateClassTypesServices } from "../../services/certificates/certificateclasstypes.service";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class CertificateClassTypesController {
  public async createCertificateClassType(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const body = req.body;
          const saveType = await certificateClassTypesServices.saveCertificateClassType(
            body
          );
          if (!saveType.code) {
            responses.success(req, res, saveType);
          } else {
            responses.error(req, res, saveType);
          }
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_SAVING_RECORD,
        error: error,
      });
    }
  }

  public async updateCertificateClassTypeByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const statusUpdated = await certificateClassTypesServices.updateCertificateClassType(
            body
          );
          if (!statusUpdated.code) {
            responses.success(req, res, statusUpdated);
          } else {
            responses.error(req, res, statusUpdated);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_UPDATING_RECORD,
        error: error,
      });
    }
  }

  public async getCertificateClassTypeByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getType = await certificateClassTypesServices.getByID(body);
          if (!getType.code) {
            responses.success(req, res, getType);
          } else {
            responses.error(req, res, getType);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_FETCHING_RECORD,
        error: error,
      });
    }
  }

  public async deleteCertificateClassTypeByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const deleteType = await certificateClassTypesServices.deleteCertificateClassType(body);
          if (!deleteType.code) {
            responses.success(req, res, deleteType);
          } else {
            responses.error(req, res, deleteType);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_TO_DELETE_REGISTER,
        error: error,
      });
    }
  }

  public async getAllCertificateClassTypes(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const allTypes = await certificateClassTypesServices.getAll();
          if (!allTypes.code) {
            responses.success(req, res, allTypes);
          } else {
            responses.error(req, res, allTypes);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.FAILED_TO_FETCH_RECORDS,
        error: error,
      });
    }
  }
}
export const certificateClassTypeController = new CertificateClassTypesController();
