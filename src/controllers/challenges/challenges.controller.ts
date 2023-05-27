import { Request, Response } from "express";
const challengeModel = require("../../models/challenges/Challenges.model");
import { challengeServices } from "../../services/challenges/challenges.services";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

// classes
import { ConstantsRS } from "../../utils/constants";

class ChallengesController {
  public async createChallenge(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const challengeToSave = await challengeServices.saveChallenge(body);
          if (!challengeToSave.code) {
            responses.success(req, res, challengeToSave);
          } else {
            responses.error(req, res, challengeToSave);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async updateChallengeByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const challengeToUpdate = await challengeServices.updateChallenge(
            body
          );
          if (!challengeToUpdate.code) {
            responses.success(req, res, challengeToUpdate);
          } else {
            responses.error(req, res, challengeToUpdate);
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

  public async deleteChallengeByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const challengeToDelete = await challengeServices.deleteChallenge(
            body
          );
          if (!challengeToDelete.code) {
            responses.success(req, res, challengeToDelete);
          } else {
            responses.error(req, res, challengeToDelete);
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

  public async getChallengeByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const challengeById = await challengeModel.findById(body.id);
          if (challengeById) {
            responses.success(req, res, challengeById);
          } else {
            responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
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

  public async getActiveChallenges(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const activeChallenges = await challengeServices.getAllActive(body);
          if (!activeChallenges.code) {
            responses.success(req, res, activeChallenges);
          } else {
            responses.error(req, res, activeChallenges);
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
}

export const challengesController = new ChallengesController();
