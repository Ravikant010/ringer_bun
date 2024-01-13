import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const Profile = new Elysia().use(jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string
}))


Profile.get("/profile", async({request, body, cookie: {secret}, jwt})=>{
//@ts-ignore
const isJwt = await jwt.verify(secret.get("_value"))
console.log(isJwt)
if(isJwt)
return isJwt
return false
})