import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "../../db/schema";

export const GetUser = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


GetUser.get("/user", async({body, request, cookie:{secret, id}, jwt, set, store})=>{
    console.log(store)
    // console.log("req came", user_id)
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"))
       //@ts-ignore
    const user_id  = id.get("_value")
    console.log(id)
    if(!isJwt)
    {set.status = 401
    return ({data: "unauthorized", })
    }
    if(user_id){
       const user = await  UserModel.findById(user_id)
        return ({data:user})
    }
    set.status = 400
    return ({data: null})
    
})

