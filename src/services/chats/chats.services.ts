import { ConstantsRS } from '../../utils/constants';
import Server from '../../app';
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { similarServices } from '../similarservices/similar.services';
const chatsModel = require('../../models/Chats.model')

class ChatsSevices {
    public async createChatRoom(body:any){
        try {
            let rta
            const chatToSave = new chatsModel(body)
            if (chatToSave.isRoom) {
                const server = Server.instance;
                let socketIDRoom = await server.io.emit('create-room', body.name)
                console.log('socketid de la sala',Object.keys(socketIDRoom.sockets)[0]);
                if (socketIDRoom) {
                    chatToSave.socketIDRoom = socketIDRoom
                    const admin = await similarServices.identifyUserBrandOrCommunity(chatToSave.adminID)
                    chatToSave.typeAdmin = admin.type
                    /* let socketsIDS = await similarServices.socketsUsers(chatToSave.members);
                    console.log(socketsIDS); */
                    rta =  await chatToSave.save()
                } else {
                    
                }
            }else{

            }
            return rta
        } catch (error) {
            console.log(error);            
        }
    }

    public async getChatByUserMarkOrCommunity(id:string){
        try {
            const getChat = await chatsModel.findOne({ members: { $in: [id] } })
            return getChat
        } catch (error) {
            console.log(error);
            
        }
    }
    public async getChatByID(id:string){
        try {
            const getChat = await chatsModel.findOne({_id: id})
            .populate({
                path: 'reactionsIDS',
                populate: {
                    path: 'reactionID',
                    model: 'Reactions'
                }
            })
            return getChat
        } catch (error) {
            console.log(error);
            
        }
    }
}

export const chatsSevices = new ChatsSevices();