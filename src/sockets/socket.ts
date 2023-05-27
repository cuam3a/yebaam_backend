import { Socket } from "socket.io";
import socketIO from "socket.io";
import { chatsSevices } from "../services/chats/chats.services";
import { messagesServices } from "../services/chats/messages.services";
import { similarServices } from "../services/similarservices/similar.services";
import { ConstantsRS } from "../utils/constants";
import { chatRoomsSevices } from '../services/chats/chatRooms.services';

//Config user
export const configUser = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("configure-user", (payload, callback: Function) => {
    //io.emit('usario con')
    callback({
      ok: true,
      message: `Usuario ${payload.name} configurado`,
    });
  });
};

export const userConnect = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("user-connect", async (payload, callback: Function) => {
    let identify = await similarServices.identifyUserBrandOrCommunity(payload);
    let changeStatus = await similarServices.changeState(
      identify,
      true,
      cliente.id
    );

    return callback({
      success: changeStatus ? true : false,
      message: changeStatus
        ? `Usuario ${identify.name} Inicio sesión`
        : `No se puede Iniciar sesión`,
      data: changeStatus ? changeStatus : [],
    });
    //io.emit('usario conectado')
  });
};

export const chatConnect = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("chat-connect", async (payload:any, callback: Function) => {    
    const room = await chatRoomsSevices.getChatRoomByID({chatRoomID:payload.chatRoomID})
    if (room) {
      const userConnect = await similarServices.identifyUserBrandOrCommunityMessages(payload.idUser) 
      const payload2 = {
        bodyMessage: userConnect,
      };
      if(io.sockets.sockets[room.socketIDRoom]!=undefined){
        cliente.join(room.socketIDRoom)
        cliente.broadcast.to(room.socketIDRoom).emit('private-message-room', payload2)
      }else{
        let changeStatus = await chatRoomsSevices.changeState(
          payload.chatRoomID,
          cliente.id
        );
        cliente.join(changeStatus.socketIDRoom)
        cliente.broadcast.to(room.socketIDRoom).emit('private-message-room', payload2)
      }
    }
    let changeStatus = true    

    return callback({
      success: changeStatus ? true : false,
      data: changeStatus ? changeStatus : [],
    });
    //io.emit('usario conectado')
  });
};

export const userDisconnect = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("user-disconnect", async (payload, callback: Function) => {
    let identify = await similarServices.identifyUserBrandOrCommunity(payload);
    let changeStatus = await similarServices.changeState(identify, false, "");

    return callback({
      success: changeStatus ? true : false,
      message: changeStatus ? `Usuario ${identify.name} se desconecto` : `nada`,
      data: changeStatus ? changeStatus : [],
    });
  });
};

export const disconnect = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("disconnect", () => {});
};

/* export const message = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("private-message", async (payload: any, callback: Function) => {
    await cliente.in(payload).emit('private-message', payload)
    return callback({
      success: true ,
      message: payload,
      data: [],
    });
  });
}; */

/* export const messageRoom = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("private-message-room", async (payload: any, callback: Function) => {
    await cliente.broadcast.to(payload).emit('private-message-room', payload)
    return callback({
      success: true ,
      message: payload,
      data: [],
    });
  });
}; */

export const notification = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("notification", async (payload: string, callback: Function) => {
    cliente.in(payload).emit('notification', payload)
    return callback({
      success: true ,
      message: payload,
      data: [],
    });
  });
};

export const createChatRoom = async (cliente: Socket, io: socketIO.Server) => {
  try {
    cliente.on("create-room", async (payload: string, callback: Function) => {
      cliente.join(payload);
      let listRooms = io.sockets.adapter.rooms[payload].sockets;
      let socketIDRoom = Object.keys(listRooms)[0];

      return callback({
        success: socketIDRoom ? true : false,
        data: socketIDRoom ? socketIDRoom : [],
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const createChatRoom2 = async (cliente: Socket, io: socketIO.Server) => {
  try {
    cliente.on("create-room3", async (payload: string, callback: Function) => {
      cliente.join(payload);
      cliente.broadcast.to(payload).emit("hello admin");
      let listRooms = io.sockets.adapter.rooms[payload].sockets;
      let jona = Object.keys(listRooms)[0];
      console.log(listRooms);
      console.log("key: ", jona);

      return callback({
        success: listRooms ? true : false,
        message: listRooms ? `Usuario ` : `nada`,
        data: listRooms ? listRooms : [],
      });
    });
  } catch (error) {
    console.log(error);
  }
};
