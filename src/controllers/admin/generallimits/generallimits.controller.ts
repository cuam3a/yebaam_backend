import { Request, Response } from "express";
import { generalLimitServices } from "../../../services/Admin/generallimits/generallimits.service";
import { responses } from "../../../controllers/utils/response/response";
import { middlewares } from "../../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../../utils/constants";

class GeneralLimitController {
  public async createGeneralLimit(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const limitToSave = await generalLimitServices.saveGeneralLimit(body);
          if (!limitToSave.code) {
            responses.success(req, res, limitToSave);
          } else {
            responses.error(req, res, limitToSave);
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

  public async updateGeneralLimitByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const limitToUpdate = await generalLimitServices.updateGeneralLimit(
            body
          );
          if (!limitToUpdate.code) {
            responses.success(req, res, limitToUpdate);
          } else {
            responses.error(req, res, limitToUpdate);
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

  public async getLimits(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const limits = await generalLimitServices.getLimits();
          if (!limits.code) {
            responses.success(req, res, limits);
          } else {
            responses.error(req, res, limits);
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

  public async getLimitByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const limit = await generalLimitServices.getByID(body);
          if (!limit.code) {
            responses.success(req, res, limit);
          } else {
            responses.error(req, res, limit);
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

export const generalLimitController = new GeneralLimitController();
