import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
const bcrypt = require("bcrypt");
const userModel = require("../../models/user/Users.model");
const communityModel = require("../../models/communities/Communities.model");
const trademarksModel = require("../../models/trademarks/Trademarks.model");
const albumModel = require("../../models/album/Albums.model");
const adminModel = require("../../models/admin/usersManagement/UserAdministrators.model");
const postModel = require("../../models/post/Posts.model");
const commentModel = require("../../models/comments/Comments.model");
const replyToCommentModel = require("../../models/replytocomments/ReplyToComments.model");
const userReactionsModel = require("../../models/userreactions/UserReactions.model");
var _ = require("lodash");
const studyModel = require("../../models/studies/Studies.model");
const experienceModel = require("../../models/experience/Experiences.model");
const professionalProfileModel = require("../../models/professionalprofile/ProfessionalProfiles.model");
const professionalPostModel = require("../../models/professionalpost/ProfessionalPosts.model");
const postReportModel = require("../../models/postsreports/PostsReports.model");
const classifiedModel = require("../../models/classifieds/Classifieds.model");
const professionalCommunityModel = require("../../models/communitiesprofessionales/ProfessionalCommunities.model");
const communityReportModel = require("../../models/communityreports/CommunityReports.model");
const certificatesModel = require("../../models/certificates/Certificates.model");
const landingsModel = require("../../models/landings/Landings.model");
const pointPackagesModel = require("../../models/pointPackage/pointPackage.model");
import { albumsServices } from "../../services/albums/albums.services";
import { userRankServices } from "../../services/userranks/userranks.service";

// interfaces
import { ExternalRegister } from "../../controllers/utils/interfaces/externalRegister.interface";
import { Credentials } from "../../controllers/utils/interfaces//credentialType.interface";

// middlewares
import { middlewares } from "../../middlewares/middleware";
import { socialServices } from '../social/social.services';
import { postSevices } from "../post/post.services";
import { socialProfessionalServices } from '../social/socialprofessional.services';
import { professionalPostServices } from '../professionalpost/professionalpost.services';
import { userSettingsServices } from '../usersettings/usersettings.service';
const seedrandom = require('seedrandom');

class SimilarServices {
  public async identifyUserBrandOrCommunity(id: string) {
    if (!id) throw ConstantsRS.FIELD_NOT_EXISTS;

    try {
      let rta, rtaError;
      const users = await userModel.findOne({
        _id: id,
        isEnabled: true,
        isEmailVerified: true,
      }).populate("rankID").populate("entityRankID");
      if (users) {
        rta = users;
      } else {
        const mark = await trademarksModel.findOne({
          _id: id,
          isEnabled: true,
          isEmailVerified: true,
        });
        if (mark) {
          rta = mark;
        } else {
          const community = await communityModel.findOne({
            _id: id,
            isEnabled: true,
          });
          if (community) {
            rta = community;
          } else {
            const admin = await adminModel.findOne({ _id: id });
            if (admin) {
              rta = admin;
            } else {
              const professionalProfile = await professionalProfileModel.findOne(
                {
                  _id: id,
                  isEnabled: true,
                });
              if (professionalProfile) {
                rta = professionalProfile;
              } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
              }
            }
          }
        }
      }
      return rta ? rta : rtaError;

    } catch (error) {
      throw { ...ConstantsRS.ERROR_FETCHING_RECORD, error };
    }
  }

  public async identifyUserBrandOrCommunityByTwoIDS(
    idSender: string,
    idAddressee: string
  ) {
    try {
      let rtaSender, rtaAddressee, rtaError;
      const usersSender = await userModel.findOne({ _id: idSender });
      if (usersSender) {
        rtaSender = usersSender;
      } else {
        const markSender = await trademarksModel.findOne({ _id: idSender });
        if (markSender) {
          rtaSender = markSender;
        } else {
          const communitySender = await communityModel.findOne({
            _id: idSender,
          });
          if (communitySender) {
            rtaSender = communitySender;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }

      const usersAddressee = await userModel.findOne({ _id: idAddressee });
      if (usersAddressee) {
        rtaAddressee = usersAddressee;
      } else {
        const markAddressee = await trademarksModel.findOne({
          _id: idAddressee,
        });
        if (markAddressee) {
          rtaAddressee = markAddressee;
        } else {
          const communityAddressee = await communityModel.findOne({
            _id: idAddressee,
          });
          if (communityAddressee) {
            rtaAddressee = communityAddressee;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }
      return {
        sender: rtaSender ? rtaSender : rtaError,
        addressee: rtaAddressee ? rtaAddressee : rtaError,
      };
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async identifyUserOrBrandByEmail(email: string) {
    try {
      let rta, rtaError;
      const users = await userModel.findOne({ email: email });
      if (users) {
        rta = users;
      } else {
        const mark = await trademarksModel.findOne({ email: email });
        if (mark) {
          rta = mark;
        } else {
          const admin = await adminModel.findOne({ email: email });
          if (admin) {
            rta = admin;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async verifyUpdPassAccount(body: any, entity: any) {
    await albumsServices.CreateAlbumsDefault();

    let model, setDefaultRank, user
    switch (entity) {
      case "user":
        model = userModel;
        user = await this.identifyUserOrBrandByEmail(body.email)
        break;
      case "marks":
        model = trademarksModel;
        break;
      default:
        model = userModel;
        user = await this.identifyUserOrBrandByEmail(body.email)
        break;
    }

    // get default albumes
    const albumesPhotos = await albumModel.find({ name: "Fotos Subidas" });
    const albumesProfiles = await albumModel.find({ name: "Fotos de Perfil" });

    // create data to save and fields verify
    let dataToUpdate = {
      ...body,
      verification_code: {},
      isEmailVerified: true,
      isDataVerified: true,
      albumsIDS: [albumesPhotos[0]._id, albumesProfiles[0]._id],
    };

    if (user != undefined) {
      // Set default rank
      setDefaultRank = await userRankServices.saveDefaultUserRank(user)
      if (setDefaultRank != null) {
        dataToUpdate.rankID = setDefaultRank.rankID
        dataToUpdate.entityRankID = setDefaultRank.entityRankID
      }
      /* var str = account.id; 
      var res = str.replace(/[a-z]/g, ''); */
      let rng = new seedrandom();
      const code = (rng()).toString().substring(3, 10);
      let res = Number(code)
      dataToUpdate.numericIdentifier = res
      let bodySettings = { entityId: user.id }
      const getUserSettings = await userSettingsServices.getUserSettingsByEntityId({ entityId: user.id })
      if (!getUserSettings) {
        await userSettingsServices.createUserSettings(bodySettings)
      }
    }

    if (body.password) {
      //encrypt password
      dataToUpdate.password = bcrypt.hashSync(body.password, 10)
    }

    // update user
    const userUpdate = await model.updateOne({ email: body.email }, dataToUpdate);

    let UserSaved = {};
    let rtaerror

    // get user info to send
    if (userUpdate.nModified == 1) {
      UserSaved = await model.findOne({ email: body.email });
    } else {
      rtaerror = ConstantsRS.ERROR_UPDATING_RECORD
    }

    return {
      error: rtaerror ? rtaerror : null,
      success: rtaerror ? false : true,
      data: rtaerror ? [] : UserSaved,
    };
  }

  public async changePassword(body: any, entity: any) {
    let model,
      response = {};
    switch (entity) {
      case "user":
        model = userModel;
        break;
      case "marks":
        model = trademarksModel;
        break;
      case "admin":
        model = adminModel
        break;
      default:
        model = userModel;
        break;
    }

    const userUpdate = await model.updateOne(
      { email: body.email },
      {
        ...body,
        password: bcrypt.hashSync(body.password, 10),
        verification_code: {},
      }
    );

    return (response = {
      error: null,
      success: true,
      data: `Contraseña restaurada correctamente`,
    });
  }

  public async validateCodeFromEmail(body: any, entityToUpdate: any) {
    let model,
      response = {};
    switch (entityToUpdate.type) {
      case "user":
        model = userModel;
        break;
      case "marks":
        model = trademarksModel;
        break;
      case "admin":
        model = adminModel
        break;
      default:
        model = userModel;
        break;
    }

    if (entityToUpdate.verification_code) {
      if (entityToUpdate.verification_code.intents >= 2) {
        // Excede los 2 intentos

        await model.updateOne(
          { email: body.email },
          {
            verification_code: {
              ...entityToUpdate.verification_code,
              intents: entityToUpdate.verification_code.intents + 1,
              NextIntent: moment().add(3, "minutes").unix(),
            },
          }
        );

        return (response = {
          error: ConstantsRS.EXCEEDED_INTENTS_CODE,
          success: false,
          data: { NextIntent: moment().add(3, "minutes").unix() },
        });
      } else if (
        entityToUpdate.verification_code.nextSend &&
        entityToUpdate.verification_code.nextSend > moment().unix()
      ) {
        return (response = {
          error: ConstantsRS.WAIT_A_MOMENT_TO_SEND_EMAIL,
          success: false,
          data: {
            nextSend: entityToUpdate.verification_code.nextSend,
          },
        });
      } else if (
        entityToUpdate.verification_code.expirationDate < moment().unix()
      ) {
        // Expiró el código

        return (response = {
          error: ConstantsRS.EXPIRATION_CODE,
          success: false,
          data: null,
        });
      } else if (entityToUpdate.verification_code.code == body.code) {
        // Verificación correcta del código

        return (response = {
          error: null,
          success: true,
          data: "Código verificado",
        });
      } else {
        await model.updateOne(
          { email: body.email },
          {
            verification_code: {
              ...entityToUpdate.verification_code,
              intents: entityToUpdate.verification_code.intents + 1,
            },
          }
        );

        return (response = {
          error: ConstantsRS.INCORRECT_CODE,
          success: false,
          data: null,
        });
      }
    } else {
      // No hay código de verificación
      return (response = {
        error: ConstantsRS.THERE_IS_NO_VERIFICATION_CODE,
        success: false,
        data: null,
      });
    }
  }

  public async identifyUMCWithAlbums(id: string) {
    try {
      let rta, rtaError;
      const users = await userModel.findOne({ _id: id }).populate("albumsIDS");
      if (users) {
        rta = users;
      } else {
        const mark = await trademarksModel
          .findOne({ _id: id })
          .populate("albumsIDS");
        if (mark) {
          rta = mark;
        } else {
          const community = await communityModel
            .findOne({ _id: id })
            .populate("albumsIDS");
          if (community) {
            rta = community;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async updateProfilePhoto(dataToUpdate: any, entity: any) {
    try {
      let model,
        response = {};
      switch (entity) {
        case "user":
          model = userModel;
          break;
        case "mark":
          model = trademarksModel;
          break;
        case "community":
          model = communityModel;
          break;
        default:
          model = userModel;
          break;
      }

      const entityUpdate = await model.updateOne(
        { _id: dataToUpdate.id },
        dataToUpdate
      );
      return entityUpdate;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  // External accounts
  public async createExternalAccount(body: any) {
    try {
      let model;
      switch (body.model) {
        case "user":
          model = userModel;
          break;
        case "marks":
          model = trademarksModel;
          break;
        default:
          model = userModel;
          break;
      }

      let rta,
        rtaError,
        newCredType = 0,
        success = false,
        response = {};
      let externalRegister: ExternalRegister = {
        domain: 0,
        credentialType: 0,
      };

      const accountToSave = new model(body);

      if (accountToSave.email) {
        newCredType = 1;
      } else if (body.idCredential) {
        newCredType = 2;
        accountToSave.email = accountToSave.idCredential + "@facebook.com";
        accountToSave.idCredential = accountToSave.idCredential;
      }

      externalRegister = {
        domain: parseInt(body.domain), // 1: Facebook, 2: Google, 3: Cualquiera
        credentialType: newCredType, // 1: Email, 2: Número
      };

      accountToSave.externalRegister = externalRegister;

      const account = await accountToSave.save();
      if (account) {
        success = true;
        rta = account;
      } else {
        rtaError = ConstantsRS.ERROR_SAVING_RECORD;
      }

      return (response = {
        error: rtaError ? rtaError : null,
        success: success,
        data: rta ? rta : [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async updateExternalAccount(newEmail: String, entity: any) {
    let model;
    switch (entity) {
      case "user":
        model = userModel;
        break;
      case "marks":
        model = trademarksModel;
        break;
      default:
        model = userModel;
        break;
    }

    let accountObject = {}, response = {};
    let credentials: Credentials = {
      type: 0,
      credential: "",
    };

    accountObject = {
      externalRegister: {
        domain: 3, // 1: Facebook, 2: Google, 3: Cualquiera
        credentialType: 1, // 1: Email, 2: Número
      },
    };

    credentials = {
      type: 1,
      credential: newEmail,
    };

    const accountUpdate = await model.updateOne(
      { email: newEmail },
      accountObject
    );
    if (accountUpdate.nModified == 1) {
      // Si se actualiza correctamente el usuario
      var account = await model.findOne({ email: newEmail }).exec();
      if (account.isDataVerified) {
        const login = await this.loginExternalAccount(credentials, model);
        return login;
      } else {
        return (response = {
          error: ConstantsRS.ACCOUNT_DATA_PENDING,
          success: false,
          data: account,
        });
      }
    } else {
      return (response = {
        error: ConstantsRS.ERROR_UPDATING_RECORD,
        success: false,
        data: null,
      });
    }
  }

  public async updateAccountDataExternal(body: any, credentials: any) {
    let accountObject = body;
    let model: any, setDefaultRank
    let rta, rtaError, token, success = false

    switch (body.model) {
      case "user":
        model = userModel;
        break;
      case "marks":
        model = trademarksModel;
        break;
      default:
        model = userModel;
        break;
    }

    await albumsServices.CreateAlbumsDefault();
    // get default albumes
    const albumesPhotos = await albumModel.find({ name: "Fotos Subidas" });
    const albumesProfiles = await albumModel.find({ name: "Fotos de Perfil" });
    accountObject.albumsIDS = [albumesPhotos[0]._id, albumesProfiles[0]._id];

    if (credentials.type === 1) {
      await model.findOne({ email: credentials.credential })
        .then(async (account: any) => {
          if (account) {
            rta = account;
            success = true;
            // Set default rank
            if (account.type == "user") {
              setDefaultRank = await userRankServices.saveDefaultUserRank(account)
              if (setDefaultRank != null) {
                accountObject.rankID = setDefaultRank.rankID
                accountObject.entityRankID = setDefaultRank.entityRankID
              }
              /* var str = account.id; 
              var res = str.replace(/[a-z]/g, ''); */
              let rng = new seedrandom();
              const code = (rng()).toString().substring(3, 10);
              let res = Number(code)
              accountObject.numericIdentifier = res
              let bodySettings = { entityId: account.id }
              const getUserSettings = await userSettingsServices.getUserSettingsByEntityId({ entityId: account.id })
              if (!getUserSettings) {
                await userSettingsServices.createUserSettings(bodySettings)
              }
            }

            token = await middlewares.createOnlyToken(account);
            await model.updateOne(
              { email: credentials.credential },
              accountObject
            );
          } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST;
          }
        });
    } else {
      await model.findOne({ idCredential: credentials.credential })
        .then(async (account: any) => {
          if (account) {
            rta = account;
            success = true;

            // Set default rank
            if (account.type == "user") {
              setDefaultRank = await userRankServices.saveDefaultUserRank(account)
              if (setDefaultRank != null) {
                accountObject.rankID = setDefaultRank.rankID
                accountObject.entityRankID = setDefaultRank.entityRankID
              }
              let bodySettings = { entityId: account.id }
              const getUserSettings = await userSettingsServices.getUserSettingsByEntityId({ entityId: account.id })
              if (!getUserSettings) {
                await userSettingsServices.createUserSettings(bodySettings)
              }
            }

            token = await middlewares.createOnlyToken(account);
            await model.updateOne(
              { idCredential: credentials.credential },
              accountObject
            );
          } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST;
          }
        });
    }

    return {
      error: rtaError ? rtaError : null,
      success: success,
      token: token ? token : null,
      data: rta ? rta : [],
    }
  }

  public async loginExternalAccount(credentials: any, entity: any) {
    try {
      let model;
      switch (entity) {
        case "user":
          model = userModel;
          break;
        case "marks":
          model = trademarksModel;
          break;
        default:
          model = userModel;
          break;
      }

      let rta, rtaError, token: any = [], success = false, response = {}, user

      if (credentials.type === 1) {// Login con email        
        user = await model.findOne({ email: credentials.credential })
      } else {// Login con id credencial   
        user = await model.findOne({ idCredential: credentials.credential })
      }

      if (user) {
        rta = user;
        success = true;

        if (rta.isBanned == true && rta.isEnabled == true) {
          let currentDate = moment()

          if (rta.banEndDate != undefined) { // Si tiene baneo provisional
            let banEndDate = rta.banEndDate

            let stillBanned = currentDate.isBefore(banEndDate); // Determina si aún conserva el baneo
            if (stillBanned == true) { // Sigue baneado
              let remainingDays = currentDate.diff(banEndDate, 'days')
              let remainingLeft = currentDate.diff(banEndDate, 'hours')
              let minutesRemaining = currentDate.diff(banEndDate, 'minutes')
              rta.banRemaining = {
                days: Math.abs(remainingDays),
                hours: Math.abs(remainingLeft),
                minutes: Math.abs(minutesRemaining)
              }
            } else {
              let userUpdated = await userModel.findOneAndUpdate({ _id: rta.id }, { $unset: { banStartDate: null, banEndDate: null }, isBanned: false, bannedPosts: 0 }, { new: true })
              if (userUpdated) {
                rta = userUpdated
              }
            }
          }
        }

        token = await middlewares.createOnlyToken(user);
      } else {
        rtaError = ConstantsRS.USER_DOES_NOT_EXIST;
      }

      return (response = {
        error: rtaError ? rtaError : null,
        success: success,
        token: token ? token : null,
        data: rta ? rta : [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  //#region Sockets Methods

  public async changeState(obj: any, connect: Boolean, socketID: String) {
    try {
      let rta, updatedRta;
      switch (obj.type) {
        case "user":
          if (connect) {
            const userCo = await userModel.findOneAndUpdate(
              { _id: obj.id },
              { connectionStatus: true, socketID: socketID },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedUser = new userModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedUser;
              }
            );
            if (userCo != undefined) {
              if (userCo.professionalProfileID != undefined && userCo.professionalProfileID != null) {
                await professionalProfileModel.findOneAndUpdate(
                  { _id: userCo.professionalProfileID },
                  { connectionStatus: true, socketID: socketID },
                  { new: true })
              }
            }
          } else {
            let date = moment().format("YYYY-MM-DD HH:mm:ss");
            let hour = moment().format("HH:mm:ss");
            const userCo = await userModel.findOneAndUpdate(
              { _id: obj.id },
              {
                connectionStatus: false,
                socketID: socketID,
                lastConnection: date,
                lastConnectionTime: hour,
              },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedUser = new userModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedUser;
              }
            );
            if (userCo != undefined) {
              if (userCo.professionalProfileID != undefined && userCo.professionalProfileID != null) {
                await professionalProfileModel.findOneAndUpdate(
                  { _id: userCo.professionalProfileID },
                  { connectionStatus: true, socketID: socketID },
                  { new: true })
              }
            }
          }
          break;
        case "marks":
          if (connect) {
            await trademarksModel.findOneAndUpdate(
              { _id: obj.id },
              { connectionStatus: true, socketID: socketID },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedTrademarks = new trademarksModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedTrademarks;
              }
            );
          } else {
            let date = moment().format("YYYY-MM-DD HH:mm:ss");
            let hour = moment().format("HH:mm:ss");
            await trademarksModel.findOneAndUpdate(
              { _id: obj.id },
              {
                connectionStatus: false,
                socketID: socketID,
                lastConnection: date,
                lastConnectionTime: hour,
              },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedTrademarks = new trademarksModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedTrademarks;
              }
            );
          }
          break;
        case "admin":
          if (connect) {
            await adminModel.findOneAndUpdate(
              { _id: obj.id },
              { connectionStatus: true, socketID: socketID },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedAdmin = new adminModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedAdmin;
              }
            );
          } else {
            let date = moment().format("YYYY-MM-DD HH:mm:ss");
            let hour = moment().format("HH:mm:ss");
            await adminModel.findOneAndUpdate(
              { _id: obj.id },
              {
                connectionStatus: false,
                socketID: socketID,
                lastConnection: date,
                lastConnectionTime: hour,
              },
              { new: true },
              (err: any, res: any) => {
                updatedRta = res;
                const updatedAdmin = new adminModel(
                  updatedRta,
                  (updatedRta.password = "")
                );
                rta = updatedAdmin;
              }
            );
          }
          break;

        default:
          break;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async socketsUsers(ids: any) {
    try {
      let socketsIDs: any = [];
      for await (let item of ids) {
        const getAllUMCA = await this.identifyUserBrandOrCommunity(item);
        socketsIDs.push(getAllUMCA.socketID);
      }
      return socketsIDs ? socketsIDs : [];
    } catch (error) {
      console.log(error);
    }
  }

  public async identifyUserBrandOrCommunityMessages(id: string) {
    if (!id) throw ConstantsRS.FIELD_NOT_EXISTS;

    try {
      let rta, rtaError;
      const users = await userModel.findOne({
        _id: id,
        isEnabled: true,
        isEmailVerified: true,
      }, { _id: 1, name: 1, email: 1, profilePicture: 1, rankID: 1, socketID: 1, disableAnyNotification: 1, connectionStatus: 1 }).populate("rankID");
      if (users) {
        rta = users;
      } else {
        const mark = await trademarksModel.findOne({
          _id: id,
          isEnabled: true,
          isEmailVerified: true,
        }, { _id: 1, name: 1, email: 1, profilePicture: 1, disableAnyNotification: 1, connectionStatus: 1 });
        if (mark) {
          rta = mark;
        } else {
          const community = await communityModel.findOne({
            _id: id,
            isEnabled: true,
          });
          if (community) {
            rta = community;
          } else {
            const admin = await adminModel.findOne({ _id: id }, { _id: 1, name: 1, email: 1, profilePicture: 1 });
            if (admin) {
              rta = admin;
            } else {
              const professionalProfile = await professionalProfileModel.findOne(
                {
                  _id: id,
                  isEnabled: true,
                }, { _id: 1, name: 1, email: 1, profilePicture: 1, connectionStatus: 1 });
              if (professionalProfile) {
                rta = professionalProfile;
              } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
                throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
              }
            }
          }
        }
      }
      return rta ? rta : rtaError;

    } catch (error) {
      console.log(error);
      throw { ...ConstantsRS.ERROR_FETCHING_RECORD, error };
    }
  }

  //#endregion

  public async identifyPostCommentResponseByID(id: string) {
    try {
      let rta, rtaError;
      const post = await postModel.findOne({ _id: id });
      if (post) {
        rta = post;
      } else {
        const comment = await commentModel.findOne({ _id: id });
        if (comment) {
          rta = comment;
        } else {
          const resComment = await replyToCommentModel.findOne({ _id: id });
          if (resComment) {
            rta = resComment;
          } else {
            const professionalPost = await professionalPostModel.findOne({
              _id: id,
            });
            if (professionalPost) {
              rta = professionalPost;
            } else {
              rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }
          }
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async getReactionExistence(
    entityID: any,
    entityField: any,
    contentID: any
  ) {
    try {
      let rta, rtaError;
      switch (entityField) {
        case "userID":
          rta = await userReactionsModel.find({
            $or: [
              { $and: [{ userID: entityID }, { postID: contentID }] },
              { $and: [{ userID: entityID }, { commentID: contentID }] },
              { $and: [{ userID: entityID }, { replyToCommentID: contentID }] },
            ],
          });
          break;
        case "trademarkID":
          rta = await userReactionsModel.find({
            $or: [
              { $and: [{ trademarkID: entityID }, { postID: contentID }] },
              { $and: [{ trademarkID: entityID }, { commentID: contentID }] },
              {
                $and: [
                  { trademarkID: entityID },
                  { replyToCommentID: contentID },
                ],
              },
            ],
          });
          break;
        case "professionalProfileID":
          rta = await userReactionsModel.find({
            $or: [
              {
                $and: [
                  { professionalProfileID: entityID },
                  { professionalPostID: contentID },
                ],
              },
            ],
          });
          break;
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async updateEntityContent(dataToUpdate: any, entity: any) {
    let model
    switch (entity) {
      case "post":
        model = postModel;
        break;
      case "comment":
        model = commentModel;
        break;
      case "replytocomment":
        model = replyToCommentModel;
        break;
      default:
        model = postModel;
        break;
    }

    const entityUpdate = await model.findOneAndUpdate(
      { _id: dataToUpdate.id },
      dataToUpdate,
      { new: true }
    );
    return entityUpdate;
  }

  public async getPostsHomeById(body: any) {
    let { limit, nextSkip, skip } = body;

    if (!limit) {
      limit = ConstantsRS.PACKAGE_LIMIT;
    }

    const id = body.entityID;

    let ids, posts: any = []

    const socialFriends = await socialServices.getSocialFriendsForPosts(id);
    let getPosts2 = await postSevices.getPostsByIDForHomeMe(id, body);
    if (getPosts2) {
      posts.push(getPosts2);
    }
    if (socialFriends.length > 0) {
      ids = await socialServices.separateUsersPostsHome(socialFriends, id);
      for await (let item of ids) {
        let privacyAllowed: any = []
        let socialConnection = await socialServices.getSocialConnectionByIDS(id, item) // Conexiones sociales propias

        if (!socialConnection.code) {
          if (!socialConnection.areFriends) {
            privacyAllowed = [0]
          } else if (socialConnection.areFriends) {
            privacyAllowed = [0, 2]
          }
        } else {
          privacyAllowed = [0]
        }

        let getPosts = await postSevices.getPostsByIDForHome(item, privacyAllowed);

        if (getPosts != undefined) {
          if (posts.length > 0) {
            posts[0] = posts[0].concat(getPosts);
          } else {
            posts.push(getPosts);
          }
        }
      }
    }

    if (posts.length > 0) {
      let filterPost: any = []
      for await (let element of posts[0]) {
        if (element.typePost == 4) {
          let secondEntity
          if (element.postIDContent != undefined) {
            if (element.postIDContent.userID != undefined) {
              secondEntity = element.postIDContent.userID.id
            } else {
              secondEntity = element.postIDContent.trademarkID.id
            }
          }

          if (secondEntity != undefined) {
            let socialSecondConnection = await socialServices.getSocialConnectionByIDS(id, secondEntity) // Conexiones sociales secundarias

            if (!socialSecondConnection.code) {
              if (!socialSecondConnection.areFriends) {
                if (element.postIDContent.privacy == 0) {
                  filterPost.push(element);
                }
              } else if (socialSecondConnection.areFriends) {
                if (element.postIDContent.privacy == 0 || element.postIDContent.privacy == 2) {
                  filterPost.push(element);
                }
              }
            } else {
              if (element.postIDContent.privacy == 0) {
                filterPost.push(element);
              }
            }
          }
        } else {
          filterPost.push(element);
        }
      }

      var sortedArray = _.orderBy(filterPost, ["publicactionDate"], ["desc"]);
      let newHomePost  = _.uniqBy(sortedArray, 'id');
      if (skip !== undefined) {
        nextSkip = skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT);
      } else {
        if (limit) {
          nextSkip = limit;
        } else {
          nextSkip = ConstantsRS.PACKAGE_LIMIT;
        }
      }
      return {
        nextSkip: nextSkip,
        data: newHomePost,
      };
    } else {
      return ConstantsRS.NO_RECORDS;
    }
  }

  public async getPostsHomeProfessionalById(body: any) {
    let { limit, nextSkip, skip } = body;

    if (!limit) {
      limit = ConstantsRS.PACKAGE_LIMIT;
    }
    const id = body.entityID;
    let ids, posts: any = [], filterPost
    const socialFriends = await socialProfessionalServices.getSocialContactsForPosts(id);

    let getPosts2 = await professionalPostServices.getPostsByIDForHomeMe(id);
    if (getPosts2) {
      posts.push(getPosts2);
    }

    if (socialFriends.length > 0) {
      ids = await socialServices.separateUsersPostsHome(socialFriends, id);
      for await (let item of ids) {
        let privacyAllowed: any = []
        let socialConnection = await socialProfessionalServices.getSocialConnectionByIDS(id, item)
        if (!socialConnection.code) {
          if (!socialConnection.areContacts) {
            privacyAllowed = [0]
          } else if (socialConnection.areContacts) {
            privacyAllowed = [0, 2]
          }
        } else {
          privacyAllowed = [0]
        }

        let getPosts = await professionalPostServices.getPostsByIDForHome(item, privacyAllowed);

        if (posts.length > 0) {
          posts[0] = posts[0].concat(getPosts);
        } else {
          posts.push(filterPost);
        }
      }
    }

    if (posts.length > 0) {
      var sortedArray = _.orderBy(posts[0], ["publicactionDate"], ["desc"]);
      if (skip !== undefined) {
        nextSkip = skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT);
      } else {
        if (limit) {
          nextSkip = limit;
        } else {
          nextSkip = ConstantsRS.PACKAGE_LIMIT;
        }
      }
      return {
        nextSkip: nextSkip,
        data: sortedArray,
      };
    } else {
      return ConstantsRS.NO_RECORDS;
    }
  }

  public async changeLastPost(model: string, entityID: string) {
    try {
      let rta,
        updatedRta,
        date = moment(Date.now()).toDate();
      switch (model) {
        case "user":
          await userModel.findOneAndUpdate(
            { _id: entityID },
            { lastPost: date },
            { new: true },
            (err: any, res: any) => {
              updatedRta = res;
              const updatedUser = new userModel(
                updatedRta,
                (updatedRta.password = "")
              );
              rta = updatedUser;
            }
          );
          break;
        case "marks":
          await trademarksModel.findOneAndUpdate(
            { _id: entityID },
            { lastPost: date },
            { new: true },
            (err: any, res: any) => {
              updatedRta = res;
              const updatedTrademarks = new trademarksModel(
                updatedRta,
                (updatedRta.password = "")
              );
              rta = updatedTrademarks;
            }
          );
          break;
        case "community":
          await communityModel.findOneAndUpdate(
            { _id: entityID },
            { lastPost: date },
            { new: true },
            (err: any, res: any) => {
              updatedRta = res;
              const updatedCommunity = new communityModel(
                updatedRta,
                (updatedRta.password = "")
              );
              rta = updatedCommunity;
            }
          );
          break;
        case "professional":
          await professionalProfileModel.findOneAndUpdate(
            { _id: entityID },
            { lastPost: date },
            { new: true },
            (err: any, res: any) => {
              updatedRta = res;
              const updateProfessional = new professionalProfileModel(
                updatedRta
              );
              rta = updateProfessional;
            }
          );
          break;

        default:
          break;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async identifyStudyOrExperience(id: string) {
    try {
      let rta, rtaError;
      const study = await studyModel.findOne({ _id: id, isEnabled: true });
      if (study) {
        rta = study;
      } else {
        const experience = await experienceModel.findOne({
          _id: id,
          isEnabled: true,
        });
        if (experience) {
          rta = experience;
        } else {
          rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async identifyTypePostByID(id: string) {
    try {
      let rta, rtaError;
      const post = await postModel.findOne({ _id: id, isEnabled: true });
      if (post) {
        rta = post;
      } else {
        const professionalPost = await professionalPostModel.findOne({ _id: id, isEnabled: true });
        if (professionalPost) {
          rta = professionalPost;
        } else {
          rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      console.log(error);
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async identifyPostReportByContentID(contentID: string) {
    let rta, rtaError, portReport
    portReport = await postReportModel.findOne({
      $or: [
        { $and: [{ postID: contentID }, { isEnabled: true }] },
        { $and: [{ professionalPostID: contentID }, { isEnabled: true }] },
      ]
    }).populate('postID')
      .populate('professionalPostID')

    if (portReport) {
      rta = portReport
    } else {
      rtaError = ConstantsRS.POST_UNREPORTED
    }
    return rta ? rta : rtaError
  }

  public async identifyUserOrBrandSearch(id: string, search: string) {
    if (!id) throw ConstantsRS.FIELD_NOT_EXISTS;

    try {
      let rta, rtaError;
      const users = await userModel.findOne({
        $and: [{ _id: id }, { name: { $regex: `.*${search}`, $options: "i" } },
        { isEnabled: true },
        { isEmailVerified: true }]
      }, { name: 1, birthday: 1, email: 1, description: 1, phone: 1, ubication: 1, gender: 1, profilePicture: 1, type: 1, alias: 1 });
      if (users) {
        rta = users;
      } else {
        const mark = await trademarksModel.findOne({
          $and: [{ _id: id }, { name: { $regex: `.*${search}`, $options: "i" } },
          { isEnabled: true },
          { isEmailVerified: true }]
        }, { name: 1, email: 1, description: 1, phone: 1, ubication: 1, profilePicture: 1, type: 1 });
        if (mark) {
          rta = mark;
        } else {
          const professionalProfile = await professionalProfileModel.findOne(
            {
              $and: [{ _id: id }, { name: { $regex: `.*${search}`, $options: "i" } },
              { isEnabled: true }]
            },
            { name: 1, email: 1, contactNumber: 1, country: 1, city: 1, profilePicture: 1, profession: 1, type: 1 });
          if (professionalProfile) {
            rta = professionalProfile;
          }
        }
      }
      return rta

    } catch (error) {
      console.log(error);
      throw { ...ConstantsRS.ERROR_FETCHING_RECORD, error };
    }
  }

  public async identifyContentToSave(id: string) {
    try {
      let rta, rtaError;
      const post = await postModel.findOne({
        $and: [
          { _id: id },
          { isEnabled: true }
        ]
      });
      if (post) {
        rta = post;
      } else {
        const professionalPost = await professionalPostModel.findOne({
          $and: [
            { _id: id },
            { isEnabled: true }
          ]
        });
        if (professionalPost) {
          rta = professionalPost;
        } else {
          const classified = await classifiedModel.findOne({
            $and: [
              { _id: id },
              { isEnabled: true }
            ]
          });
          if (classified) {
            rta = classified;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async identifyTypeOfCommunity(id: string) {
    try {
      let rta, rtaError;
      const userCommunity = await communityModel.findById(id)
      if (userCommunity) {
        rta = userCommunity;
      } else {
        const professionalCommunity = await professionalCommunityModel.findById(id)
        if (professionalCommunity) {
          rta = professionalCommunity;
        } else {
          rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }
      }
      return rta ? rta : rtaError;
    } catch (error) {
      return ConstantsRS.ERROR_FETCHING_RECORD;
    }
  }

  public async disableNotifications(body: any) {
    try {
      let rta, updatedRta, nameDisable = body.nameDisable, bodySettings;

      const getAnyUser = await this.identifyUserBrandOrCommunity(body.entityID)
      if (getAnyUser) {
        if (getAnyUser.code == undefined) {
          switch (nameDisable) {
            case 'tagged':
              bodySettings = {
                entityId: body.entityID,
                isDisabledNotificactionOfTagged: body.enable
              }
              break;
            case 'awards':
              bodySettings = {
                entityId: body.entityID,
                isDisabledNotificactionOfawards: body.enable
              }
              break;
          }
          updatedRta = await userSettingsServices.modifyUserSettings(bodySettings)
          updatedRta ? rta = updatedRta : rta
        }
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async identifyCommunityReportByCommunityID(communityID: string) {
    let rta, rtaError, communityReport
    communityReport = await communityReportModel.findOne({
      $or: [
        { $and: [{ reportedCommunityID: communityID }, { isEnabled: true }] },
        { $and: [{ reportedProfessionalCommunityID: communityID }, { isEnabled: true }] },
      ]
    }).populate('reportedCommunityID')
      .populate('reportedProfessionalCommunityID')

    if (communityReport) {
      rta = communityReport
    } else {
      rtaError = ConstantsRS.COMMUNITY_UNREPORTED
    }
    return rta ? rta : rtaError
  }

  public async identifyPurchaseItem(id: string) {
    if (!id) throw ConstantsRS.FIELD_NOT_EXISTS;

    try {
      let rta, rtaError;
      const certificate = await certificatesModel.findOne({
        _id: id,
        isEnabled: true
      })
      if (certificate) {
        rta = certificate;
      } else {
        const landing = await landingsModel.findOne({
          _id: id,
          isEnabled: true
        });
        if (landing) {
          rta = landing;
        } else {
          const pointspackage = await pointPackagesModel.findOne({
            _id: id,
            isEnabled: true,
          });
          if (pointspackage) {
            rta = pointspackage;
          } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
          }
        }
      }
      return rta ? rta : rtaError;

    } catch (error) {
      throw { ...ConstantsRS.ERROR_FETCHING_RECORD, error };
    }
  }
}

export const similarServices = new SimilarServices();
