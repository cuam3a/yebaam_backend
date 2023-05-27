import { Request, Response } from "express";
import { responses } from "../utils/response/response";
import { chatRoomsSevices } from "../../services/chats/chatRooms.services";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from '../../middlewares/middleware';

class ChatRoomsController {
  public async createChatRoom(req: any, res: Response) {
    try {
      const body = req.body;
      const file = req.files;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const chatToSave = await chatRoomsSevices.createChatRoom(body, file);
      if (chatToSave) {
        if (chatToSave.code != undefined) {
          responses.error(req, res, chatToSave)
        } else if (chatToSave != null) {
          responses.success(req, res, chatToSave)
        }
      } else {
        responses.success(req, res, chatToSave)
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async getAllChatRooms(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getAll = await chatRoomsSevices.getAllChatRooms(body);
      getAll
        ? responses.success(req, res, getAll)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getChatRoomsByAdminID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getAll = await chatRoomsSevices.getChatRoomsByAdminID(body);
      getAll
        ? responses.success(req, res, getAll)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getChatRoomByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getAll = await chatRoomsSevices.getChatRoomByID(body);
      getAll
        ? responses.success(req, res, getAll)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async updateChatRoom(req: any, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const body = req.body;
      const file = req.files;
      const chatToSave = await chatRoomsSevices.updateChatRoom(body, file);
      chatToSave
        ? responses.success(req, res, chatToSave)
        : responses.error(req, res, ConstantsRS.ERROR_UPDATING_RECORD);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async getMembersOfChatRoomID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getMembers = await chatRoomsSevices.getMembersOfChatRoomID(body);
      getMembers
        ? responses.success(req, res, getMembers)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async addMemberToChatRoom(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const memberAction = await chatRoomsSevices.addMemberToChatRoom(body);
      memberAction.code != undefined
        ? responses.error(req, res, memberAction)
        : memberAction
          ? responses.success(req, res, memberAction)
          : responses.error(req, res, ConstantsRS.ERROR_SAVING_RECORD);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async addMembersToChatRoom(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const memberAction = await chatRoomsSevices.addMembersToChatRoom(body);
      memberAction.code != undefined
        ? responses.error(req, res, memberAction)
        : memberAction != null
          ? responses.success(req, res, memberAction)
          : responses.success(req, res, memberAction)
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async deleteMemberToChatRoom(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const memberAction = await chatRoomsSevices.deleteMemberToChatRoom(body);
      memberAction
        ? responses.success(req, res, memberAction)
        : responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getChatRoomsIBelong(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getAll = await chatRoomsSevices.getChatRoomsIBelong(body);
      getAll
        ? responses.success(req, res, getAll)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async deleteChatRoom(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const memberAction = await chatRoomsSevices.deleteChatRoom(body);
      memberAction
        ? responses.success(req, res, memberAction)
        : responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async deleteAdminChatRoom(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const memberAction = await chatRoomsSevices.deleteAdminChatRoom(body);
      memberAction
        ? responses.success(req, res, memberAction)
        : responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getChatRoomsByCategoryID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const getAll = await chatRoomsSevices.getChatRoomsByCategoryID(body);
      getAll.length > 0
        ? responses.success(req, res, getAll)
        : responses.success(req, res, []);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async searchRoomsByNameAndCategoryEnabled(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const result = await chatRoomsSevices.searchRoomsByNameAndCategoryEnabled(body);
      responses.success(req, res, result);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }
}

export const chatRoomsController = new ChatRoomsController();
