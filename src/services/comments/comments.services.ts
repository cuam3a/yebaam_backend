import { ConstantsRS } from "../../utils/constants";
const commentModel = require("../../models/comments/Comments.model");
const userModel = require("../../models/user/Users.model");
const professionalProfileModel = require("../../models/professionalprofile/ProfessionalProfiles.model");
const postModel = require("../../models/post/Posts.model");
const professionalPostModel = require("../../models/professionalpost/ProfessionalPosts.model");

// services
import { similarServices } from "../../services/similarservices/similar.services";
import { pointsByPostService } from "../Admin/pointsByPost/pointsByPost.service";
import { notificationsServices } from "../notifications/notifications.services";
import { userChallengeServices } from "../userchallenges/userchallenges.services";
import { userRankServices } from "../userranks/userranks.service";
import { brandRankingServices } from "../brandranking/brandranking.service";
import Server from "../../app";
import { socialServices } from "../social/social.services";
import { socialProfessionalServices } from "../social/socialprofessional.services";

class CommentServices {
  public async saveComment(body: any) {
    let rta, rtaError, model;
    const server = Server.instance;
    const entity = await similarServices.identifyUserBrandOrCommunity(
      body.entityID
    );

    if (!entity.code) {
      body.commentingUser = {
        _id: entity._id,
        name: entity.name,
        profilePicture: entity.profilePicture,
      };

      const content = await similarServices.identifyPostCommentResponseByID(
        body.contentID
      );

      if (!content.code) {
        switch (entity.type) {
          case "user":
            body.userID = body.entityID;
            body.postID = body.contentID;
            model = postModel;
            break;
          case "marks":
            body.trademarkID = body.entityID;
            body.postID = body.contentID;
            model = postModel;
            break;
          case "professional":
            body.professionalProfileID = body.entityID;
            body.professionalPostID = body.contentID;
            model = professionalPostModel;
            break;
        }

        const commetToSave = new commentModel(body);
        const commentSaved = await commetToSave.save();

        if (commentSaved) {
          const post = await model.findOne({
            _id: body.contentID,
            isEnabled: true,
          });
          if (post) {
            let addressee: any,
              notification = "Notificación por comentario",
              whoIsNotified,
              verifyEntity,
              professionalOrOthers;
            if (post.userID != undefined) {
              addressee = await similarServices.identifyUserBrandOrCommunity(
                post.userID
              );
              whoIsNotified = "U3";
              verifyEntity = post.userID;
              professionalOrOthers = 0;
              if (entity.id != verifyEntity) {
                // Sumar avance de reto
                await userChallengeServices.saveUserChallenge(
                  ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                  post.userID,
                  commentSaved.id
                );
                // Sumar avance de ranking
                await userRankServices.saveUserRank(
                  ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                  post.userID,
                  commentSaved.id
                );
              }
            } else if (post.trademarkID != undefined) {
              addressee = await similarServices.identifyUserBrandOrCommunity(
                post.trademarkID
              );
              whoIsNotified = "M3";
              verifyEntity = post.trademarkID;
              professionalOrOthers = 0;
              if (entity.id != verifyEntity) {
                // Sumar avance de ranking
                await brandRankingServices.saveBrandRanking(
                  ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                  post.trademarkID,
                  commentSaved.id
                );
              }

              if (body.userID != undefined) {
                // Sumar puntos otorgados en publicación
                await pointsByPostService.addSubstractPointsToUserIdComment(
                  post.id,
                  entity.id,
                  "add"
                );
              }
            } else if (post.professionalProfileID != undefined) {
              addressee = await similarServices.identifyUserBrandOrCommunity(
                post.professionalProfileID
              );
              whoIsNotified = "P3";
              verifyEntity = post.professionalProfileID;
              professionalOrOthers = 1;
            }
            const payload = {
              from: entity,
              bodyComment: commentSaved,
            };
            await server.io.in(addressee.socketID).emit("comment", payload);

            const postToUpdate = await model.updateOne(
              { _id: body.contentID },
              { comments: post.comments + 1 }
            );
            if (postToUpdate.nModified == 1) {
              let rtaSave;
              rtaSave = commentSaved;
              if (rtaSave) {
                rta = await this.getCommentById(rtaSave.id);
                if (
                  post.disableNotifications != undefined &&
                  post.disableNotifications == false
                ) {
                  let notifyComment = {
                    comment: commentSaved,
                    notification: notification,
                    whoIsNotified: whoIsNotified,
                  };
                  if (entity.id != verifyEntity) {
                    if (professionalOrOthers == 0) {
                      const canInotifyValidate =
                        await socialServices.canINotify({
                          firstID: entity.id,
                          secondID: verifyEntity,
                        });
                      if (canInotifyValidate == false) {
                        await notificationsServices.sendNotificationComment(
                          notifyComment
                        );
                      }
                    } else if (professionalOrOthers == 1) {
                      const canInotifyValidate =
                        await socialProfessionalServices.canINotify({
                          firstID: entity.id,
                          secondID: verifyEntity,
                        });
                      if (canInotifyValidate == false) {
                        await notificationsServices.sendNotificationComment(
                          notifyComment
                        );
                      }
                    }
                  }
                }
              }
            } else {
              rtaError = ConstantsRS.ERROR_UPDATING_RECORD;
            }
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        } else {
          rtaError = ConstantsRS.ERROR_SAVING_RECORD;
        }
      } else {
        rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
      }

      return rta ? rta : rtaError;
    } else {
      rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
    }
  }

  public async deleteComment(body: any) {
    let rta, rtaError, model, idPost;

    const comment = await commentModel.findOne({
      _id: body.id,
      isEnabled: true,
    });

    if (comment) {
      const commentToUpdate = await commentModel.updateOne(
        { _id: body.id },
        { isEnabled: false }
      );
      if (commentToUpdate.nModified == 1) {
        if (comment.postID != undefined) {
          model = postModel;
          idPost = comment.postID;
        } else if (comment.professionalPostID != undefined) {
          model = professionalPostModel;
          idPost = comment.professionalPostID;
        }

        const post = await model.findOne({ _id: idPost, isEnabled: true });
        if (post) {
          const postToUpdate = await model.updateOne(
            { _id: idPost },
            { comments: post.comments - 1 }
          );
          if (postToUpdate.nModified == 1) {
            if (post.userID != undefined) {
              // Restar avance de reto
              await userChallengeServices.cancelAdvanceUserChallenge(
                ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                post.userID,
                comment.id
              );
              // Restar avance de ranking
              await userRankServices.cancelAdvanceUserRank(
                ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                post.userID,
                comment.id
              );
            } else if (post.trademarkID != undefined) {
              // Restar avance de ranking
              await brandRankingServices.cancelAdvanceBrandRanking(
                ConstantsRS.SYSTEM_ACTION_RECEIVE_COMMENTS.code,
                post.trademarkID,
                comment.id
              );

              if (comment.postID != undefined && comment.userID != undefined) {
                // Restar puntos otorgados en publicación comentada
                await pointsByPostService.addSubstractPointsToUserIdComment(
                  comment.postID,
                  comment.userID,
                  "substract"
                );
              }
            }

            rta = "Comentario eliminado satisfactoriamente";
          } else {
            rtaError = ConstantsRS.ERROR_UPDATING_RECORD;
          }
        } else {
          rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }
      } else {
        rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER;
      }
    } else {
      rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
    }

    return rta ? rta : rtaError;
  }

  public async getCommentsNRepliesNReactionsByPost(postID: any) {
    let rta,
      rtaError,
      success = false;

    await commentModel
      .find({
        $or: [
          {
            $and: [{ postID: postID }, { isEnabled: true }],
          },
          {
            $and: [{ professionalPostID: postID }, { isEnabled: true }],
          },
        ],
      })
      .populate([
        {
          path: "userID",
          model: "Users",
          select: "name score profilePicture rankID",
          populate: {
            path: "rankID",
            model: "Ranks",
          },
        },
        {
          path: "trademarkID",
          model: "Trademarks",
          select: "name score profilePicture",
        },
        {
          path: "professionalProfileID",
          model: "ProfessionalProfiles",
          select: "name profilePicture",
        },
        {
          path: "reactionsIDS",
          model: "UserReactions",
          match: { isEnabled: true },
          populate: [
            {
              path: "userID",
              model: "Users",
              select: "name score profilePicture",
            },
            {
              path: "trademarkID",
              model: "Trademarks",
              select: "name score profilePicture",
            },
            {
              path: "professionalProfileID",
              model: "ProfessionalProfiles",
              select: "name profilePicture",
            },
          ],
        },
        {
          path: "replyCommentsIDS",
          model: "ReplyToComment",
          match: { isEnabled: true },
          populate: [
            {
              path: "reactionsIDS",
              model: "UserReactions",
              match: { isEnabled: true },
              populate: [
                {
                  path: "userID",
                  model: "Users",
                  select: "name score profilePicture rankID",
                  populate: {
                    path: "rankID",
                    model: "Ranks",
                  },
                },
                {
                  path: "trademarkID",
                  model: "Trademarks",
                  select: "name score profilePicture",
                },
                {
                  path: "professionalProfileID",
                  model: "ProfessionalProfiles",
                  select: "name profilePicture",
                },
              ],
            },
            {
              path: "userID",
              model: "Users",
              select: "name score profilePicture",
            },
            {
              path: "trademarkID",
              model: "Trademarks",
              select: "name score profilePicture",
            },
            {
              path: "professionalProfileID",
              model: "ProfessionalProfiles",
              select: "name profilePicture",
            },
          ],
        },
      ])
      .then((res: any) => {
        rta = res;
        success = true;
      })
      .catch(() => {
        rtaError = ConstantsRS.FAILED_TO_FETCH_RECORDS;
      });

    return rta ? rta : rtaError;
  }

  public async getCommentNRepliesNReactionsByComment(commentID: any) {
    let rta,
      rtaError,
      success = false;
    await commentModel
      .findOne({ _id: commentID, isEnabled: true })
      .populate([
        {
          path: "userID",
          model: "Users",
          select: "name score profilePicture rankID",
          populate: {
            path: "rankID",
            model: "Ranks",
          },
        },
        {
          path: "trademarkID",
          model: "Trademarks",
          select: "name score profilePicture",
        },
        {
          path: "professionalProfileID",
          model: "ProfessionalProfiles",
          select: "name profilePicture",
        },
        {
          path: "reactionsIDS",
          model: "UserReactions",
          match: { isEnabled: true },
          populate: [
            {
              path: "userID",
              model: "Users",
              select: "name score profilePicture rankID",
              populate: {
                path: "rankID",
                model: "Ranks",
              },
            },
            {
              path: "trademarkID",
              model: "Trademarks",
              select: "name score profilePicture",
            },
            {
              path: "professionalProfileID",
              model: "ProfessionalProfiles",
              select: "name profilePicture",
            },
          ],
        },
        {
          path: "replyCommentsIDS",
          model: "ReplyToComment",
          match: { isEnabled: true },
          populate: [
            {
              path: "reactionsIDS",
              model: "UserReactions",
              match: { isEnabled: true },
              populate: [
                {
                  path: "userID",
                  model: "Users",
                  select: "name score profilePicture",
                },
                {
                  path: "trademarkID",
                  model: "Trademarks",
                  select: "name score profilePicture",
                },
                {
                  path: "professionalProfileID",
                  model: "ProfessionalProfiles",
                  select: "name profilePicture",
                },
              ],
            },
            {
              path: "userID",
              model: "Users",
              select: "name score profilePicture rankID",
              populate: {
                path: "rankID",
                model: "Ranks",
              },
            },
            {
              path: "trademarkID",
              model: "Trademarks",
              select: "name score profilePicture",
            },
            {
              path: "professionalProfileID",
              model: "ProfessionalProfiles",
              select: "name profilePicture",
            },
          ],
        },
      ])
      .then((res: any) => {
        rta = res;
        success = true;
      })
      .catch(() => {
        rtaError = ConstantsRS.FAILED_TO_FETCH_RECORDS;
      });

    return rta ? rta : rtaError;
  }

  public async getCommentById(commentId: any) {
    try {
      const getComment = await commentModel
        .findOne({ _id: commentId })
        .populate([
          {
            path: "userID",
            model: "Users",
            select: "name score profilePicture rankID",
            populate: {
              path: "rankID",
              model: "Ranks",
            },
          },
          {
            path: "trademarkID",
            model: "Trademarks",
            select: "name score profilePicture",
          },
          {
            path: "professionalProfileID",
            model: "ProfessionalProfiles",
            select: "name profilePicture",
          },
        ])
        .populate("trademarkID")
        .populate("professionalProfileID");
      return getComment;
    } catch (error) {
      console.log(error);
    }
  }
}

export const commentServices = new CommentServices();
