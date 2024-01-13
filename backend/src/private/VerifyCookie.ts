import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CommentModel, PostModel, UserModel } from "../db/schema"

export const CookieVerify = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


CookieVerify.get("/verify-cookie", async ({ body, request, cookie: { secret }, jwt, set }) => {
    try {
      // Verify the JWT token.
      //@ts-ignore
      const isJwt = await jwt.verify(secret.get("_value"));
      if (!isJwt) {
        set.status = 401;
        return ({ data: "unauthorized" });
      }
      set.status = 200
      return ({data: "authorized"})
    }
   
    catch(error){
console.log(error)
set.status =500
return ({data: null})
    }
})