import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { LikeModel, PostModel, UserModel } from "../../db/schema";
import fs from "fs";
import path from "path";
import { staticPlugin } from '@elysiajs/static'
export const GetProfile = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);

GetProfile.use(staticPlugin())
GetProfile.get(
  "/profile",
  async ({ request, cookie: { secret }, jwt, set }) => {
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get());
    const id = isJwt?.id
    if (!isJwt) {
      set.status = 401;
      return { data: "unauthorized" };
    }
    //@ts-ignore

    console.log(id)
if(id){
const {profilePicture} = await UserModel.findById(id).select("profilePicture") as {profilePicture:string}

set.status =200
return fs.readFileSync(profilePicture)
}
set.status =400
return ({data: null})
})