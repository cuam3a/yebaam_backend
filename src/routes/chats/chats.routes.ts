import { Router } from 'express';
import { chatsController } from '../../controllers/chats/chats.controller';
import { messagesController } from '../../controllers/chats/messages.controller';
import { chatCategoriesController } from '../../controllers/chats/chatcategories.controller';
import { chatRoomsController } from '../../controllers/chats/chatrooms.controller';
import { chatConnectionsController } from '../../controllers/chats/chatconnections.controller';

const chatsRoutes: Router = Router();

chatsRoutes.post('/send-message', messagesController.sendMessage);
chatsRoutes.post('/send-message-room', messagesController.sendMessageChatRoom);
chatsRoutes.post('/get-messages-room', messagesController.getMessagesBychatRoomID);
chatsRoutes.post('/get-conversation', messagesController.getConversation);
chatsRoutes.post('/get-conversation-list', messagesController.getConversationList);
chatsRoutes.post('/get-conversation-list-web', messagesController.getConversationListWeb);
chatsRoutes.post('/delete-conversation', messagesController.deleteConversacion);
chatsRoutes.post('/view-conversation', messagesController.viewConversation);

//chat rooms
chatsRoutes.post('/create-room', chatRoomsController.createChatRoom);
chatsRoutes.post('/get-all-rooms', chatRoomsController.getAllChatRooms);
chatsRoutes.post('/get-room-id', chatRoomsController.getChatRoomByID);
chatsRoutes.post('/get-rooms-adminuser', chatRoomsController.getChatRoomsByAdminID);
chatsRoutes.post('/update-room', chatRoomsController.updateChatRoom);
chatsRoutes.post('/get-members-room', chatRoomsController.getMembersOfChatRoomID);
chatsRoutes.post('/add-member-room', chatRoomsController.addMemberToChatRoom);
chatsRoutes.post('/add-many-members-room', chatRoomsController.addMembersToChatRoom);
chatsRoutes.post('/delete-member-room', chatRoomsController.deleteMemberToChatRoom);
chatsRoutes.post('/get-room-i-belong', chatRoomsController.getChatRoomsIBelong);
chatsRoutes.post('/delete-room', chatRoomsController.deleteChatRoom);
chatsRoutes.post('/delete-room-only-admin', chatRoomsController.deleteAdminChatRoom);
chatsRoutes.post('/get-rooms-category-id', chatRoomsController.getChatRoomsByCategoryID);
chatsRoutes.post('/search-rooms-category', chatRoomsController.searchRoomsByNameAndCategoryEnabled);

//chat connections
chatsRoutes.post('/actions', chatConnectionsController.actionsChatRooms);
chatsRoutes.post('/get-requests', chatConnectionsController.getChatRoomRequests);
chatsRoutes.post('/get-invitations', chatConnectionsController.getChatRoomInvitations);
chatsRoutes.post('/delete-connection', chatConnectionsController.deleteConnection);

//categories chats 
chatsRoutes.post('/create-category',chatCategoriesController.createChatCategory)
chatsRoutes.post('/get-all-categories',chatCategoriesController.getAllChatCategories)
chatsRoutes.post('/get-category-id',chatCategoriesController.getChatCategoryById)
chatsRoutes.post('/get-category-name',chatCategoriesController.getChatCategoryByName)
chatsRoutes.post('/update-category',chatCategoriesController.updateChatCategory)
chatsRoutes.post('/delete-category',chatCategoriesController.deleteChatCategoryByID)
chatsRoutes.post('/remove-category',chatCategoriesController.removeChatCategoryByID)

export default chatsRoutes;