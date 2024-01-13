import mongoose, { Document, Schema } from "mongoose";

// User Schema
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profilePicture: string;
  bio: string;
  posts: IPost[];
  registrationDate: Date;
  lastLoginDate: Date;
  friends: IUser["_id"][];
  followers: IUser["_id"][];
  following: IUser["_id"][];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  registrationDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Post Schema
interface IPost extends Document {
  content: string;
  media: string;
  author: IUser["_id"];
  likes: IUser["_id"][];
  comments: IComment["_id"][];
  tags: string[];
  createdAt: Date;
  username: string
}

const PostSchema : Schema<IPost>= new Schema<IPost>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: {type:String},
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  media: {type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

// Comment Schema
interface IComment extends Document {
  content: string;
  author: IUser["_id"];
  post: IPost["_id"];
  createdAt: Date;
  username:string
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  username: {type: String},
  createdAt: { type: Date, default: Date.now },
});
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: [
    {
      text: { type: String, required: true }, // Message content
      type: { type: String, enum: ['sent', 'received'], required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ],
});



export const Message = mongoose.model('Message', messageSchema);
// Like Schema (for tracking likes on posts)
interface ILike extends Document {
  user: IUser["_id"];
  post: IPost["_id"];
}

const LikeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});



const UserModel = mongoose.model<IUser>("User", UserSchema);
const PostModel = mongoose.model<IPost>("Post", PostSchema);
const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);
const LikeModel = mongoose.model<ILike>("Like", LikeSchema);



export { UserModel, PostModel, CommentModel, LikeModel };
