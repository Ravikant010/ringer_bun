import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "../../db/schema";

export const DeletePost = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


// DeletePost.delete("/delete/post", async({body, request, cookie:{secret}, jwt, set,})=>{
//     //@ts-ignore
//     const isJwt = await jwt.verify(secret.get())
//     console.log(isJwt)
//     if(!isJwt)
//     {set.status = 401
//     return ({data: "unauthorized", })
//     }
//     //@ts-ignore
// const { post_id}=  body
// if(post_id ){
//     try{
//    await PostModel.findByIdAndRemove(post_id)
//    console.log(isJwt?.id)
//    await UserModel.findByIdAndUpdate(isJwt?.id, {
//     $pull: { posts: post_id }
//    })

//    set.status =200
//    return {data: "post deleted"}  
// }
//     catch(Err){
//         set.status === 500
//         return ({data: "error ocurred"})
//     }

// }
// })

DeletePost.delete("/delete/post", async ({ body, request, cookie: { secret }, jwt, set }) => {
    try {
      //@ts-ignore
      const isJwt = await jwt.verify(secret.get());
      console.log(isJwt);
  
      if (!isJwt) {
        set.status = 401;
        return { data: "unauthorized" };
      }
  
      //@ts-ignore
      const { post_id } = body;
  
      if (post_id) {
        try {
          const user = await UserModel.findById(isJwt.id);
  
          if (!user) {
            set.status = 404;
            return { data: "User not found" };
          }
  
          const post = await PostModel.findById(post_id);
  
          if (!post) {
            set.status = 404;
            return { data: "Post not found" };
          }
  
          await PostModel.findByIdAndRemove(post_id);
  
          console.log(isJwt.id);
  
          await UserModel.findByIdAndUpdate(isJwt.id, {
            $pull: { posts: post_id }
          });
  
          set.status = 200;
          return { data: "Post deleted" };
        } catch (error) {
          set.status = 500;
          return { data: "Error occurred" };
        }
      } else {
        set.status = 400; // Bad request
        return { data: "post_id is required" };
      }
    } catch (error) {
      set.status = 401;
      return { data: "unauthorized" };
    }
  });
  