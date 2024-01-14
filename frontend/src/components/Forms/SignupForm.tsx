import React, { useCallback, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

type Props = {};

export default function SignupForm({}: Props) {
  const formSchema = z.object({
    profile: z
      .instanceof(File)
      .refine((file) => {
        console.log(file);
        const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        return acceptedImageTypes.includes(file.type);
      }, "Only image files are supported.")
      .refine((file) => file.size <= 500000, "Max file size is 5MB."),
    first_name: z.string().min(1).max(255),
    last_name: z.string().min(1).max(255),
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    email: z.string().email(),
    password: z.string().min(8).max(255),
    username: z.string().min(5).max(255),
    confirm_password: z
      .string()
      .min(8)
      .max(255)
      .refine((confirm_password: string) => {
        return (
          confirm_password === formSchema.password, "Passwords don't match"
        );
      }),
  });
  // const formSchema = z.object({
  //     email: z.string().email({ message: "Invalid email" }),
  //     password: z
  //       .string()
  //       .min(6, { message: "Password must be at least 6 characters" }),
  //   });

  const [isShowPassword, setIsShowPassword] = useState(false);

  const FormResolver = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const renderFormField = useCallback(
    (el: string) => (
      <FormField
        key={el}
        control={FormResolver.control}
        name={el.replace(/\s+/g, "_")}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {el === "profile" ? "" : el != "dob" ? el : ""}
            </FormLabel>
            <FormControl>
              <span>
                {" "}
                {el === "profile" ? (
                  <Input
                    type="file"
                    {...field}
                    className={cn("py-6 mt-0 rounded-full w-32 h-32 mx-auto")}
                  />
                ) : el === "dob" ? (
                  <DatePicker />
                ) : (
                  <Input
                    placeholder={el}
                    {...field}
                    className={cn("py-6 mt-0")}
                  />
                )}
              </span>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [FormResolver.control]
  );

  return (
    <Form {...FormResolver}>
      <section className="px-4 mx-auto mt-2">
        <form
          onSubmit={FormResolver.handleSubmit(() => {})}
          className="space-y-4"
        >
          {[
            "profile",
            "username",
            "first name",
            "last name",
            "dob",
            "email",
            "password",
            "confirm password",
          ].map(renderFormField)}
          <Button type="submit" className={cn("w-full py-6  relative top-6")}>
            Submit
          </Button>
        </form>
      </section>
    </Form>
  );
}

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <FormLabel>Date of birth</FormLabel>
      <br />
      <PopoverTrigger asChild className={cn("py-6 mt-0")}>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
