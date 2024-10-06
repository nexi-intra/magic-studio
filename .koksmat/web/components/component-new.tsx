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
import { Textarea } from "@/components/ui/textarea";

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
  sourceCode: z
    .string()
    .min(1, { message: "Source code is required" })
    .max(10000, { message: "Source code must be 10000 characters or less" }),
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
      sourceCode: " comment here",
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
          {/* <FormField
            control={form.control}
            name="sourceCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Code</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your component's source code here..."
                    className="font-mono"
                    rows={10}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Paste or type the source code for your new component.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit">Create Component</Button>
        </form>
      </Form>
    </div>
  );
}
