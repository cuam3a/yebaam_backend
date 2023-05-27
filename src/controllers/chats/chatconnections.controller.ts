import { Request, Response } from "express";
import { chatConnectionServices } from "../../services/chats/chatConnection.services";
import { responses } from "../utils/response/response";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from '../../middlewares/middleware';

class ChatConnectionsController {
  public async actionsChatRooms(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const action = await chatConnectionServices.actionsChatRooms(body);
      action
        ? responses.success(req, res, action)
        : responses.error(req, res, ConstantsRS.FAILED_ACTION);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async getChatRoomRequests(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getRequest = await chatConnectionServices.getChatRoomRequests(body);
      getRequest
        ? responses.success(req, res, getRequest)
        : responses.error(req, res, ConstantsRS.NO_RECORDS);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getChatRoomInvitations(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getRequest = await chatConnectionServices.getChatRoomInvitations(
        body
      );
      getRequest
        ? responses.success(req, res, getRequest)
        : responses.error(req, res, ConstantsRS.NO_RECORDS);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async deleteConnection(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const deleteConnection = await chatConnectionServices.deleteConnection(
        body
      );
      deleteConnection
        ? responses.success(req, res, deleteConnection)
        : responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }
}

export const chatConnectionsController = new ChatConnectionsController();
