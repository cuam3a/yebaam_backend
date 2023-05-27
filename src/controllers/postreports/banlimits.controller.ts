import { Request, Response } from "express";
import { banLimitServices } from "../../services/postreports/banLimits.services";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class BanLimitController {
  public async createBanLimit(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const limitToSave = await banLimitServices.saveBanLimit(body);
          if (!limitToSave.code) {
            responses.success(req, res, limitToSave);
          } else {
            responses.error(req, res, limitToSave);
          }
       /*  } else {
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

  public async updateBanLimitByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

     /*  await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const limitToUpdate = await banLimitServices.updateBanLimitByID(body);
          if (!limitToUpdate.code) {
            responses.success(req, res, limitToUpdate);
          } else {
            responses.error(req, res, limitToUpdate);
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

  public async deleteBanLimitByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const banLimitToDelete = await banLimitServices.deleteBanLimit(body);
          if (!banLimitToDelete.code) {
            responses.success(req, res, banLimitToDelete);
          } else {
            responses.error(req, res, banLimitToDelete);
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

  public async getActualLimit(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const limit = await banLimitServices.getLimit();
          if (!limit.code) {
            responses.success(req, res, limit);
          } else {
            responses.error(req, res, limit);
          }
       /*  } else {
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

  public async getBanLimitByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const systemActionByID = await banLimitServices.getLimitById(body);
          if (!systemActionByID.code) {
            responses.success(req, res, systemActionByID);
          } else {
            responses.error(req, res, systemActionByID);
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

  public async getAllBanLimits(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const systemActions = await banLimitServices.getAllLimits();
          if (!systemActions.code) {
            responses.success(req, res, systemActions);
          } else {
            responses.error(req, res, systemActions);
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

export const banLimitController = new BanLimitController();
