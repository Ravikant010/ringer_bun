import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { IUser, LikeModel, PostModel, UserModel } from "../../db/schema";

export const ToggleFollowUser = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

ToggleFollowUser.post("/follow/:user_name", async ({
  body,
  request,
  cookie: { secret },
  jwt,
  set,
  params: { user_name },
}) => {
  try {
    // Verify the JWT token
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get());
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }

    // Extract user_id from the request body
    //@ts-ignore
    const user_id = isJwt?.id

    if (!user_id || !user_name) {
      set.status = 400;
      return { data: "Bad request - Missing user_id or user_name in the request body" };
    }

    try {
      // Find the user to follow
      const follow_user = await UserModel.findOne({ username: user_name });

      if (!follow_user) {
        set.status = 404;
        return { data: "User not found" };
      }

      if (!follow_user.followers.includes(user_id)) {
        follow_user.followers.push(user_id);
        await follow_user.save();
        const user = await UserModel.findById(user_id);
        user?.following.push(follow_user?._id);
        await user?.save();
        return { data: "User followed successfully" };
      } else {
        follow_user.followers = follow_user.followers.filter(id => id.toString() !== user_id);
        await follow_user.save();
        const user = await UserModel.findById(user_id);
        if (user) {
          user.following = user.following.filter(id => id.toString() !== follow_user._id.toString());
          await user.save();
        }
        return { data: "User is already being followed" };
      }
    } catch (error) {
      set.status = 500;
      return { data: "An error occurred" };
    }
  } catch (error) {
    set.status = 500;
    return { data: "An error occurred" };
  }
});
