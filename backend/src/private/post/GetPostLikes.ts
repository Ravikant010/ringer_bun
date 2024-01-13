import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel } from "../../db/schema";

export const LikesPost = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


LikesPost.post("/likes/post", async({body, request, cookie:{secret}, jwt, set,})=>{
 //@ts-ignore
 const isJwt = await jwt.verify(secret.get("_value"))
 if(!isJwt)
 {set.status = 401
 return ({data: "unauthorized", })
 }
 //@ts-ignore
const {post_id}  = body
if(post_id){
    const {likes} = await PostModel.findById(post_id).populate("likes") as {
        likes: []
    }
    return ({data: likes})
}

set.status = 400
return ({data: null})
})
