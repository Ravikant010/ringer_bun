// import jwt from "@elysiajs/jwt";
// import Elysia from "elysia";
// import { PostModel, UserModel } from "../../db/schema";

// import fs from "fs";
// export const GetAllPost = new Elysia().use(
//   jwt({
//     name: "jwt",
//     secret: process.env.jwt_secret as string,
//   })
// );

// GetAllPost.get("/get/post", async ({ cookie: { secret }, jwt, set }) => {
//   try {
//     //@ts-ignore
//     const isJwt = await jwt.verify(secret.get("_value"));
//     if (!isJwt) {
//       set.status = 401;
//       return { data: "unauthorized" };
//     }

//     //@ts-ignore
//     const user_id = isJwt?.id;
//     let post_with_media = [];
//     if (user_id) {
//       try {
//         const user = await UserModel.findById(user_id).populate("posts");
//         const user_posts = user?.posts;
//         if (user && user_posts) {
//         for (const _post of user_posts) {
//           if (_post && user && _post.media && user.profilePicture) {
//             const posts = {
//               ..._post.toObject(),
//               post_media: fs.readFileSync(_post.media),
//               user: fs.readFileSync(user.profilePicture)
//             };
//             post_with_media.push(posts);
//           } else {
//             set.status = 404;
//             return { data: "User not found" };
//           }
//         }
//         set.status = 200
//         return post_with_media;
//       }

        



//       } catch (err) {
//         console.error(err);
//         set.status = 500;
//         return { data: "Internal server error" };
//       }
//     } else {
//       set.status = 400;
//       return "Bad Request";
//     }
//   } catch (error) {
//     set.status = 401;
//     return { data: "unauthorized" };
//   }
// });


import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "../../db/schema";

import fs from "fs";

export const GetAllPost = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

GetAllPost.get("/get/post", async ({ cookie: { secret }, jwt, set }) => {
  try {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"));
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }

    //@ts-ignore
    const user_id = isJwt?.id;
    let post_with_media = [];

    if (user_id) {
      try {
        const user = await UserModel.findById(user_id).populate("posts");
        const user_posts = user?.posts;

        if (user && user_posts) {
          for (const _post of user_posts) {
            if (_post && user && _post.media && user.profilePicture) {
              const posts = {
                ..._post.toObject(),
                post_media: fs.readFileSync(_post.media),
                user: fs.readFileSync(user.profilePicture),
              };
              post_with_media.push(posts);
            } else {
              set.status = 404;
              return { data: "User not found" };
            }
          }

          set.status = 200;
          return post_with_media;
        } else {
          set.status = 404;
          return { data: "User not found" };
        }
      } catch (err) {
        console.error(err);
        set.status = 500;
        return { data: "Internal server error" };
      }
    } else {
      set.status = 400;
      return "Bad Request";
    }
  } catch (error) {
    set.status = 401;
    return { data: "unauthorized" };
  }
});
