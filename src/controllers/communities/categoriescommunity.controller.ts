import { Request, Response } from "express";
import { categoriesCommunityServices } from "../../services/communities/categoriescommunity.services";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class CategoriesCommunityController {
  public async getCategoryByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const getClassified = await categoriesCommunityServices.getCategoryByID(
        body.id
      );
      if (!getClassified.code) {
        responses.success(req, res, getClassified);
      } else {
        responses.error(req, res, getClassified);
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
  public async createCategoryCommunity(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const saveClassified = await categoriesCommunityServices.createCategoryCommunity(
            body
          );
          if (!saveClassified.code) {
            responses.success(req, res, saveClassified);
          } else {
            responses.error(req, res, saveClassified);
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
  public async deleteCategoryCommunityByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const deleteClassified = await categoriesCommunityServices.deleteCategoryCommunityByID(
            body.id
          );
          if (!deleteClassified.code) {
            responses.success(req, res, deleteClassified);
          } else {
            responses.error(req, res, deleteClassified);
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
  public async updateCategoryCommunity(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const updateClassified = await categoriesCommunityServices.updateCategoryCommunity(
            body
          );
          if (!updateClassified.code) {
            responses.success(req, res, updateClassified);
          } else {
            responses.error(req, res, updateClassified);
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

  public async getAllCategoriesEnabled(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const categories = await categoriesCommunityServices.getAllCategoriesEnabled();
          responses.success(req, res, categories);
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

  public async searchCategoryEnabled(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const result = await categoriesCommunityServices.searchCategoryByNameEnabled(
            body
          );
          responses.success(req, res, result);
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

export const categoriesCommunityController = new CategoriesCommunityController();
