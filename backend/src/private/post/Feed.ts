import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "../../db/schema";
import fs from "fs";
export const Feed = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

Feed.get("/feed/:count", async ({ cookie: { secret }, jwt, set, params: {count} }) => {
  //@ts-ignore
  const isJwt = await jwt.verify(secret.get("_value"));
  if (!isJwt) {
    set.status = 401;
    return { data: "unauthorized" };
  }
  let post_with_media = [];
  const posts = await PostModel.find()
  .populate({ path: 'author', select: 'username profilePicture' })
  .populate({ path: 'likes', select: 'username profilePicture' })
  .populate({ path: 'comments'});

  try {
    for (const _post of posts) {
      const posts = {
        ..._post.toObject(),
        post_media: await fs.readFileSync(_post?.media),
        user: await fs.readFileSync(_post.author?.profilePicture)
      };

      // console.log("Posts_With_Media", posts);
      post_with_media.push(posts);
    }
    set.status = 200;
    // console.log(post_with_media.slice(0,2))
    return post_with_media.slice(parseInt((count)), 5);
  } catch (Err) {
    console.log(Err);
    set.status = 500;
    return "Error";
  }
});
