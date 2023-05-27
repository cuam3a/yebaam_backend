import { Request, Response } from "express";
import { typeOfAwardsServices } from "../../../services/Admin/awards/typeofawards.service";
import { responses } from "../../utils/response/response";
import { middlewares } from "../../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../../utils/constants";

class TypeOfAwardController {
  public async createTypeOfAward(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const typeToSave = await typeOfAwardsServices.saveType(body);
          if (!typeToSave.code) {
            responses.success(req, res, typeToSave);
          } else {
            responses.error(req, res, typeToSave);
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

  public async updateTypeOfAward(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const typeToUpdate = await typeOfAwardsServices.updateTypeByID(body);
          if (!typeToUpdate.code) {
            responses.success(req, res, typeToUpdate);
          } else {
            responses.error(req, res, typeToUpdate);
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

  public async deleteTypeOfAward(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const typeToDelete = await typeOfAwardsServices.deleteTypeByID(body);
          if (!typeToDelete.code) {
            responses.success(req, res, typeToDelete);
          } else {
            responses.error(req, res, typeToDelete);
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

  public async getAllTypes(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const types = await typeOfAwardsServices.getAll();
          if (!types.code) {
            responses.success(req, res, types);
          } else {
            responses.error(req, res, types);
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

  public async getTypeOfReportByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const type = await typeOfAwardsServices.getByID(body.id);
          if (!type.code) {
            responses.success(req, res, type);
          } else {
            responses.error(req, res, type);
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
}

export const typeOfAwardController = new TypeOfAwardController();
