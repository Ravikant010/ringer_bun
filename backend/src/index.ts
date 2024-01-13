
import { Elysia } from "elysia";
import connectToMongoDB from "./db/db";
import { Auth } from "./auth/auth";
import swagger from "@elysiajs/swagger";
import { staticPlugin } from '@elysiajs/static'
import { CreatePost } from "./private/post/CreatePost";
import { EditPost } from "./private/post/EditPost";
import { DeletePost } from "./private/post/DeletePost";
import { GetAllPost } from "./private/post/GetAllPost";
import { CreateComment } from "./private/comments/CreateComment";
import { DeleteComment } from "./private/comments/DeleteComment";
import { GetAllComments } from "./private/comments/GetAllComments";
import { EditComment } from "./private/comments/EditComment";
import { ToggleLikePost } from "./private/likes/ToggleLike";
import { LikesPost } from "./private/post/GetPostLikes";
import { ToggleFollowUser } from "./private/follow/follow";
import { UploadProfile } from "./private/user/UploadProfile";
import { GetProfile } from "./private/user/GetProfileImage";
import cors from "@elysiajs/cors";
// import cors from "cors"
import { GetUser } from "./private/user/GetUser";
import { CookieVerify } from "./private/VerifyCookie";

import mongoose from "mongoose";
import { Feed } from "./private/post/Feed";
import { GetUserById } from "./private/GetUseById";
import { GetUserFollowersById } from "./GetUserFollwors";
import { Socket } from "./websocket/socket";
import { GetUserChat } from "./private/getChat";
// const Sess = session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   store: new MongoStore({ mongoUrl: process.env.mongoURI as string}),
// })

export const server = new Elysia()
.use(cors({
  origin: '192.168.210.186:5173',
  credentials: true,
  allowedHeaders: 'Content-Type'
}))

// server.use(S)

connectToMongoDB()
// server.use(swagger())
// server.use(staticPlugin())
server.use(Auth)
server.use(CookieVerify)
server.use(CreatePost)
server.use(EditPost)
server.use(DeletePost)
server.use(GetAllPost)
server.use(CreateComment)
server.use(DeleteComment)
server.use(GetAllComments)
server.use(EditComment)
server.use(ToggleLikePost)
server.use(LikesPost)
server.use(ToggleFollowUser)
server.use(UploadProfile)
server.use(GetProfile)
server.use(GetUser)
server.use(Feed)
server.use(GetUserById)
server.use(GetUserFollowersById)
server.use(Socket)
server.use(GetUserChat)
server.listen({
  port: 3000
})
// server.get("/user/user/:id", ({params: {id}})=>{
//   console.log(id)
//  return  ({data:123})
// })
console.log(
  `🦊 Elysia is running  at ${server.server?.hostname}:${server.server?.port}`
);

export type ServerType = typeof server 


// {
//   origin: "http://192.168.210.186:5173",
//   credentials: true,
//   preflight:true,
//   maxAge: 86400 ,
//   methods: ['GET','POST','PUT', 'DELETE'],
// }