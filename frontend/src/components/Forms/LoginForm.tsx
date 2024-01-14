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
import { useMutation } from "@tanstack/react-query";
import API from "@/api/config/API";
import { Link } from "react-router-dom";
type Props = {
  handleLoader: (status:boolean)=>void
};
export default function LoginForm({handleLoader}: Props) {
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  //states
  const [isShowPassword, setIsShowPassword] = useState(false);
  //api mutation
  const login = useMutation({
    mutationKey: ["Register"],
    mutationFn: async () => {
      handleLoader(true)
      return await API.post("/register", form.getValues());
    },
  onSuccess:()=>handleLoader(false)
  });
  //api handler
  function handleLogin() {
    return login.mutate();
  }
  
  return (
    <Form {...form}>
      <section className="px-4 mx-auto mt-2">
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">email</FormLabel>
                <FormControl>
                  <span>
                    {" "}
                    <Input
                      placeholder="Email"
                      {...field}
                      className={cn("py-6 mt-0")}
                    />
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      {...field}
                      className={cn("py-6 mt-0")}
                    />
                    <div
                      className="absolute top-0 end-0 p-3.5 rounded-e-md dark:focus:outline-none dark:focus:ring-1"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {!isShowPassword ? (
                        <Icon name="EyeOff" size={24} />
                      ) : (
                        <Icon name="Eye" size={24} />
                      )}
                    </div>
                  </div>
                </FormControl>
                <div className="relative w-full">
                  <a className="absolute end-0 "> Forget Password</a>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full py-6  relative top-6")}>
            Submit
          </Button>
        </form>
      </section>
      <section className="px-4 mx-auto">
        <h2 className="mx-auto mt-8 mb-4 w-fit">or</h2>
        {/* <p className="w-full text-center bg-slate-500">sdsd</p> */}
        <GoogleAuthButton />
        <h2 className="mx-auto mt-8 mb-4 w-fit">or</h2>
        <h3 className="self-center w-full text-center "><Button variant={"link"} ><Link to="/signup">Create An Account</Link></Button></h3>
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
