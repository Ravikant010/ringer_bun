import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { Message } from "../db/schema";
const sockets = new Map();
export const Socket = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  }).ws("/ws", {
    open(ws) {
    },

    async message(ws, message) {
      interface Imessage  {
        sender: string;
        receiver: string;
        content: string;
        timestamp?: Date;
      }
if(message?.type === "join")
{
  console.log(message)
 return sockets.set(message?.username, ws);
}
      const { sender, receiver, content, timestamp } =   message as Imessage
      console.log( sender, receiver, content, timestamp)
      if(!sockets.has(sender))
      sockets.set(sender, ws);

      const senderDB = await Message.findOne({ sender });
      const receiverDB = await Message.findOne({ receiver });
      if (!senderDB) {
        const newMessage = new Message({
          sender,
          receiver,
          content: [{ type: "sent", text: content, timestamp }],
        });
        await newMessage.save();
      }
      else
      {
        senderDB.content.push({
          text: content as string,
          type: "sent",
          timestamp: timestamp as  Date
        })
await senderDB.save()

      }
      if (!receiverDB) {
        const newMessage = new Message({
          sender,
          receiver,
          content: [{ type: "received", text: content, timestamp }],
        });
        await newMessage.save();
      }
else {
  receiverDB.content.push({
    text: content as string,
    type: "received",
    timestamp: timestamp as  Date
  })
  await receiverDB.save()
}
if(sockets.has(receiver))
sockets.get(receiver)?.send(JSON.stringify({sender, receiver, content, timestamp, type:"received"}))
return  ws.send(JSON.stringify({sender, receiver, content, timestamp, type:"sent"}))
    }}))


// import jwt from "@elysiajs/jwt";
// import Elysia from "elysia";
// import { Message } from "../db/schema";

// const sockets = new Map();

// export const Socket = new Elysia().use(
//   jwt({
//     name: "jwt",
//     secret: process.env.jwt_secret as string,
//   }).ws("/ws", {
//     open(ws) {
//     },
//     async message(ws, message) {
//       interface Imessage {
//         sender: string;
//         receiver: string;
//         content: string;
//         timestamp?: Date;
//       }

//       console.log(message);

//       const { sender, receiver, content, timestamp } = message as Imessage;

//       if (!sockets.has(sender)) {
//         sockets.set(sender, ws);
//       }

//       // Check if the message is already in the database
//       const senderDB = await Message.findOne({ sender, receiver, content });
//       if (!senderDB) {
//         // Create a new message and save it in the database
//         const newMessage = new Message({
//           sender,
//           receiver,
//           content: [{ type: "sent", text: content, timestamp }],
//         });
//         await newMessage.save();
//       } else {
//         // Update the existing message in the database
//         senderDB.content.push({
//           text: content as string,
//           type: "sent",
//           timestamp: timestamp as Date,
//         });
//         await senderDB.save();
//       }

//       if (receiver !== sender) {
//         const receiverDB = await Message.findOne({ sender: receiver, receiver: sender, content });
//         if (!receiverDB) {
//           const newMessage = new Message({
//             sender: receiver,
//             receiver: sender,
//             content: [{ type: "received", text: content, timestamp }],
//           });
//           await newMessage.save();
//         } else {
//           receiverDB.content.push({
//             text: content as string,
//             type: "received",
//             timestamp: timestamp as Date,
//           });
//           await receiverDB.save();
//         }
//         if (sockets.has(receiver)) {
//           sockets.get(receiver)?.send(JSON.stringify({ sender, receiver, content, timestamp, type: "received" }));
//         }
//       }

//       ws.send(JSON.stringify({ sender, receiver, content, timestamp, type: "sent" }));
//     }
//   })
// );
