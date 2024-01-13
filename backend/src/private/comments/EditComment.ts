import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CommentModel, PostModel, UserModel } from "../../db/schema";

export const EditComment = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

EditComment.post(
  "/edit/comment",
  async ({ body, request, cookie: { secret }, jwt, set }) => {
    // Verify the JWT token.
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"));
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    //@ts-ignore
    const { post_id, comment_id, content } = body;
    console.log(post_id, comment_id, content);
    if (post_id && comment_id && content) {
      try {
        const post = await PostModel.findById(post_id)
          .populate("comments")
          .exec();

        if (!post) {
          console.log("Post not found");
          return;
        }

        const UserComment = post.comments.find(
          (comment) => comment._id.toString() === comment_id
        );

        if (UserComment) {
          try {
            UserComment.content = content;
            await UserComment.save();
            console.log("Specific Comment:", UserComment);
            set.status = 200;
            return { data: "Comment Updated Successfully" };
          } catch (err) {
            console.log(err);
            set.status == 500;
            return { data: "Ops Error Occur" };
          }
        } else {
          console.log("Comment not found");
          set.status = 404
          return { data: "Comment not found" };
        }
      } catch (error) {
        console.error(error);
      }
    }
    set.status = 400
    return { data: null };
  }
);
