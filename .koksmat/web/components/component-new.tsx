/*
 * ComponentNew
 *
 * This component provides a form for creating new components in the Koksmat Studio.
 * It allows users to input a component name and specify whether it's a test component.
 * The form uses Zod for validation and React Hook Form for form management.
 * On submission, it calls the provided onSubmitted callback with the form data.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

// Define the schema for the form
const formSchema = z.object({
  componentName: z
    .string()
    .min(1, { message: "Component name is required" })
    .max(50, { message: "Component name must be 50 characters or less" })
    .regex(/^[A-Z][A-Za-z]*$/, {
      message:
        "Component name must start with a capital letter and contain only letters",
    }),
  isTest: z.boolean().default(false),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function ComponentNew(props: {
  onSubmitted: (data: FormValues) => void;
}) {
  const { onSubmitted } = props;
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentName: "",
      isTest: false,
    },
  });

  // Handle form submission
  function onSubmit(data: FormValues) {
    setSubmittedData(data);
    if (onSubmitted) {
      onSubmitted(data);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="componentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Component Name</FormLabel>
                <FormControl>
                  <Input placeholder="MyNewComponent" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a name for your new component. It should start with a
                  capital letter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTest"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Is this a test component?
                  </FormLabel>
                  <FormDescription>
                    Check this box if you're creating a test file for your component.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit">Create Component</Button>
        </form>
      </Form>
    </div>
  );
}