import { Request, Response } from "express";
import { chatsSevices } from '../../services/chats/chats.services';
import { responses } from '../utils/response/response';

// classes
import { ConstantsRS } from '../../utils/constants';

class ChatsController {
  public async createChatRoom(req: Request, res: Response) {
    try {
      const body = req.body
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      const chatToSave = await chatsSevices.createChatRoom(body)
      res.send({
        error: null,
        success: true,
        data: chatToSave,
      });
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }
}

export const chatsController = new ChatsController();
