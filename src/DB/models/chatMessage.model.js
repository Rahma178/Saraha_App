import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    strictQuery: true,
    strict: true
});

const chatMessageModel = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
export default chatMessageModel;