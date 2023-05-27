import { Request, Response } from "express";
import { systemActionServices } from "../../services/systemactions/systemactions.services";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class SystemActionController {
  public async createSystemAction(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const systemActionSaved = await systemActionServices.saveSystemAction(
        body
      );
      if (!systemActionSaved.code) {
        responses.success(req, res, systemActionSaved);
      } else {
        responses.error(req, res, systemActionSaved);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async updateSystemActionByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const systemActionUpdated = await systemActionServices.updateSystemAction(
        body
      );
      if (!systemActionUpdated.code) {
        responses.success(req, res, systemActionUpdated);
      } else {
        responses.error(req, res, systemActionUpdated);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async deleteSystemActionByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const systemActionDeleted = await systemActionServices.deleteSystemAction(
        body
      );
      if (!systemActionDeleted.code) {
        responses.success(req, res, systemActionDeleted);
      } else {
        responses.error(req, res, systemActionDeleted);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getSystemActionsByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const systemActionByID = await systemActionServices.getById(body);
      if (!systemActionByID.code) {
        responses.success(req, res, systemActionByID);
      } else {
        responses.error(req, res, systemActionByID);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getAllSystemActions(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const systemActions = await systemActionServices.getAll();
      if (!systemActions.code) {
        responses.success(req, res, systemActions);
      } else {
        responses.error(req, res, systemActions);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }
}
export const systemActionController = new SystemActionController();
