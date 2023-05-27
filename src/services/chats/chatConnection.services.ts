import { ConstantsRS } from "../../utils/constants";
import { notificationsServices } from "../notifications/notifications.services";
import { chatRoomsSevices } from "./chatRooms.services";
import { similarServices } from '../similarservices/similar.services';
const chatConnectionModel = require("../../models/chats/ChatConnections.model");

class ChatConnectionServices {
  public async actionsChatRooms(body: any) {
    try {
      let rta;
      switch (body.type) {
        case 0:
          rta = await this.sendRequestChatRoom(body);
          break;
        case 1:
          rta = await this.sendInvitationUser(body);
          break;
        case 2:
          rta = await this.acceptRequest(body);
          break;
        case 3:
          rta = await this.cancelRequest(body);
          break;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async searchIfIExistInARoom(body: any) {
    try {
      const chatConnection = await chatConnectionModel.findOne({
        $and: [{ entityID: body.entityID }, { chatID: body.chatID }],
      });

      return chatConnection;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async sendRequestChatRoom(body: any) {
    try {
      let validateExist, rta, notify;
      validateExist = await this.searchIfIExistInARoom(body);
      if (validateExist) {
        if (validateExist.sendInvitation) {
          rta = ConstantsRS.I_ALREADY_SEND_REQUEST;
        } else {
          if (validateExist.sendRequest) {
            if (validateExist.isMember) {
              rta = ConstantsRS.YOUR_APPLICATION_HAS_ALREADY_BEEN_ACCEPTED;
            } else {
              rta = ConstantsRS.I_ALREADY_SEND_REQUEST;
            }
          } else {
            let resend = await chatConnectionModel.findOneAndUpdate({_id:validateExist.id},{sendRequest: true, cancelRequest: false},{new:true})
            if (resend) {
              notify = {
                senderID: resend.entityID,
                addresseeID: resend.adminID,
                chatConnectionId: validateExist.id,
              };
              await notificationsServices.generateNotification(notify);
            }
            rta = resend
          }
        }
      } else {
        const chatConnectionToSave = new chatConnectionModel(body);
        chatConnectionToSave.sendRequest = true;
        chatConnectionToSave.cancelRequest = false;
        rta = await chatConnectionToSave.save();
        notify = {
          senderID: chatConnectionToSave.entityID,
          addresseeID: chatConnectionToSave.adminID,
          chatConnectionId: rta.id,
        };
        await notificationsServices.generateNotification(notify);
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async sendInvitationUser(body: any) {
    try {
      let validateExist, rta, notify;
      validateExist = await this.searchIfIExistInARoom(body);
      if (validateExist) {
        if (validateExist.sendRequest) {
          rta = ConstantsRS.I_ALREADY_SEND_REQUEST;
        } else {
          if (validateExist.sendInvitation) {
            if (validateExist.isMember) {
              rta = ConstantsRS.YOUR_APPLICATION_HAS_ALREADY_BEEN_ACCEPTED;
            } else {
              rta = ConstantsRS.I_ALREADY_SEND_REQUEST;
            }
          } else {
            let resend = await chatConnectionModel.findOneAndUpdate({_id:validateExist.id},{sendInvitation: true, cancelRequest: false},{new:true})
            if (resend) {
              notify = {
                senderID: resend.adminID,
                addresseeID: resend.entityID,
                chatConnectionId: validateExist.id,
              };
              await notificationsServices.generateNotification(notify);
            }
            rta = resend
          } 
        }
      } else {
        const chatConnectionToSave = new chatConnectionModel(body);
        chatConnectionToSave.sendInvitation = true;
        chatConnectionToSave.cancelRequest = false;
        rta = await chatConnectionToSave.save();
        notify = {
          senderID: chatConnectionToSave.adminID,
          addresseeID: chatConnectionToSave.entityID,
          chatConnectionId: rta.id,
        };
        await notificationsServices.generateNotification(notify);
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async acceptRequest(body: any) {
    try {
      let validateExist, rta, notify;
      validateExist = await this.searchIfIExistInARoom(body);
      if (validateExist) {
        rta = await chatConnectionModel.findOneAndUpdate(
          { _id: validateExist.id },
          { isMember: true, cancelRequest: false },
          { new: true }
        );
        notify = {
          senderID: rta.entityID,
          addresseeID: rta.adminID,
          chatConnectionId: rta.id,
        };
        await notificationsServices.generateNotification(notify);
        let addmember = {
          chatRoomID: body.chatID,
          entityID: body.entityID,
        };
        await chatRoomsSevices.addMemberToChatRoom(addmember);
      } else {
        rta = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async cancelRequest(body: any) {
    try {
      let validateExist, rta, notify;
      validateExist = await this.searchIfIExistInARoom(body);
      if (validateExist) {
        const chatConnectionToAccept = new chatConnectionModel(validateExist);
        chatConnectionToAccept.isMember = false;
        chatConnectionToAccept.sendRequest = false;
        chatConnectionToAccept.sendInvitation = false;
        chatConnectionToAccept.cancelRequest = true;
        rta = await chatConnectionModel.findOneAndUpdate(
          { _id: validateExist.id },
          chatConnectionToAccept,
          { new: true }
        );
      } else {
        rta = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomRequests(body: any) {
    try {
      let rta, getRequestReturn:any = [];
      const getRequest = await chatConnectionModel
        .find({  
          $and: [{ chatID: body.chatID }, { sendRequest: true }, {isMember: false}
          ]})
        .populate({
          path: "chatID",
          model: "ChatsRooms",
          match: { isEnabled: true },
          populate: {
            path: "chatCategoriesID",
            model: "ChatCategories",
          },
        });
        console.log(getRequest);
        
      if (getRequest) {
        
        for await (let data of getRequest){
          let getRequestiter = new chatConnectionModel(data)
          getRequestiter.infoAdmin = await similarServices.identifyUserBrandOrCommunity(data.adminID)
          getRequestiter.infoEntity = await similarServices.identifyUserBrandOrCommunity(data.entityID)
          getRequestReturn.push(getRequestiter)
        }
      }
      getRequestReturn.length > 0 ? (rta = getRequestReturn) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomInvitations(body: any) {
    try {
      let rta;
      const getRequest = await chatConnectionModel
        .find({
          $and: [{ entityID: body.entityID }, { sendInvitation: true }, {isMember: false}
          ]})
        .populate({
          path: "chatID",
          model: "ChatsRooms",
          match: { isEnabled: true },
          populate: {
            path: "chatCategoriesID",
            model: "ChatCategories",
          },
        });
      getRequest ? (rta = getRequest) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteConnection(body:any){
    try {
      let rta
      const deleteConnection = await chatConnectionModel.findOneAndDelete({
        entityID: body.entityID,
        chatID: body.chatID,
        adminID: body.adminID
      })
      deleteConnection ? rta = deleteConnection : rta
      return rta
    } catch (error) {
      console.log(error);      
    }
  }

  public async getConnectionByRoomaAndUser(body:any){
    try {
      let rta
      const getConnection = chatConnectionModel.findOne({ $and:[{chatID: body.chatRoomID}, { entityID: body.entityID}]})
      getConnection ? rta = getConnection :rta
      return rta
    } catch (error) {
      console.log(error);      
    }
  }

  public async getConnectionByRoomaAndUserSearch(chatRoomID:any, entityID:any){
    try {
      let rta
      const getConnection = chatConnectionModel.findOne({ $and:[{chatID: chatRoomID}, { entityID: entityID}]})
      getConnection ? rta = getConnection :rta
      return rta
    } catch (error) {
      console.log(error);      
    }
  }

  public async deleteManyConnection(body:any){
    try {
      const deleteConnection = await chatConnectionModel.deleteMany({ chatID: body.chatRoomId });
      return deleteConnection
    } catch (error) {
      console.log(error);      
    }
  }
}

export const chatConnectionServices = new ChatConnectionServices();
