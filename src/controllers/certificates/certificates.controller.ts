import { Request, Response } from "express";
import { certificatesServices } from "../../services/certificates/certificates.services";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class CertificatesContoller {
  public async createCertificate(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const certificateToSave = await certificatesServices.saveCertificateByProfessional(
        body,
        file
      );
      if (!certificateToSave.code) {
        responses.success(req, res, certificateToSave);
      } else {
        responses.error(req, res, certificateToSave);
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

  public async createAuthCertificates(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const authCertificateToSave = await certificatesServices.saveAuthCertificates(
        body,
        file
      );
      if (!authCertificateToSave.code) {
        responses.success(req, res, authCertificateToSave);
      } else {
        responses.error(req, res, authCertificateToSave);
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

  public async updateCertificateById(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const certificateToUpdate = await certificatesServices.updateCertificate(
        body,
        file
      );
      if (!certificateToUpdate.code) {
        responses.success(req, res, certificateToUpdate);
      } else {
        responses.error(req, res, certificateToUpdate);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_UPDATING_RECORD,
        error: error,
      });
    }
  }

  public async changeStateByUser(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      if (body.state == 1) {
        const certificateToUpdate = await certificatesServices.changeStateByUser(
          body
        );
        if (!certificateToUpdate.code) {
          responses.success(req, res, certificateToUpdate);
        } else {
          responses.error(req, res, certificateToUpdate);
        }
      } else {
        responses.error(req, res, ConstantsRS.CANNOT_RUN_ACTION);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_UPDATING_RECORD,
        error: error,
      });
    }
  }

  public async changeStateByAdmin(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          if (body.state == 2 || body.state == 3) {
            const certificateToUpdate = await certificatesServices.changeStateByAdmin(
              body
            );
            if (!certificateToUpdate.code) {
              responses.success(req, res, certificateToUpdate);
            } else {
              responses.error(req, res, certificateToUpdate);
            }
          } else {
            responses.error(req, res, ConstantsRS.CANNOT_RUN_ACTION);
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

  public async deleteCertificateById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const certificateToDelete = await certificatesServices.deleteCertificate(
        body
      );
      if (!certificateToDelete.code) {
        responses.success(req, res, certificateToDelete);
      } else {
        responses.error(req, res, certificateToDelete);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_TO_DELETE_REGISTER,
        error: error,
      });
    }
  }

  public async deleteAuthCertificateById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const certificateToDelete = await certificatesServices.deleteAuthCertificate(
        body
      );
      if (!certificateToDelete.code) {
        responses.success(req, res, certificateToDelete);
      } else {
        responses.error(req, res, certificateToDelete);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_TO_DELETE_REGISTER,
        error: error,
      });
    }
  }

  public async getCertificatesByStateNConcept(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const certificatesWithoutValidating = await certificatesServices.getCertificatesByStateNConcept(
            body
          );
          if (!certificatesWithoutValidating.code) {
            responses.success(req, res, certificatesWithoutValidating);
          } else {
            responses.error(req, res, certificatesWithoutValidating);
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

  public async getAuthCertificateByEntityID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const certificates = await certificatesServices.getAuthCertificateByEntityID(
        body
      );
      if (!certificates.code) {
        responses.success(req, res, certificates);
      } else {
        responses.error(req, res, certificates);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_FETCHING_RECORD,
        error: error,
      });
    }
  }
}

export const certificatesContoller = new CertificatesContoller();
