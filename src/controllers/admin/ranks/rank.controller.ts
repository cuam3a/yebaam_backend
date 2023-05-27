import { Request, Response } from "express";
import { rankService } from "../../../services/ranks/rank.service";
import { ConstantsRS } from "../../../utils/constants";
import { responses } from "../../utils/response/response";
import { middlewares } from "../../../middlewares/middleware";
import { AnalysisFilterAttribute } from "aws-sdk/clients/quicksight";

class RankController {
  public async createRank(req: any, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */

      const body = req.body;
      const file = req.files
      const rankSaved = await rankService.createRank(body, file);
      if (!rankSaved.code) {
        responses.success(req, res, rankSaved);
      } else {
        responses.error(req, res, rankSaved);
      }
      /* } else {
        responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
      }
    }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async updateRankById(req: any, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const body = req.body;
      const file = req.files;
      const rankUpdated = await rankService.updateRankById(body, file);
      if (!rankUpdated.code) {
        responses.success(req, res, rankUpdated);
      } else {
        responses.error(req, res, rankUpdated);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async deleteRankById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const body = req.body;
      const deleteRank = await rankService.deleteRankById(body);
      if (!deleteRank.code) {
        responses.success(req, res, deleteRank);
      } else {
        responses.error(req, res, deleteRank);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getRankById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const body = req.body;
      const rank = await rankService.getRankById(body);
      if (!rank.code) {
        responses.success(req, res, rank);
      } else {
        responses.error(req, res, rank);
      }
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      console.log("E: ", error)
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async getAllRanks(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const ranks = await rankService.getAllRanks();
      responses.success(req, res, ranks);
      /*   } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  /* public async addPermissionToRank(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id, permissionId } = req.body;
          const rankUpdated = await rankService.addPermissionRankById(
            id,
            permissionId
          );
          responses.success(req, res, rankUpdated);
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
  } */

  /* public async deletePermissionToRank(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id, permissionId } = req.body;
          const rankUpdated = await rankService.deletePermissionRankById(
            id,
            permissionId
          );
          responses.success(req, res, rankUpdated);
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
  } */
}

export const rankcontroller = new RankController();
