import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { Message, PostModel, UserModel } from "../db/schema";
import fs from "fs"
export const GetUserChat = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


GetUserChat.get("chat/:username", async ({ body, request, cookie: { secret, id }, jwt, set, store , params: {username}}) => {
    // console.log("req came", user_id);
    try {
        //@ts-ignore
        const isJwt = await jwt.verify(secret.get());
        const userId= isJwt?.id;
        const sender = await UserModel.findById(userId).select("username")

        if (!isJwt && userId) {
            set.status = 401;
            return { data: "unauthorized" };
        }
 if(username)
 {
    const chat  = await Message.findOne({sender: sender?.username, receiver: username})
    console.log(chat)
set.status = 200
return chat
 }
}
catch(err){
    console.log(err)
}
})
