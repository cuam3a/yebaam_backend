import { Request, Response } from "express";
import { pqrsAdminService } from "../../services/pqrs/pqrsadmin.service";
import { responses } from "../utils/response/response";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from "../../middlewares/middleware";

class PqrsadminController {
  public async responsePQRS(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const pqrs = await pqrsAdminService.responsePQRS(body);

          if (!pqrs.code) {
            responses.success(req, res, pqrs);
          } else {
            responses.error(req, res, pqrs);
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

  public async getPqrs(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const pqrs = await pqrsAdminService.getAll();
          responses.success(req, res, pqrs);
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

  public async getPqrsByType(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const pqrs = await pqrsAdminService.getByType(body);
          responses.success(req, res, pqrs);
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

  public async disablePqrs(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const pqrs = await pqrsAdminService.disablePQRS(body);

          if (!pqrs.code) {
            responses.success(req, res, pqrs);
          } else {
            responses.error(req, res, pqrs);
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
}

export const pqrsController = new PqrsadminController();
