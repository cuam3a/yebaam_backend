import { Request, Response } from "express";
import { ConstantsRS } from "../../utils/constants";
import { middlewares } from "../../middlewares/middleware";
const albumModel = require("../../models/album/Albums.model");
const userModel = require("../../models/user/Users.model");
const trademarkModel = require("../../models/trademarks/Trademarks.model");
const communityModel = require("../../models/communities/Communities.model");

// Services
import { albumsServices } from "../../services/albums/albums.services";
import { responses } from "../utils/response/response";

class AlbumsController {
  public async createAlbum(req: Request, res: Response) {
    try {
      const albumToSave = new albumModel(req.body);
      let albumSaved,
        token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          albumSaved = await albumToSave.save();
          responses.success(req, res, albumSaved);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async createAlbumByAnyUser(req: Request, res: Response) {
    try {
      let body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /*await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {*/
      const createAlbum = await albumsServices.createAlbumByAnyUser(body);
      res.send({
        error:
          createAlbum.code != undefined
            ? createAlbum
            : createAlbum != null
              ? null
              : ConstantsRS.ERROR_SAVING_RECORD,
        success:
          createAlbum.code != undefined
            ? false
            : createAlbum != null
              ? true
              : false,
        data:
          createAlbum.code != undefined
            ? []
            : createAlbum != null
              ? createAlbum
              : [],
      });
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
    }
  }

  public async getAllAlbums(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const albums = await albumModel.find({});
          responses.success(req, res, albums);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getAllAlbumsByAnyUser(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /*await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {*/
      const getAlbums = await albumsServices.getAlbumsByAnyUser(
        req.body.entityID,
        req.body.visitorID
      );
      responses.success(req, res, getAlbums);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getAlbumByID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /*await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {*/
      const getAlbum = await albumsServices.getAlbumByID(req.body.id);
      responses.success(req, res, getAlbum);
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async deleteAlbumById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await mddlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      let albumExist = await albumModel.findById(req.body.albumID)
      if (albumExist) {
        if (!albumExist.inUse) {
          const deleteAlbums = await albumsServices.deleteAlbumByAnyUser(req.body.albumID);
          responses.success(req, res, deleteAlbums);
        } else {
          responses.error(req, res, ConstantsRS.THE_REGISTRY_IS_IN_USE);
        }
      }
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async deleteUserAlbumById(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await mddlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      let model: any;
      switch (body.model) {
        case "user":
          model = userModel;
          break;
        case "marks":
          model = trademarkModel;
          break;
        case "community":
          model = communityModel;
          break;
        default:
          model = userModel;
          break;
      }
      await albumModel.updateOne({ _id: body.id }, { isEnabled: false }, async (error: any) => {
        if (error) {
          res.send({
            error: { ...ConstantsRS.ERROR_TO_DELETE_REGISTER, error },
            success: false,
            data: null,
          });
        } else {
          /* await model.updateOne(
                      { _id: body.entityID },
                      { $pull: { albumsIDS: body.id } },
                      { new: true }
                  ).then(() => {
                      res.status(200).send({
                          error: null,
                          success: true,
                          data: 'Album eliminado satisfactoriamente'
                      });
                  }) */
          responses.success(req, res, "Album eliminado satisfactoriamente");
        }
      });
      /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async updateAlbum(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const updateAlbum = await albumsServices.updateAlbumByID(body);
          res.send({
            error:
              updateAlbum.code != undefined
                ? updateAlbum
                : updateAlbum
                  ? null
                  : ConstantsRS.ERROR_UPDATING_RECORD,
            succes:
              updateAlbum.code != undefined
                ? false
                : updateAlbum
                  ? true
                  : false,
            data:
              updateAlbum.code != undefined
                ? []
                : updateAlbum
                  ? updateAlbum
                  : [],
          });
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async getAlbumsByAnyUserAndAlbumID(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await mddlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
      const body = req.body;
      const getPosts = await albumsServices.getAlbumsByAnyUserAndAlbumID(body);
      responses.success(req, res, getPosts);
      /* } else {
              responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
          }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }
}

export const albumsController = new AlbumsController();
