import { ConstantsRS } from '../../utils/constants';
import Server from "../../app";
import { similarServices } from "../similarservices/similar.services";
import { chatRoomsSevices } from "./chatRooms.services";
import { awsServiceS3 } from "../aws/aws.services";
import { conversationListsServices } from './conversationLists.services';
const messageModel = require("../../models/chats/Messages.model");

class MessagesSevices {
  public async sendMessage(body: any, files: any) {
    try {
      const messageToSave = new messageModel(body);
      const addressee = await similarServices.identifyUserBrandOrCommunity(
        messageToSave.addresseeID
      );
      const sender = await similarServices.identifyUserBrandOrCommunityMessages(
        messageToSave.senderID
      );
      const server = Server.instance;
      if (addressee != ConstantsRS.THE_RECORD_DOES_NOT_EXIST) {
        let infoFileUrl: any = [];
        const entityId = body.senderID;
        if (files != undefined) {
          if (files.files.length) {
            //TODO many files
            const file = files.files;
            let filesUplaoded = 0;
            for await (let fileOne of file) {
              if (
                fileOne.mimetype.indexOf("image") >= 0 ||
                fileOne.mimetype.indexOf("video") >= 0 ||
                fileOne.mimetype.indexOf("audio") >= 0
              ) {
                const dataToSave = { entityId, file: fileOne };
                const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                infoFileUrl.push(fileSaved);
                filesUplaoded += 1;
              }
            }
            if (filesUplaoded == file.length) {
              const messageToSave = new messageModel({
                ...body,
                multimedia: infoFileUrl,
                infoSender: sender
              });
              const payload = {
                from: sender,
                bodyMessage: messageToSave,
              };
              await server.io
                .in(addressee.socketID)
                .emit("private-message", payload);
              const messageSaved = await messageToSave.save();
              if (messageSaved) {
                let bodyList ={
                  firstId: messageSaved.senderID,
                  secondId: messageSaved.addresseeID,
                  lastMessage: messageSaved,
                  infoFirst:sender,
                  infoSecond:addressee,
                  lastMessageDate: messageSaved.creationDate
                }
                await conversationListsServices.createConversationList(bodyList)
              }
              return messageSaved;
            }
          } else {
            infoFileUrl.push(
              await awsServiceS3.UploadFile({ entityId, file: files.files })
            );
            const messageToSave = new messageModel({
              ...body,
              multimedia: infoFileUrl,
              infoSender: sender
            });
            const payload = {
              from: sender,
              bodyMessage: messageToSave,
            };
            await server.io
              .in(addressee.socketID)
              .emit("private-message", payload);
            const messageSaved = await messageToSave.save();
            if (messageSaved) {
              let bodyList ={
                firstId: messageSaved.senderID,
                secondId: messageSaved.addresseeID,
                lastMessage: messageSaved,
                infoFirst:sender,
                infoSecond:addressee,
                lastMessageDate: messageSaved.creationDate
              }
              await conversationListsServices.createConversationList(bodyList)
            }
            return messageSaved;
          }
        } else {
          const payload = {
            from: sender,
            bodyMessage: messageToSave,
          };
          await server.io
            .in(addressee.socketID)
            .emit("private-message", payload);
          messageToSave.infoSender = sender
          const messageSaved = await messageToSave.save();
          if (messageSaved) {
            let bodyList ={
              firstId: messageSaved.senderID,
              secondId: messageSaved.addresseeID,
              lastMessage: messageSaved,
              infoFirst:sender,
              infoSecond:addressee,
              lastMessageDate: messageSaved.creationDate
            }
            await conversationListsServices.createConversationList(bodyList)
          }
          return messageSaved;
        }
      } else {
        return ConstantsRS.USER_DOES_NOT_EXIST;
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async sendMessageChatRoom(body: any, files: any) {
    try {
      const getChatRoom = await chatRoomsSevices.getChatRoomByID({
        chatRoomID: body.addresseeID
      });
      const sender = await similarServices.identifyUserBrandOrCommunityMessages(
        body.senderID
      );
      const server = Server.instance;
      if (getChatRoom) {
        let infoFileUrl: any = [];
        const entityId = body.senderID;
        if (files != undefined) {
          if (files.files.length) {
            //TODO many files
            const file = files.files;
            let filesUplaoded = 0;
            for await (let fileOne of file) {
              if (
                fileOne.mimetype.indexOf("image") >= 0 ||
                fileOne.mimetype.indexOf("video") >= 0 ||
                fileOne.mimetype.indexOf("audio") >= 0
              ) {
                const dataToSave = { entityId, file: fileOne };
                const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                infoFileUrl.push(fileSaved);
                filesUplaoded += 1;
              }
            }
            if (filesUplaoded == file.length) {
              const messageToSave = new messageModel({
                ...body,
                multimedia: infoFileUrl,
                infoSender: sender
              });
              const payload = {
                id: sender.id,
                from: sender,
                bodyMessage: messageToSave,
              };
              await server.io
                .in(getChatRoom.socketIDRoom)
                .emit("private-message-room", payload);
              const messageSaved = await messageToSave.save();
              if (messageSaved) {
            let bodyList ={
              firstId: messageSaved.senderID,
              secondId: messageSaved.addresseeID,
              lastMessage: messageSaved,
              infoFirst:sender,
              infoSecond:getChatRoom,
              lastMessageDate: messageSaved.creationDate
            }
            await conversationListsServices.createConversationList(bodyList)
          }
              return messageSaved;
            }
          } else {
            infoFileUrl.push(
              await awsServiceS3.UploadFile({ entityId, file: files.files })
            );
          }
          const messageToSave = new messageModel({
            ...body,
            multimedia: infoFileUrl,
            infoSender: sender
          });
          const payload = {
            id: sender.id,
            from: sender,
            bodyMessage: messageToSave,
          };
          await server.io
            .in(getChatRoom.socketIDRoom)
            .emit("private-message-room", payload);
          const messageSaved = await messageToSave.save();
          if (messageSaved) {
            let bodyList ={
              firstId: messageSaved.senderID,
              secondId: messageSaved.addresseeID,
              lastMessage: messageSaved,
              infoFirst:sender,
              infoSecond:getChatRoom,
              lastMessageDate: messageSaved.creationDate
            }
            await conversationListsServices.createConversationList(bodyList)
          }
          return messageSaved;
        } else {
          const messageToSave = new messageModel(body);
          messageToSave.infoSender = sender
          const payload = {
            id: sender.id,
            from: sender,
            bodyMessage: messageToSave,
          };
          await server.io
            .in(getChatRoom.socketIDRoom)
            .emit("private-message-room", payload);
          const messageSaved = await messageToSave.save();
          if (messageSaved) {
            let bodyList ={
              firstId: messageSaved.senderID,
              secondId: messageSaved.addresseeID,
              lastMessage: messageSaved,
              infoFirst:sender,
              infoSecond:getChatRoom,
              lastMessageDate: messageSaved.creationDate
            }
            await conversationListsServices.createConversationList(bodyList)
          }
          return messageSaved;
        }
      } else {
        return ConstantsRS.ERROR_SENDING_MESSAGE;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* public async getMessagesBychatID(id: string) {
    try {
      const getMessages = await messageModel.find({ chatID: id });
      return getMessages;
    } catch (error) {
      console.log(error);
    }
  } */

  public async getMessagesBychatRoomID(body: any) {
    try {
      let messages;
      const getMessages = await messageModel.find({
        addresseeID: body.chatRoomID
      })
      .populate('responseToMessageId')
        .sort('-creationDate');
      getMessages ? messages = getMessages : messages
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  public async getConversation(body: any) {
    try {
      let getConversations:any = []
      const getConversation = await messageModel.find({
        $or: [
          { $and: [{ senderID: body.firstEnter }, { addresseeID: body.addressee }, { isEnabledSender: true }, { isEnabledAddressee: true }] },
          { $and: [{ senderID: body.addressee }, { addresseeID: body.firstEnter }, { isEnabledSender: true }, { isEnabledAddressee: true }] },
          { $and: [{ senderID: body.firstEnter }, { addresseeID: body.addressee }, { isEnabledSender: true }, { isEnabledAddressee: false }] }
        ]
      }).populate([
        {
          path: 'storyID',
          model: 'Stories',
        }
      ])
      .populate('responseToMessageId')
        .sort('-creationDate')
      getConversation ? getConversations = getConversation : getConversations
      return getConversations
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteConversacion(body:any){
    try {
      let rta
      const getConversation = await this.getConversation(body)
      if (  getConversation.length > 0) {
        for await(let msj of getConversation){
          await messageModel.deleteOne({_id:msj.id})
        }
        rta = await conversationListsServices.deleteConversation({conversationId: body.conversationId})
      } else {
        rta = await conversationListsServices.deleteConversation({conversationId: body.conversationId})
      }
      return rta
    } catch (error) {
      console.log(error);      
    }
  }
}

export const messagesServices = new MessagesSevices();
