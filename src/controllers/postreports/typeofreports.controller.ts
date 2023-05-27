import { Request, Response } from "express";
const typeOfReportModel = require("../../models/postsreports/TypeOfReports.model");
import { typeOfReportServices } from "../../services/postreports/typeofreports.services";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class TypeOfReportController {
  public async createTypeOfReport(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeToSave = await typeOfReportServices.saveType(body);
          if (!typeToSave.code) {
            responses.success(req, res, typeToSave);
          } else {
            responses.error(req, res, typeToSave);
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

  public async updateTypeOfReport(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeToUpdate = await typeOfReportServices.updateTypeByID(body);
          if (!typeToUpdate.code) {
            responses.success(req, res, typeToUpdate);
          } else {
            responses.error(req, res, typeToUpdate);
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

  public async deleteTypeOfReport(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeToDelete = await typeOfReportServices.deleteTypeByID(body);
          if (!typeToDelete.code) {
            responses.success(req, res, typeToDelete);
          } else {
            responses.error(req, res, typeToDelete);
          }
       /*  } else {
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

  public async getAllTypes(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const types = await typeOfReportServices.getAll();
          if (!types.code) {
            responses.success(req, res, types);
          } else {
            responses.error(req, res, types);
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

  public async getTypeOfReportByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const type = await typeOfReportServices.getByID(body.id);
          if (!type.code) {
            responses.success(req, res, type);
          } else {
            responses.error(req, res, type);
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
export const typeOfReportController = new TypeOfReportController();
