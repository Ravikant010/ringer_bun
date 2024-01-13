import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { LikeModel, PostModel, UserModel } from "../../db/schema";
import fs from "fs";
import path from "path";
export const UploadProfile = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

import { createWriteStream } from "fs";
import { Blob } from "buffer";

UploadProfile.post(
  "/profile/user",
  async ({ request, cookie: { secret, id }, jwt, set }) => {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get("_value"));
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    const form = await request?.formData();
    const profile = (await form.get("profilePicture")) as File;
    // console.log(profile, "dfdf")
    // const user_id = await form.get("id");
    console.log(id, "dfdf")
    console.log(typeof profile);
    const dir = `./public/${id}/profile`;
    if(id && profile)
    await fs.promises
      .stat(`./public/${id}/profile`)
      .then(async () => {
        console.log(`Directory ./public/${id} already exists.`);
        await Bun.write(`${dir}/${profile.name}`, profile);
      })
      .catch((err) => {
        // The directory doesn't exist, so create it
        if (err.code === "ENOENT") {
          console.log(dir.slice(1))
          fs.promises
            .mkdir(dir, { recursive: true})
            .then(async() => {
              console.log(`Directory '${dir}' created successfully.`);
             await Bun.write(`${dir}/${profile.name}`, profile);
            await  UserModel.findByIdAndUpdate(id, {
                profilePicture: `${dir}/${profile.name}`
              })
              set.status = 200;
              return { data: "profile uploaded" };
            })
            .catch((mkdirError) => {
              console.error(
                `Error creating directory '${dir}': ${mkdirError.message}`
              );
            });
        } else {
          console.error(`Error checking directory '${dir}': ${err.message}`);
        }
      });
  }
);
