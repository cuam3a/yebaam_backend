import { Request, Response } from "express";
import { messagesServices } from "../../services/chats/messages.services";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { conversationListsServices } from '../../services/chats/conversationLists.services';
import { middlewares } from '../../middlewares/middleware';

class MessagesController {
  public async sendMessage(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const messageToSave = await messagesServices.sendMessage(body, file);
      messageToSave.code != undefined
        ? responses.error(req, res, messageToSave)
        : messageToSave
          ? responses.success(req, res, messageToSave)
          : responses.error(req, res, ConstantsRS.ERROR_SENDING_MESSAGE);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      console.log(error);      
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async sendMessageChatRoom(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const messageToSave = await messagesServices.sendMessageChatRoom(body, file);
      messageToSave.code != undefined
        ? responses.error(req, res, messageToSave)
        : messageToSave
          ? responses.success(req, res, messageToSave)
          : responses.error(req, res, ConstantsRS.ERROR_SENDING_MESSAGE);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async getMessagesBychatRoomID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getMessages = await messagesServices.getMessagesBychatRoomID(body);
      getMessages
        ? responses.success(req, res, getMessages)
        : responses.error(req, res, ConstantsRS.ERROR_FETCHING_RECORD);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getConversation(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getMessages = await messagesServices.getConversation(body);
      getMessages
        ? responses.success(req, res, getMessages)
        : responses.error(req, res, ConstantsRS.ERROR_FETCHING_RECORD);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async getConversationList(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const geConversationList = await conversationListsServices.getConversationsListById(body);
      responses.success(req, res, geConversationList)
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getConversationListWeb(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const geConversationList = await conversationListsServices.getConversationsListByIdWeb(body);
      responses.success(req, res, geConversationList)
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async deleteConversacion(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const deleteConversationList = await messagesServices.deleteConversacion(body);
      if (!deleteConversationList.code) {
        responses.success(req, res, deleteConversationList);
      } else {
        responses.error(req, res, deleteConversationList);
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async viewConversation(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const viewConversation = await conversationListsServices.viewConversation(body);
        responses.success(req, res, viewConversation);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }
}

export const messagesController = new MessagesController();
