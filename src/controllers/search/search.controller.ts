import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { similarServices } from '../../services/similarservices/similar.services';
import { searchServices } from '../../services/searches/search.services';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');
const postModel = require('../../models/post/Posts.model');
const communityModel = require('../../models/communities/Communities.model');

class SearchController {
  public async searchGeneral(req: Request, res: Response) {
    try {
      const body = req.body
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      let searchResponse = []
      if (body.userID) {
        console.log(body.userID);
      } else {
        console.log(body.userID);
      }
      console.log(body.textString);

      const users = await userModel.find({
        $or: [
          { name: { $regex: body.textString, $options: "i" } },
          { description: { $regex: body.textString, $options: "i" } },
        ],
      })
      const marks = await trademarkModel.find({
        $or: [
          { name: { $regex: body.textString, $options: "i" } },
          { description: { $regex: body.textString, $options: "i" } },
        ],
      })
      const posts = await postModel.find({
        $or: [
          { description: { $regex: body.textString, $options: "i" } },
        ],
      })

      searchResponse.push({ peoples: users, marks: marks, posts: posts })

      responses.success(req, res, searchResponse);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
    }
  }

  public async fullSearch(req: Request, res: Response) {
    try {
      const body = req.body
      let token = req.headers.authorization ? req.headers.authorization : ''

      /* await middlewares.verifyToken(token).then(async rta => {
          if (rta.success) { */
      let searchResponse = []

      if (body.model != undefined) {
        let rta
        switch (body.model) {
          case "user":
            rta = await searchServices.getUsersByCriteria(body)
            searchResponse.push({ peoples: rta })
            break;
          case "mark":
            rta = await searchServices.getBrandsByCriteria(body)
            searchResponse.push({ marks: rta })
            break;
          case "post":
            rta = await searchServices.getPostsByCriteria(body)
            searchResponse.push({ posts: rta })
            break;
          case "classified":
            rta = await searchServices.getClassifiedsByCriteria(body)
            searchResponse.push({ classifieds: rta })
            break;
          case "community":
            rta = await searchServices.getCommunitiesByCriteria(body)
            searchResponse.push({ communities: rta })
            break;
          case "chat":
            rta = await searchServices.getChatsByCriteria(body)
            searchResponse.push({ chats: rta })
            break;
          default:
            rta = await searchServices.getUsersByCriteria(body)
            searchResponse.push({ peoples: rta })
            break;
        }
      } else {
        let peoples, marks, posts, classifieds, communities, chats
        peoples = await searchServices.getUsersByCriteria(body)
        marks = await searchServices.getBrandsByCriteria(body)
        posts = await searchServices.getPostsByCriteria(body)
        classifieds = await searchServices.getClassifiedsByCriteria(body)
        communities = await searchServices.getCommunitiesByCriteria(body)
        chats = await searchServices.getChatsByCriteria(body)
        searchResponse.push({
          peoples: peoples,
          marks: marks,
          posts: posts,
          classifieds: classifieds,
          communities: communities,
          chats: chats
        })
      }

      responses.success(req, res, searchResponse);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
    }
  }
}
export const searchController = new SearchController();