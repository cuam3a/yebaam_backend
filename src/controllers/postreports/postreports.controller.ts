import { Request, Response } from "express";
import { ConstantsRS } from "../../utils/constants";
import { postReportServices } from "../../services/postreports/postreports.services";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class PostReportController {
  public async createPostReport(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const postReportToManage = await postReportServices.savePostReport(body);
      if (!postReportToManage.code) {
        responses.success(req, res, postReportToManage);
      } else {
        responses.error(req, res, postReportToManage);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async deletePostReportById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const postReportToDelete = await postReportServices.deleteReportById(body);
      if (!postReportToDelete.code) {
        responses.success(req, res, postReportToDelete);
      } else {
        responses.error(req, res, postReportToDelete);
      }
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async deletePostReportByPostId(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const postReportToDelete = await postReportServices.deleteReportByPostId(body);
      if (!postReportToDelete.code) {
        responses.success(req, res, postReportToDelete);
      } else {
        responses.error(req, res, postReportToDelete);
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getReportsByState(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const reports = await postReportServices.getByState(body.reportState);
          if (!reports.code) {
            responses.success(req, res, reports);
          } else {
            responses.error(req, res, reports);
          }
       /*  } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error, });
    }
  }

  public async getReportsByUserID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const reports = await postReportServices.getByUser(body.entityID);
      if (!reports.code) {
        responses.success(req, res, reports);
      } else {
        responses.error(req, res, reports);
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async changeReportStateByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const reportState = await postReportServices.changeReportState(body);
          if (!reportState.code) {
            responses.success(req, res, reportState);
          } else {
            responses.error(req, res, reportState);
          }
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async changeReportStateForUserByID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const reportState = await postReportServices.changeReportStateForUser(
        body
      );
      if (!reportState.code) {
        responses.success(req, res, reportState);
      } else {
        responses.error(req, res, reportState);
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async getReportsByUserReportedID(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const reports = await postReportServices.getByUserReported(body.entityID);
      if (!reports.code) {
        responses.success(req, res, reports);
      } else {
        responses.error(req, res, reports);
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }
}

export const postReportController = new PostReportController();
