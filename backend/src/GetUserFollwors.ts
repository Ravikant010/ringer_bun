import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PostModel, UserModel } from "./db/schema";
import fs from "fs"
export const GetUserFollowersById = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


GetUserFollowersById.get("/followers/:userId", async ({ body, request, cookie: { secret, id }, jwt, set, store , params: {userId}}) => {
    console.log(store);
    // console.log("req came", user_id);
    try {
        //@ts-ignore
        const isJwt = await jwt.verify(secret.get());
        if (!isJwt && userId) {
            set.status = 401;
            return { data: "unauthorized" };
        }
        let user = await UserModel.findById(userId)
        .select("followers following");
        // .select("following")
        // if (user) {
        //   user = user.toObject();
        //   if (user.profilePicture) {
        //     user.profile = fs.readFileSync(user.profilePicture);
        //   }
        // }
        if (!user) {
            set.status = 404; 
            return { data: "User not found" };
        }
      set.status = 200
      return user
    } catch (error) {
        console.error("An error occurred:", error);
        set.status = 500;
        return { data: "Server error" };
    }
});
