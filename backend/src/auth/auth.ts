import { jwt } from "@elysiajs/jwt";
import { UserModel } from "../db/schema";
import Elysia from "elysia";
import cors from "@elysiajs/cors";

export const Auth = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.jwt_secret as string,
  })
);
Auth.post("/register", async ({ request, body, set, jwt, cookie, headers }) => {
  try {
//@ts-ignore
    const hashedPassword = await Bun.password.hash(body?.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

//@ts-ignore
    body["password"] = hashedPassword;
    const user = new UserModel(body);
    await user.save();
    const token = await jwt.sign({ id: user?.id });
    // console.log(cookie.secret);
    set.status = 201;

    set.cookie = {
      secret: {
        value: token,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: false,
      },
      id: {
        value: user?.id,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: false,
      },
    };
    // set.cookie = {
    //   id: {
    //     value: user?.id,
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //     httpOnly: true,
    //     path: "/",
    //     sameSite: "strict",
    //     secure: false,
    //   },
    // };

    return { message: "User registered successfully" };
  } catch (error) {
    console.log(error);
    set.status = 500;
    return { error: "Error registering user" };
  }
});
Auth.post("/login", async ({ request, body, set, jwt, cookie }) => {
  try {
    // console.log(body)
    //@ts-ignore

    const { email, password } = body;
    // console.log(body)

    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      set.status = 401;
      return { error: "Invalid credentials" };
    }

    const validPassword = await Bun.password.verify(password, user?.password);

    if (validPassword) {
      const token = await jwt.sign({ id: user?.id });
      // console.log(cookie.secret);
      set.status = 200;
      set.cookie = {
        secret: {
          value: token,
          expires: new Date(new Date().setDate(new Date().getDate() + 7)),
          httpOnly: true,
          path: "/",
          sameSite: "strict",
          secure: false,
        },
        id: {
          value: user?.id,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          path: "/",
          sameSite: "strict",
          secure: false,
        },
      };
      // set.cookie = {
      //   id: {
      //     value: user?.id,
      //     expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      //     httpOnly: true,
      //     path: "/",
      //     sameSite: "strict",
      //     secure: false,
      //   },
      // };

      return { data: "authenticated" };
    } else {
      set.status = 401;
      return { error: "Invalid credentials" };
    }
  } catch (error) {
    console.log(error);
    set.status = 500;
    return { error: "Error logging in" };
  }
});
