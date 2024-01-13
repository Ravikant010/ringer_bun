import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CommentModel, PostModel, UserModel } from "../../db/schema";

export const GetAllComments = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


GetAllComments.get("/get/comments/:postId", async ({ body, request, cookie: { secret }, jwt, set, params: {postId}}) => {
  
      // Verify the JWT token.
      //@ts-ignore
      const isJwt = await jwt.verify(secret.get());
      if (!isJwt) {
        set.status = 401;
        return ({ data: "unauthorized" });
      }
      //@ts-ignore
      if(postId)
      {
        const {comments} = await PostModel.findById(postId).populate("comments") as {
            comments: []
        }
        console.log(comments)
        set.status = 200
        return comments
        }
    })
  