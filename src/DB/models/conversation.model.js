import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId,
        ref: "message",
        required: true
    },
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }]
}, {
    timestamps: true,
    strictQuery: true,
    strict: true
});

const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default conversationModel;