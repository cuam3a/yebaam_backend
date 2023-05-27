const ConversationListModel = require('../../models/chats/ConversationLists.model')
var _ = require("lodash");

class ConversationListsServices {
    public async createConversationList(body: any) {
        try {
            const validateList = await this.validateConversationListExist(body)
            if (validateList) {
                const updateConversationList = await ConversationListModel.findOneAndUpdate({ _id: validateList.id }, { lastMessage: body.lastMessage, doYouSeeTheConversation: false }, { new: true })
                return updateConversationList
            } else {
                const saveConversationList = new ConversationListModel(body)
                const saveCL = saveConversationList.save()
                return saveCL
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async validateConversationListExist(body: any) {
        try {
            const conversationList = await ConversationListModel.findOne(
                {
                    $or: [
                        {
                            $and: [
                                { firstId: body.firstId },
                                { secondId: body.secondId }
                            ]
                        },
                        {
                            $and: [
                                { firstId: body.secondId },
                                { secondId: body.firstId }
                            ]
                        }
                    ]
                }
            )

            return conversationList
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getConversationsListById(body: any) {
        try {
            let getCL, ids: any = [];
            getCL = await ConversationListModel.find(
                {
                    $or: [
                        { firstId: body.entityId },
                        { secondId: body.entityId }
                    ]
                }
            )
            if (getCL.length > 0) {
                let getdata = await this.separateIDS(getCL, body.entityId)
                if (getdata.length > 0) {
                    ids = _.orderBy(getdata, ["lastMessage.creationDate"], ["desc"]);
                }
            }
            return ids
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async separateIDS(conversations: any, entityId: any) {
        let usersIDS: any = []
        conversations.filter((obj: any) => {
            if (obj.firstId == entityId) {
                if (obj.infoSecond.type != undefined) {
                    usersIDS.push({ conversationId: obj.id, id: obj.secondId, lastMessage: obj.lastMessage, data: obj.infoSecond, lastMessageDate: obj.lastMessageDate })
                } else {
                    let picture = null
                    if (obj.infoSecond != undefined) {
                        if (obj.infoSecond.profilePicture != undefined) {
                            if (typeof (obj.infoSecond.profilePicture) === 'string') {
                                picture = obj.infoSecond.profilePicture
                            } else {
                                if (obj.infoSecond.profilePicture.url != undefined) {
                                    picture = obj.infoSecond.profilePicture.url
                                } 
                            }                           
                        }
                    }
                    let objModify = {
                        ...obj.infoSecond, profilePicture: picture
                    }
                    usersIDS.push({ conversationId: obj.id, id: obj.secondId, lastMessage: obj.lastMessage, data: objModify, lastMessageDate: obj.lastMessageDate })
                }
            } else if (obj.secondId == entityId) {
                if (obj.infoFirst.type != undefined) {
                    usersIDS.push({ conversationId: obj.id, id: obj.firstId, lastMessage: obj.lastMessage, data: obj.infoFirst, lastMessageDate: obj.lastMessageDate })
                } else {
                    let picture = null
                    if (obj.infoFirst != undefined) {
                        if (obj.infoFirst.profilePicture != undefined) {
                            if (typeof (obj.infoFirst.profilePicture) === 'string') {
                                picture = obj.infoFirst.profilePicture
                            } else {
                                if (obj.infoFirst.profilePicture.url != undefined) {
                                    picture = obj.infoFirst.profilePicture.url
                                }                                
                            } 
                        }
                    }
                    let objModify = {
                        ...obj.infoFirst, profilePicture: picture
                    }
                    usersIDS.push({ conversationId: obj.id, id: obj.firstId, lastMessage: obj.lastMessage, data: objModify, lastMessageDate: obj.lastMessageDate })
                }
            }
        })
        return usersIDS
    }

    public async getConversationsListByIdWeb(body: any) {
        try {
            let getCL, ids: any = [];
            getCL = await ConversationListModel.find(
                {
                    $or: [
                        { firstId: body.entityId },
                        { secondId: body.entityId }
                    ]
                }
            )
            if (getCL.length > 0) {
                let getdata = await this.separateIDSWeb(getCL, body.entityId)
                if (getdata.length > 0) {
                    ids = _.orderBy(getdata, ["lastMessage.creationDate"], ["desc"]);
                }
            }
            return ids
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async separateIDSWeb(conversations: any, entityId: any) {
        let usersIDS: any = []
        conversations.filter((obj: any) => {
            if (obj.firstId == entityId) {
                if (obj.infoSecond.type != undefined) {
                    usersIDS.push({ conversationId: obj, id: obj.secondId, lastMessage: obj.lastMessage, data: obj.infoSecond, lastMessageDate: obj.lastMessageDate })
                } else {
                    let picture = null
                    if (obj.infoFirst != undefined) {
                        if (obj.infoFirst.profilePicture != undefined) {
                            if (typeof (obj.infoFirst.profilePicture) === 'string') {
                                picture = obj.infoFirst.profilePicture
                            } else {
                                if (obj.infoSecond.profilePicture.url != undefined) {
                                    picture = obj.infoSecond.profilePicture.url
                                }
                            } 
                        }
                    }
                    let objModify = {
                        ...obj.infoSecond, profilePicture: picture
                    }
                    usersIDS.push({ conversationId: obj, id: obj.secondId, lastMessage: obj.lastMessage, data: objModify, lastMessageDate: obj.lastMessageDate })
                }
            } else if (obj.secondId == entityId) {
                if (obj.infoSecond.type != undefined) {
                    usersIDS.push({ conversationId: obj, id: obj.firstId, lastMessage: obj.lastMessage, data: obj.infoFirst, lastMessageDate: obj.lastMessageDate })
                } else {
                    let picture = null
                    if (obj.infoFirst != undefined) {
                        if (obj.infoFirst.profilePicture != undefined) {
                            if (typeof (obj.infoFirst.profilePicture) === 'string') {
                                picture = obj.infoFirst.profilePicture
                            } else {
                                if (obj.infoSecond.profilePicture.url != undefined) {
                                    picture = obj.infoFirst.profilePicture.url
                                }
                            } 
                        }
                    }
                    let objModify = {
                        ...obj.infoSecond, profilePicture: picture
                    }
                    usersIDS.push({ conversationId: obj, id: obj.firstId, lastMessage: obj.lastMessage, data: objModify, lastMessageDate: obj.lastMessageDate })
                }
            }
        })
        return usersIDS
    }

    public async deleteConversation(body: any) {
        try {
            let rta
            const deleteConversation = await ConversationListModel.findOneAndDelete({ _id: body.conversationId })
            return deleteConversation ? rta = deleteConversation : rta
        } catch (error) {
            console.log(error);
        }
    }

    public async viewConversation(body: any) {
        try {
            let rta
            const viewConversation = await ConversationListModel.findOneAndUpdate({ _id: body.conversationId }, { doYouSeeTheConversation: true }, { new: true })
            return viewConversation
        } catch (error) {
            console.log(error);
        }
    }
}

export const conversationListsServices = new ConversationListsServices();