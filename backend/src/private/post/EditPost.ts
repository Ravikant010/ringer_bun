import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel } from "../../db/schema";

export const EditPost = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


EditPost.post("/edit/post", async({body, request, cookie:{secret}, jwt, set,})=>{
 //@ts-ignore
 const isJwt = await jwt.verify(secret.get("_value"))
 if(!isJwt)
 {set.status = 401
 return ({data: "unauthorized", })
 }

 //@ts-ignore
 const {post_id, content} = body
 if(post_id && content){
    const post = await PostModel.findById(post_id)
    if(post){
    post.content = content
    await post.save()
    set.status =200 
    return {
data: post
    }
    }

 }
}
)