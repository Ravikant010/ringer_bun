import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CommentModel, PostModel, UserModel } from "../../db/schema";

export const DeleteComment = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

DeleteComment.post(
  "/delete/comment",
  async ({ request, body, jwt, set, cookie: { secret } }) => {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"));
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    //@ts-ignore
    const { comment_id, post_id } = body;
    if (comment_id) {
      try {
        await PostModel.findByIdAndUpdate(post_id, {
          $pull: { comments: comment_id },
        });
        await CommentModel.findByIdAndRemove(comment_id);
        set.status = 200;
        return { data: "comment delete" };
      } catch (error) {
        console.log(error);
        set.status = 500;
        return { data: "Internal server error." };
      }
    }
  }
);
