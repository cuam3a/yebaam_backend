import { Request, Response } from "express";
const challengeModel = require("../../models/challenges/Challenges.model");
import { reportingLimitServices } from "../../services/postreports/reportinglimits.services";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class ReportingLimitController {
  public async createReportLimit(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const limitToSave = await reportingLimitServices.saveReportLimit(
        body
      );
      if (!limitToSave.code) {
        responses.success(req, res, limitToSave);
      } else {
        responses.error(req, res, limitToSave);
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

  public async updateReportLimitByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const limitToUpdate = await reportingLimitServices.updateReportLimitByID(
        body
      );
      if (!limitToUpdate.code) {
        responses.success(req, res, limitToUpdate);
      } else {
        responses.error(req, res, limitToUpdate);
      }
      /*  } else {
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

  public async getLimits(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const limits = await reportingLimitServices.getLimits();
      responses.success(req, res, limits);
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async getLimitByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const limit = await reportingLimitServices.getByID(body);
      if (!limit.code) {
        responses.success(req, res, limit);
      } else {
        responses.error(req, res, limit);
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

export const reportingLimitController = new ReportingLimitController();
