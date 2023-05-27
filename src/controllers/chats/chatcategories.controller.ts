import { Request, Response } from "express";
import { chatCategoriresServices } from "../../services/chats/chatCategories.services";
import { responses } from "../utils/response/response";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from "../../middlewares/middleware";

class ChatCategoriesController {
  public async createChatCategory(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const chatToSave = await chatCategoriresServices.createChatCategory(
            body
          );
          let rta =
            chatToSave.code != undefined
              ? responses.error(req, res, chatToSave)
              : chatToSave
                ? responses.success(req, res, chatToSave)
                : responses.success(req, res, []);
          return rta;
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

  public async getAllChatCategories(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const getAllCategories = await chatCategoriresServices.getAllChatCategories();
      getAllCategories
        ? responses.success(req, res, getAllCategories)
        : responses.error(req, res, ConstantsRS.NO_CHATS_FOUND);
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

  public async getChatCategoryById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const chatCategoryID = req.body.chatCategoryID;
      const getCategory = await chatCategoriresServices.getChatCategoryById(
        chatCategoryID
      );
      getCategory
        ? responses.success(req, res, getCategory)
        : responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
      /* } else {
        responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
      }
    }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.THE_RECORD_DOES_NOT_EXIST,
        error: error,
      });
    }
  }

  public async getChatCategoryByName(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const name = req.body.name;
      const getCategory = await chatCategoriresServices.getChatCategoryByName(
        name
      );
      getCategory
        ? responses.success(req, res, getCategory)
        : responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
      /* } else {
        responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
      }
    }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.THE_RECORD_DOES_NOT_EXIST,
        error: error,
      });
    }
  }

  public async updateChatCategory(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const updateChat = await chatCategoriresServices.updateChatCategory(
            body
          );
          updateChat
            ? responses.success(req, res, updateChat)
            : responses.error(req, res, ConstantsRS.THE_RECORD_ALREDY_EXISTS);
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

  public async deleteChatCategoryByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const chatCategoryID = req.body.chatCategoryID;
          const deleteChat = await chatCategoriresServices.deleteChatCategoryByID(
            chatCategoryID
          );
          if (deleteChat.code == undefined) {
            responses.success(req, res, deleteChat);
          } else {
              responses.error(req, res, deleteChat);
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

  public async removeChatCategoryByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const chatCategoryID = req.body.chatCategoryID;
          const deleteChat = await chatCategoriresServices.removeChatCategoryByID(
            chatCategoryID
          );
          if (deleteChat.code == undefined) {
            responses.success(req, res, deleteChat);
          } else {
              responses.error(req, res, deleteChat);
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

export const chatCategoriesController = new ChatCategoriesController();
