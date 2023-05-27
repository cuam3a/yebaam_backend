import { ConstantsRS } from "../../utils/constants";
import Server from "../../app";
import { Socket } from "socket.io";
import socketIO from "socket.io";
import { similarServices } from "../similarservices/similar.services";
import { awsServiceS3 } from "../aws/aws.services";
import { notificationsServices } from "../notifications/notifications.services";
import { chatConnectionServices } from './chatConnection.services';
const chatRoomsModel = require("../../models/chats/ChatRooms.model");
const chatCategoriesModel = require("../../models/chats/ChatCategories.model");

class ChatRoomsSevices {
  public async createChatRoom(body: any, files: any) {
    try {
      let fileSaved, rta, mem:any = [];
      const validateName = await this.getChatRoomByName(body);
      if (!validateName) {
        if (files != undefined) {
          if (files.files) {
            const file = files.files;
            const objSaveFile = {
              entityId: body.adminID,
              file,
            };
            fileSaved = await awsServiceS3.UploadFile(objSaveFile);
          }
        }
        const chatToSave = new chatRoomsModel(body);
        const server = Server.instance;
        let socketIDRoom = await server.io.emit("create-room", body.name);
  /*       console.log("socketid de la sala", Object.keys(socketIDRoom.sockets)[0]); */
        if (socketIDRoom) {
          chatToSave.socketIDRoom = Object.keys(socketIDRoom.sockets)[0];
          const admin = await similarServices.identifyUserBrandOrCommunity(
            chatToSave.adminID
          );
          chatToSave.typeAdmin = admin.type;
          chatToSave.profilePicture = fileSaved;
          chatToSave.members = []
          rta = await chatToSave.save();
          let notify, invitation;
          if (body.members != undefined && body.members != null && body.members.length > 0) {
            let mem
            if (Array.isArray(body.members)) {
              mem = body.members
            }else{
              mem = Array.of(body.members)
            }
            for await (let idMember of mem) {
              invitation = {
                adminID: chatToSave.adminID,
                entityID: idMember,
                chatID: rta.id,
              };
              await chatConnectionServices.sendInvitationUser(invitation);
            }
          }
        }
      }else{
        rta = ConstantsRS.THIS_NAME_ALREADY_EXISTS
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAllChatRooms(body:any) {
    try {
      let rta, rooms:any = [], roomsFilter:any = [];
      const getAll = await chatRoomsModel
        .find({$and: [{ members: { $nin: [body.entityID] } }, { isEnabled: true }]})
        .populate("chatCategoriesID");
      for await(let room of getAll){
        let bodyForConnection = {chatRoomID: room.id, entityID:body.entityID}
        const validateExistP = await chatConnectionServices.getConnectionByRoomaAndUser(bodyForConnection)
        if (validateExistP) {
          const chatRoom = new chatRoomsModel(room)
          if (validateExistP.isMember == false && validateExistP.sendRequest == true) {
            chatRoom.stateRequest = 0
            rooms.push(chatRoom)
          }else if(validateExistP.isMember == false && validateExistP.sendInvitation == true){
            chatRoom.stateRequest = 1
            rooms.push(chatRoom)
          }
        } else {
          rooms.push(room)
        }
      }
      if (rooms.length > 0) {
        roomsFilter = rooms.filter((x:any) => x.privacity != 1)
      }
      roomsFilter ? (rta = roomsFilter) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomsByAdminID(body: any) {
    try {
      let rta;
      const getAll = await chatRoomsModel
        .find({
          adminID: body.adminID,
          isEnabled: true,
        })
        .populate("chatCategoriesID")
        .sort("-creationDate");
      getAll ? (rta = getAll) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomByID(body: any) {
    try {
      let rta;
      const getAll = await chatRoomsModel
        .findOne({
          _id: body.chatRoomID,
          isEnabled: true,
        })
        .populate("chatCategoriesID");
      getAll ? rta = getAll : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomByName(body: any) {
    try {
      let rta;
      const getAll = await chatRoomsModel.findOne({
        name: body.name,
        isEnabled: true,
      });
      getAll ? rta = getAll : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateChatRoom(body: any, files: any) {
    try {
      let fileSaved, rta, dataToUpdate;
      const validateName = await this.getChatRoomByName(body);
      if (!validateName || validateName.id == body.chatRoomID) {
        if (files != undefined) {
          if (files.files) {
            const file = files.files;
            const objSaveFile = {
              entityId: body.id,
              file,
            };
            fileSaved = await awsServiceS3.UploadFile(objSaveFile);
          }
        }
        if (fileSaved) {
          dataToUpdate = {
            ...body,
            profilePicture: fileSaved,
          };
        } else {
          dataToUpdate = body;
        }
        const roomUpdate = await chatRoomsModel.findOneAndUpdate(
          { _id: body.chatRoomID },
          dataToUpdate,
          { new: true }
        );
        roomUpdate ? (rta = roomUpdate) : rta;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getMembersOfChatRoomID(body: any) {
    try {
      let members:any = [];
      const getChatRoom = await this.getChatRoomByID({ chatRoomID: body.chatRoomID });
      if (getChatRoom) {
        if (getChatRoom.members.length > 0) {
          for await (let ids of getChatRoom.members) {
            if (ids != null || ids != " ") {
              const member = await similarServices.identifyUserBrandOrCommunity(ids);
              members.push(member)
            }
          }
        }
      }
      return members;
    } catch (error) {
      console.log(error);
    }
  }

  public async addMemberToChatRoom(body: any) {
    try {
      let rta;
      const getChatRoom = await this.getChatRoomByID({ chatRoomID: body.chatRoomID });
      let validateExist = getChatRoom.members.find(
        (x: string) => x == body.entityID
      );
      if (!validateExist) {
        const chatRoom = new chatRoomsModel(getChatRoom);
        chatRoom.members.push(body.entityID);
        if (chatRoom.members.length <= chatRoom.numberOfMembers) {
          const updateChatRomm = await chatRoomsModel.findOneAndUpdate(
            { _id: getChatRoom.id },
            chatRoom,
            { new: true }
          );
          updateChatRomm ? (rta = updateChatRomm) : rta;
        } else {
          rta = ConstantsRS.EXCEEDS_THE_LIMIT_OF_MEMBERS;
        }
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async addMembersToChatRoom(body: any) {
    try {
      let rta, validateExist, getInviations: any = [];
      const getChatRoom = await this.getChatRoomByID({ chatRoomID: body.chatRoomID });
      if (getChatRoom.members.length < getChatRoom.numberOfMembers) {
        for await (let id of body.members){
          validateExist = getChatRoom.members.find((x: string) => x == id);
          if (!validateExist) {
            let notify = {
              senderID: getChatRoom.adminID,
              addresseeID: id,
              chatConnectionId: getChatRoom.id,
            };
            let invitation = {
              adminID: getChatRoom.adminID,
              entityID: id,
              chatID: getChatRoom.id,
            };
            const invitations = await chatConnectionServices.sendInvitationUser(invitation);
            getInviations.push(invitations)
            await notificationsServices.generateNotification(notify);
          }
        }
        rta = getInviations
      }else {
        rta = ConstantsRS.EXCEEDS_THE_LIMIT_OF_MEMBERS;
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteMemberToChatRoom(body: any) {
    try {
      let rta;
      const getChatRoom = await this.getChatRoomByID({ chatRoomID: body.chatRoomID });
      if (getChatRoom.adminID == body.entityID) {
        rta = await this.deleteChatRoom({ chatRoomID: getChatRoom.id });
      } else {
        let validateExist = getChatRoom.members.find(
          (x: string) => x == body.entityID
        );
        if (validateExist) {
          const chatRoom = new chatRoomsModel(getChatRoom);
          let newArray = chatRoom.members.filter(
            (x: string) => x != body.entityID
          );
          chatRoom.members = newArray;
          const updateChatRomm = await chatRoomsModel.findOneAndUpdate(
            { _id: getChatRoom.id },
            chatRoom,
            { new: true }
          );
          updateChatRomm ? (rta = updateChatRomm) : rta;
          let bodydel = {
            chatID: body.chatRoomID,
            entityID: body.entityID,
          };
          await chatConnectionServices.cancelRequest(bodydel);
        }
      }
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomsIBelong(body: any) {
    try {
      let rta;
      const getChatRooms = await chatRoomsModel
        .find({
          $and: [{ isEnabled: true }, { members: { $in: [body.entityID] } }],
        })
        .populate('chatCategoriesID')
        .sort("name");
      getChatRooms ? (rta = getChatRooms) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteChatRoom(body: any) {
    try {
      let rta;
      const deleteRoom = await chatRoomsModel.findOneAndUpdate(
        { _id: body.chatRoomID },
        { isEnabled: false },
        { new: true }
      );
      deleteRoom ? (rta = deleteRoom) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteAdminChatRoom(body: any) {
    try {
      let rta;
      await chatConnectionServices.deleteManyConnection({chatRoomId:body.chatRoomID})
      const deleteRoom = await chatRoomsModel.findOneAndDelete(
        { _id: body.chatRoomID },
        { new: true }
      );
      deleteRoom ? (rta = deleteRoom) : rta;
      return rta;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomsByCategoryID(body:any){
    try {
      let chatRooms:any = [], chatRoomsFilter:any = []
      const getChatRooms = await chatRoomsModel.find({
        $and:[{chatCategoriesID:body.chatCategoriesID},{isEnabled:true}]}).populate('chatCategoriesID')
        getChatRooms.forEach((room:any) => {
          if (room.members.length < room.numberOfMembers) {
            if (room.adminID != body.entityID) {
              chatRooms.push(room)
            }
          }
        });
        if (chatRooms.length > 0) {
          chatRoomsFilter = chatRooms.filter((x:any) => x.privacity != 1)
        }
        return chatRoomsFilter
    } catch (error) {
      console.log(error);      
    }
  }

  public async searchRoomsByNameAndCategoryEnabled(bodySearch: any) {

    let { limit, nextSkip, skip, search } = bodySearch;
    let results, roomsFilter:any = [], categoryFilter:any = []

    if (!limit) {
        limit = ConstantsRS.PACKAGE_LIMIT;
    }

    if (!search) limit = 5;

    if (bodySearch.categoryID != undefined) {
        let rooms = await chatRoomsModel.find({
            $and:[{name: { $regex: `.*${search}`, $options: "i" } },
            {chatCategoriesID:bodySearch.categoryID},
            {isEnabled:true}]                 
        })
        .limit(limit).skip(skip);
        if (rooms.length) {
          results = rooms.filter((x:any) => x.privacity != 1)
        }
    }else{
        const resultsRooms = await chatRoomsModel.find({ 
            $and:[{name: { $regex: `.*${search}`, $options: "i" }},{isEnabled:true}]
        })
        .limit(limit).skip(skip);

        if (resultsRooms) {
          roomsFilter = resultsRooms.filter((x:any) => x.privacity != 1)
        }

        const resultsCategories = await chatCategoriesModel.find({ 
            $and:[{name: { $regex: `.*${search}`, $options: "i" }},{isEnabled:true}]
        })
        .limit(limit).skip(skip);

        if (resultsCategories) {
          categoryFilter = resultsCategories.filter((x:any) => x.privacity != 1)
        }

        results = {
            rooms: roomsFilter,
            categories: categoryFilter
        }
    }

    nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : ( limit ? limit :ConstantsRS.PACKAGE_LIMIT);

    return { results, nextSkip };
  }

  public async changeState(obj: any, socketID: String) {
    try {
      const update = await chatRoomsModel.findOneAndUpdate({_id:obj},{socketIDRoom:socketID},{new:true})
      return update;
    } catch (error) {
      console.log(error);
    }
  }

  public async getChatRoomsByCategoryIdForDelete(body:any){
    try {
      const getChatRooms = await chatRoomsModel.find({
        $and:[{chatCategoriesID:body.chatCategoriesID},{isEnabled:true}]})
        return getChatRooms
    } catch (error) {
      console.log(error);      
    }
  }
  
}

export const chatRoomsSevices = new ChatRoomsSevices();
