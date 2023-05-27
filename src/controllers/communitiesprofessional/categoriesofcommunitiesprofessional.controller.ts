import { Request, Response } from "express";
import { categoriesOfCommunitiesProfessionalServices } from "../../services/communitiesprofessionales/categoriesofcommunitiesprofessional.service";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class CategoriesOfCommunitiesProfessionalController {
  public async getCategoryByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const getClassified = await categoriesOfCommunitiesProfessionalServices.getCategoryByID(
        body.id
      );
      res.send({
        error:
          getClassified == ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            ? getClassified
            : null,
        success:
          getClassified != ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            ? true
            : false,
        data:
          getClassified != ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            ? getClassified
            : [],
      });
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
          const saveClassified = await categoriesOfCommunitiesProfessionalServices.createCategoryCommunity(
            body
          );
          res.send({
            error:
              saveClassified == ConstantsRS.THE_RECORD_ALREDY_EXISTS
                ? saveClassified
                : null,
            success:
              saveClassified != ConstantsRS.THE_RECORD_ALREDY_EXISTS
                ? true
                : false,
            data:
              saveClassified != ConstantsRS.THE_RECORD_ALREDY_EXISTS
                ? saveClassified
                : [],
          });
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
          const deleteCategory = await categoriesOfCommunitiesProfessionalServices.deleteCategoryCommunityByID(
            body.id
          );
          if (deleteCategory.code == undefined) {
            responses.success(req, res, deleteCategory);
          } else {
            responses.error(req, res, deleteCategory);
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
          let err = "Error al actualizar";
          let updateSuccess = "Exito al actualizar";
          const updateClassified = await categoriesOfCommunitiesProfessionalServices.updateCategoryCommunity(
            body
          );
          res.send({
            error: updateClassified ? null : err,
            success: updateClassified ? updateSuccess : false,
            data: updateClassified,
          });
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

      /*  await middlewares.verifyToken(token).then(async (rta) => {
         if (rta.success) { */
      const categories = await categoriesOfCommunitiesProfessionalServices.getAllCategoriesEnabled();
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
          const result = await categoriesOfCommunitiesProfessionalServices.searchCategoryByNameEnabled(
            body
          );
          responses.success(req, res, result);
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

export const categoriesOfCommunitiesProfessionalController = new CategoriesOfCommunitiesProfessionalController();
