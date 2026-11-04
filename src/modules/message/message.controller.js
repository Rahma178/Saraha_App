
import { Router } from "express";
import * as MS from "./message.service.js"
import { multerLocal } from './../../common/middleware/multer.js';
import { Multer_Enum } from "../../common/enum/multer.enum.js";
import { validation } from './../../common/middleware/validation.js';
import * as MV from './message.validation.js';
import { authentication } from "../../common/middleware/authentication.js";

const messageRouter = Router({strict:true , caseSensitive:true})


messageRouter.post("/",
    authentication,
    multerLocal({
        customPath: "messages",
        customTypes: Multer_Enum.images
    }).array("attachments", 3),
    validation(MV.createMessageSchema),
    MS.createMessage)

messageRouter.get("/getMessages" ,authentication, MS.getMessages )    
messageRouter.get("/getMessages/:id",authentication , MS.getMessageById )   
messageRouter.get("/deleteMessage/:id",authentication , MS.deleteMessage )   
messageRouter.post("/requestIdentity/:messageId", authentication, MS.requestSenderIdentity);
messageRouter.get("/requests", authentication, MS.getRequests);
messageRouter.patch("/respondRequest/:requestId", authentication, MS.respondToRequest);
messageRouter.post("/chat/:conversationId", authentication, MS.sendChatMessage);
messageRouter.get("/chat/:conversationId", authentication, MS.getConversationMessages);


export default messageRouter