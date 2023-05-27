import { Request, Response } from "express";
const certificateClassModel = require("../../models/certificates/ClassOfCertificates.model");
const {
  certificateClassesServices,
} = require("../../services/certificates/certificateclasses.services");
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class ClassOfCertificatesContoller {
  public async createCertificateClass(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const certificateClassToSave = await certificateClassesServices.saveCertificateClass(body);
          if (!certificateClassToSave.code) {
            responses.success(req, res, certificateClassToSave);
          } else {
            responses.error(req, res, certificateClassToSave);
          }
      /*   } else {
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

  public async updateCertificateClassById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificateClassToUpdate = await certificateClassesServices.updateCertificateClass(
            body
          );
          if (!certificateClassToUpdate.code) {
            responses.success(req, res, certificateClassToUpdate);
          } else {
            responses.error(req, res, certificateClassToUpdate);
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

  public async deleteCertificateClassById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificateClassToDelete = await certificateClassesServices.deleteCertificateClass(
            body
          );
          if (!certificateClassToDelete.code) {
            responses.success(req, res, certificateClassToDelete);
          } else {
            responses.error(req, res, certificateClassToDelete);
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

  public async getAllCertificateClasses(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificatesClass = await certificateClassModel.find({});
          if (certificatesClass) {
            responses.success(req, res, certificatesClass);
          } else {
            responses.error(req, res, ConstantsRS.NO_RECORDS);
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

  public async getCertificateClassesByConcept(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificateClasses = await certificateClassesServices.certificateClassesByConcept(
            body
          );
          if (!certificateClasses.code) {
            responses.success(req, res, certificateClasses);
          } else {
            responses.error(req, res, certificateClasses);
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

  public async getCertificateClassById(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificateClass = await certificateClassModel.findOne({
            _id: body.id,
          });
          if (certificateClass) {
            responses.success(req, res, certificateClass);
          } else {
            responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
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

export const classOfCertificatesContoller = new ClassOfCertificatesContoller();
