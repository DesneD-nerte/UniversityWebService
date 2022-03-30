import mongoose from "mongoose";
import Chat from "../models/Chat";
import User from "../models/User";
import { Message } from "../types";
//import { Message } from '../models/Message';

export default class MessagesRepository {

    static async getMessages(myId: mongoose.Types.ObjectId, id: mongoose.Types.ObjectId) {
        return await Chat.aggregate([
            {
                $match: {
                    $and: [
                      {users: myId},
                      {users: id}
                    ]
                }
             },
            {    
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $unwind: {
                    path: "$messages"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'messages.user',
                    foreignField: '_id',
                    as: 'messages.user'
                }
            },
            {
                $unwind: {
                    path: '$messages.user'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    root: { $mergeObjects: '$$ROOT' },
                    messages: { $push: '$messages' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ['$root', '$$ROOT'] }
                }
            },
            {
                $project: { root: 0 }
            }
        ]
        )
    }

    static async checkExistingChatRoomMessages(myId: mongoose.Types.ObjectId, id: mongoose.Types.ObjectId) {
        return await Chat.aggregate([
            {
                $match: {
                    $and: [
                      {users: myId},
                      {users: id}
                    ]
                }
            },
        ])
    }

    static async getLastMessage(myId: mongoose.Types.ObjectId) {
        //return await Chat.find({'users': myId}, {'lastMessage': {$slice: ['$messages', -1]}, 'users': 1 });
        return await Chat.aggregate([
            {
                $match: {
                    'users': myId
                }
            },
            {
                $project: {
                    'users': 1,
                    'lastMessage': {$slice: ['$messages', -1]}
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $unwind: {
                    path: '$lastMessage'
                }
            }, 
            {
                $lookup: {
                    from: 'users',
                    localField: 'lastMessage.user',
                    foreignField: '_id',
                    as: 'lastMessage.user'
                }
            },
            {
                $unwind: {
                    path: '$lastMessage.user'
                }
            }
        ])
    }

    static async addMessage(myId: mongoose.Types.ObjectId, id: mongoose.Types.ObjectId, message: Message) {
        console.log(message);

        return await Chat.updateOne({
                users: {$all: [new mongoose.Types.ObjectId(myId), new mongoose.Types.ObjectId(id)]}},
            {
                $push: {messages: {content: message.content, createdAt: new Date (message.createdAt), user: new User(message.user)}}
            }
        )
    }
}