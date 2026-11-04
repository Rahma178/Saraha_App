import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId,
        ref: "message",
        required: true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true,
    strictQuery: true,
    strict: true
});

const requestModel = mongoose.models.Request || mongoose.model("Request", requestSchema);
export default requestModel;