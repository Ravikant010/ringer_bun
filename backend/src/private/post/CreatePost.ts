import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "../../db/schema";
import fs from "fs";
export const CreatePost = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

CreatePost.post(
  "/create/post",
  async ({ body, request, cookie: { secret }, jwt, set }) => {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get());
    const id = isJwt?.id;
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    //@ts-ignore
    const { content } = body;
    console.log(content);
    if (content && id) {
      const post = new PostModel({
        content,
        author: id,
      });
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          {
            $addToSet: { posts: post?.id },
          },
          { new: true }
        );

        if (updatedUser) {
          console.log("User updated:", updatedUser);
          // Handle the successful update
        } else {
          console.log("User not found");
          // Handle the case where the user is not found
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
      await post.save();
      set.status = 200;
      return { data: post?.id };
    }
  }
);

// CreatePost.post(
//   "/post/media",
//   async ({request, cookie: { secret }, jwt, set }) => {
//     // const isJwt = await jwt.verify(secret.get())
//     const isJwt = await jwt.verify(secret.get());

//     if (!isJwt) {
//       set.status = 401;
//       return { data: "unauthorized" };
//     }
//     const id = isJwt?.id;
//     const form = await request?.formData();
//     const post_id = form.get("post_id");
//     console.log(isJwt?.id);
//     const image = form.get("image") as File;
//     console.log(post_id, image)
//     if (image && id && post_id) {
//       const dir = `./public/${id}/post/${post_id}`;
//       if (id && image)
//         await fs.promises
//           .stat(`./public/${id}/profile`)
//           .then(async () => {
//             console.log(`Directory ./public/${id} already exists.`);
//             await Bun.write(`${dir}/${image.name}`, image);
//           })
//           .catch((err) => {
//             // The directory doesn't exist, so create it
//             if (err.code === "ENOENT") {
//               console.log(dir.slice(1));
//               fs.promises
//                 .mkdir(dir, { recursive: true })
//                 .then(async () => {
//                   console.log(`Directory '${dir}' created successfully.`);
//                   await Bun.write(`${dir}/${image.name}`, image);
// await  UserModel.findByIdAndUpdate(id, {
//     profilePicture: `${dir}/${image.name}`
//   })
//                   await PostModel.findByIdAndUpdate(post_id, {
//                     media: `${dir}/${image.name}`,
//                   });
//                   set.status = 200;
//                   return { data: "profile uploaded" };
//                 })
//                 .catch((mkdirError) => {
//                   console.error(
//                     `Error creating directory '${dir}': ${mkdirError.message}`
//                   );
//                 });
//             } else {
//               console.error(
//                 `Error checking directory '${dir}': ${err.message}`
//               );
//             }
//           });
//     }

CreatePost.post(
  "/post/media",
  async ({ request, cookie: { secret }, jwt, set }) => {
    try {
      const isJwt = await jwt.verify(secret.get());

      if (!isJwt) {
        set.status = 401;
        return { data: "unauthorized" };
      }

      const id = isJwt?.id;
      const form = await request?.formData();
      const post_id = form.get("post_id");
      const image = form.get("image") as File;
      console.log(post_id);
      if (!id || !post_id || !image) {
        set.status = 400; // Bad request
        return { data: "Invalid request data" };
      }

      const user = await UserModel.findById(id);

      if (!user) {
        set.status = 404;
        return { data: "User not found" };
      }

      const dir = `./public/${id}/post/${post_id}`;

      try {
        await fs.promises.mkdir(dir, { recursive: true });
        console.log(`Directory '${dir}' created successfully.`);
        await Bun.write(`${dir}/${image.name}`, image);
        console.log(post_id);
        await PostModel.findByIdAndUpdate(post_id, {
          media: `${dir}/${image.name}`,
        });
        // await  UserModel.findByIdAndUpdate(id, {
        //   profilePicture: `${dir}/${image.name}`
        // })
        set.status = 200;
        return { data: "Post uploaded" };
      } catch (mkdirError) {
        console.error(`Error creating directory '${dir}': ${mkdirError}`);
        set.status = 500;
        return { data: "Error creating post" };
      }
    } catch (error) {
      set.status = 401;
      return { data: "unauthorized" };
    }
  }
);

//   //@ts-ignore
// })

// CreatePost.post("/create/post", async({body, request, cookie:{secret}, jwt, set,})=>{
//   //@ts-ignore
//   const isJwt = await jwt.verify(secret.get("_value"))
//   if(!isJwt)
//   {set.status = 401
//   return ({data: "unauthorized", })
//   }
//   //@ts-ignore
// const {content, id}=  body
// if(content && id ){
//   const post = new PostModel({
//       content, author: id

//   })
