"use client";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-madal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted!");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
        onConfirm={handleDelete}
      />
      <div className="flex justify-between items-center">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          disabled={isLoading}
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="m-2" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="ml-auto" disabled={isLoading}>
            {isLoading ? "Saving Changes..." : "Save changes"}
          </Button>
        </form>
      </Form>
      <Separator className="m-2" />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        desciption={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
