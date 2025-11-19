"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
const formSchema = z.object({
  name: z
    .string({ message: "Name is Required!" })
    .min(1, { message: "Name is Required!" }),
  slug: z
    .string({ message: "Name is Required!" })
    .min(1, { message: "Name is Required!" }),
});

const AddCategory = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Response Status:", res.status);
      // Attempt to parse JSON safely
      let responseBody = null;
      try {
        responseBody = await res.json();
      } catch {
        responseBody = null; // Backend returned empty body
      }
      if (!res.ok) {
        throw new Error(
          responseBody?.error ||
            responseBody?.message ||
            `Failed to create category (Status: ${res.status})`
        );
      }

      // success
      return responseBody;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add Category</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter category name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter category slug.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddCategory;
