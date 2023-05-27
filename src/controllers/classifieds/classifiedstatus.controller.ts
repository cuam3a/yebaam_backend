import { Request, Response } from "express";
import { classifiedStatusServices } from "../../services/classifieds/classifiedstatus.services";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class ClassifiedStatusController {
  public async createClassifiedStatus(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const saveStatus = await classifiedStatusServices.createClassifiedStatus(
            body
          );
          if (!saveStatus.code) {
            responses.success(req, res, saveStatus);
          } else {
            responses.error(req, res, saveStatus);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_SAVING_RECORD,
        error: error,
      });
    }
  }

  public async getClassifiedStatusByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const getStatus = await classifiedStatusServices.getClassifiedStatusByID(
            body.id
          );
          if (!getStatus.code) {
            responses.success(req, res, getStatus);
          } else {
            responses.error(req, res, getStatus);
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

  public async updateStatusClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const statusUpdated = await classifiedStatusServices.updateClassifiedStatus(
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

  public async deleteClassifiedStatusById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const statusDeleted = await classifiedStatusServices.deleteClassifiedStatusByID(
            body
          );
          if (!statusDeleted.code) {
            responses.success(req, res, statusDeleted);
          } else {
            responses.error(req, res, statusDeleted);
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

  public async getAllClassifiedStatus(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const status = await classifiedStatusServices.getAll();
          if (!status.code) {
            responses.success(req, res, status);
          } else {
            responses.error(req, res, status);
          }
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.FAILED_TO_FETCH_RECORDS,
        error: error,
      });
    }
  }
}
export const classifiedStatusController = new ClassifiedStatusController();
