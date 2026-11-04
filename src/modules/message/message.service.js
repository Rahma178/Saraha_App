
import chatMessageModel from '../../DB/models/chatMessage.model.js';
import conversationModel from '../../DB/models/conversation.model.js';
import messageModel from '../../DB/models/message.models.js';
import requestModel from '../../DB/models/request.model.js';
import { create, find, findById, findOne } from './../../DB/models/service/db.service.js';
import userModel from './../../DB/models/user.model.js';


// =====================  createMessage  =====================
export const createMessage = async (req, res, next) => {
    const { content, userId } = req.body; 

    if (!content && !req.files?.length) throw new Error("content is required");

    const userExist = await findById({
        model: userModel,
        id: userId
    });
    if (!userExist) throw new Error("user not exist");

    let urls = [];
    if (req?.files?.length) {
        for (const file of req?.files) {
            urls.push(file.path);
        }
    }

    const message = await create({
        model: messageModel,
        data: {
            content,
            attachments: urls,
            receiverId: userId,    
            senderId: req.user._id 
        }
    });

    return res.status(201).json({ message: "Done", message });
};


// ==================== getMessages ====================
export const getMessages = async (req, res, next) => {
    const messages = await find({
        model: messageModel,
        filter: { userId: req.user._id }
    })

    return res.status(200).json({ message: "Donne", data: messages })
}

// ==================== getMessageById ====================
export const getMessageById = async (req, res, next) => {
    const message = await findOne({
        model: messageModel,
        filter: {
            _id: req.params.id,
            userId: req.user._id,
        }
    })
    return res.status(200).json({ message: "Donne", data: message })
}


// ==================== deleteMessage ====================
export const deleteMessage = async (req, res, next) => {
    const message = await deleteOne({
        model: messageModel,
        filter: {
            _id: req.params.id,
            userId: req.user._id,
        }
    })

    return res.status(200).json({ message: "Donne", data: message })
}


// ====================  Request Sender Identity ====================
export const requestSenderIdentity = async (req, res, next) => {
    const { messageId } = req.params;

    const message = await messageModel.findOne({
        _id: messageId,
        userId: req.user._id
    }).select("+senderId");

    if (!message) throw new Error("Message not found or unauthorized");

    const existingRequest = await findOne({
        model: requestModel,
        filter: { messageId }
    });
    if (existingRequest) throw new Error("Request already exists for this message");

    const newRequest = await create({
        model: requestModel,
        data: {
            messageId,
            senderId: message.senderId,
            receiverId: req.user._id,
            status: "pending"
        }
    });

    return res.status(201).json({ message: "Identity request created", data: newRequest });
};



// ====================  Get Requests ====================
export const getRequests = async (req, res, next) => {
    const requests = await find({
        model: requestModel,
        filter: { senderId: req.user._id }
    });

    return res.status(200).json({ message: "Done", data: requests });
};



// ==================== Accept or Reject Request & Create Conversation ====================
export const respondToRequest = async (req, res, next) => {
    const { requestId } = req.params;
    const { action } = req.body; 

    if (!["accepted", "rejected"].includes(action)) {
        throw new Error("Action must be either accepted or rejected");
    }

    const request = await findOne({
        model: requestModel,
        filter: { _id: requestId, senderId: req.user._id, status: "pending" }
    });
    if (!request) throw new Error("Request not found or already processed");

    request.status = action;
    await request.save();

    let conversation = null;
    if (action === "accepted") {
        await messageModel.findByIdAndUpdate(request.messageId, { isSenderRevealed: true });

        conversation = await create({
            model: conversationModel,
            data: {
                messageId: request.messageId,
                participants: [request.senderId, request.receiverId]
            }
        });
    }

    return res.status(200).json({
        message: `Request ${action} successfully`,
        data: { request, conversation }
    });
};


// ==================== Send Message in Conversation ====================
export const sendChatMessage = async (req, res, next) => {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) throw new Error("Message content is required");

    const conversation = await findOne({
        model: conversationModel,
        filter: {
            _id: conversationId,
            participants: req.user._id
        }
    });
    if (!conversation) throw new Error("Conversation not found or unauthorized");

    const message = await create({
        model: chatMessageModel,
        data: {
            conversationId,
            senderId: req.user._id,
            content
        }
    });

    return res.status(201).json({ message: "Done", data: message });
};



// ==================== 7) Get Conversation Messages ====================
export const getConversationMessages = async (req, res, next) => {
    const { conversationId } = req.params;

    const conversation = await findOne({
        model: conversationModel,
        filter: {
            _id: conversationId,
            participants: req.user._id
        }
    });
    if (!conversation) throw new Error("Conversation not found or unauthorized");

    const messages = await find({
        model: chatMessageModel,
        filter: { conversationId }
    });

    return res.status(200).json({ message: "Done", data: messages });
};