import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CommentModel, PostModel, UserModel } from "../../db/schema";

export const CreateComment = new Elysia().use(
    jwt({
        name: "jwt",
        secret: process.env.jwt_secret as string
    })
)


// CreateComment.post("/create/comment", async ({ body, request, cookie: { secret }, jwt, set }) => {
//     try {
//       // Verify the JWT token.
//       //@ts-ignore
//       const isJwt = await jwt.verify(secret.get());
//       if (!isJwt) {
//         set.status = 401;
//         return ({ data: "unauthorized" });
//       }
//   const user_id = isJwt?.id
//       // Get the comment and post ID from the request body.
//       //@ts-ignore
//       const { comment, post_id } = body;
  
//       // Validate the request body.
//       if (!post_id || !user_id || !comment) {
//         throw new Error("Invalid request body.");
//       }
//       const user = UserModel.findById(user_id)
  
//       // Create a new comment model.
//       const CreateComment = new CommentModel({
//         content: comment,
//         post: post_id,
//         username: user?.username
//         author: user_id,
//       });
  
//       // Save the comment to the database.
//       await CreateComment.save();
  
//       // Add the comment ID to the post's comments array.
//       const AddComment_into_Post = await PostModel.findByIdAndUpdate(post_id, {
//         $addToSet: {
//           comments: CreateComment?.id,
//         },
//       });
  
//       // Save the post to the database.
//       await AddComment_into_Post?.save();
  
//       // Return a success response.
//       return ({ data: "Comment created successfully." });
//     } catch (error) {
//       // Handle the error.
//       console.log(error);
//       set.status = 500;
//       return ({ data: "Internal server error." });
//     }
//   });
  

CreateComment.post("/create/comment", async ({ body, request, cookie: { secret }, jwt, set }) => {
  try {
    // Verify the JWT token.
    //@ts-ignore
    const isJwt = await jwt.verify(secret.get());
    if (!isJwt) {
      set.status = 401;
      return { data: "Unauthorized" };
    }

    const user_id = isJwt?.id;

    // Get the comment and post ID from the request body.
    //@ts-ignore
    const { comment, post_id } = body;

    // Validate the request body.
    if (!post_id || !user_id || !comment) {
      set.status = 400;
      return { data: "Bad Request: Invalid request body." };
    }

    // Check if the user exists.
    const user = await UserModel.findById(user_id);

    if (!user) {
      set.status = 404;
      return { data: "User not found" };
    }

    // Create a new comment model.
    const CreateComment = new CommentModel({
      content: comment,
      post: post_id,
      username: user.username,
      author: user_id,
    });

    // Save the comment to the database.
    await CreateComment.save();

    // Add the comment ID to the post's comments array.
    const AddComment_into_Post = await PostModel.findByIdAndUpdate(post_id, {
      $addToSet: {
        comments: CreateComment.id,
      },
    });

    // Save the post to the database.
    if (AddComment_into_Post) {
      await AddComment_into_Post.save();
    }

    // Return a success response.
    return { data: "Comment created successfully" };
  } catch (error) {
    // Handle the error.
    console.error(error);

    if (error) {
      set.status = 400;
      return { data: "Bad Request: " + error };
    } else {
      set.status = 500;
      return { data: "Internal server error" };
    }
  }
});
