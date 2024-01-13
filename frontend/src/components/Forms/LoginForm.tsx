import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Icon from "../Icon";
type Props = {};
export default function LoginForm({}: Props) {
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit() {}
  //states
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <Form {...form}>
      <section className="px-4 mx-auto mt-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email"
                    {...field}
                    className={cn("py-6")}
                  />
                </FormControl>
                {/* <FormDescription>
            This is your public display name.
          </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <span className="relative">
                    <Input
                      placeholder="password"
                      {...field}
                      className={cn("py-6")}
                      type={isShowPassword ? "text" : "password"}
                    />
                    <span
                      className="absolute -translate-y-1/2 bg-red-00 left-[220px] top-1/2 "
                      onClick={() => {setIsShowPassword(!isShowPassword)}}
                    >
                      {!isShowPassword ? (
                        <Icon name="EyeOff" size={24} />
                      ) : (
                        <Icon name="Eye" size={24} />
                      )}
                    </span>
                  </span>
                </FormControl>
                <FormMessage />
                <a className="text-sm"> Forget Password</a>
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full py-6  relative top-4")}>
            Submit
          </Button>
        </form>
      </section>
      <section className="px-4 mx-auto">
        <h2 className="mx-auto my-6 w-fit">or</h2>
        <GoogleAuthButton />
      </section>
    </Form>
  );
}
const GoogleAuthButton = () => {
  return (
    <div className="grid ">
      <button className="h-12 px-6 transition duration-300 border-2 border-gray-300 rounded-full group hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
        <div className="relative flex items-center justify-center space-x-4">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="absolute left-0 w-5"
            alt="google logo"
          />
          <span className="block text-sm font-semibold tracking-wide text-gray-700 transition duration-300 w-max dark:text-white dark:group-hover:text-black sm:text-base">
            Continue with Google
          </span>
        </div>
      </button>
    </div>
  );
};
