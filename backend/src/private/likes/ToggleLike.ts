import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { LikeModel, PostModel, UserModel } from "../../db/schema";

export const ToggleLikePost = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

ToggleLikePost.post(
  "/togglelike/post",
  async ({ body, request, cookie: { secret }, jwt, set }) => {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"));
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    //@ts-ignore
    console.log(body);
    //@ts-ignore
    const { post_id, post_user } = body;
    const user_id = isJwt?.id;
    console.log(post_id, user_id);
    if (user_id && post_id) {
      try {
        const existingLike = await LikeModel.findOne({
          user: user_id,
          post: post_id,
        });
        console.log(existingLike, "existing like ");
        if (existingLike) {
          // Store the like ID before deleting
          const likeIdToDelete = existingLike._id;

          await existingLike.deleteOne();
          await PostModel?.findByIdAndUpdate(post_id, {
            $pull: {
              likes: user_id,
            },
          });

          // Remove the like ID from the corresponding post in your postModel
          // const post = await PostModel.findById(post_id);
          // if (post) {
          //   post.likes = post.likes.filter(
          //     (like) => like.user.toString() !== user_id
          //   );
          //   await post.save();
          // }
          set.status = 200;
          return { data: "unlike" };
        } else {
          // If like doesn't exist, create a new one
          const newLike = new LikeModel({ user: user_id, post: post_id });
          await newLike.save();
          // Update the corresponding post in your postModel to include the new like
          const post = await PostModel.findById(post_id);
          if (post) {
            post.likes.push(user_id);
            await post.save();
          }

          set.status = 200;
          return { data: "like" };
        }
      } catch (error) {
        // Handle errors
      }
    }

    set.status = 400;
    return { data: null };
  }
);
