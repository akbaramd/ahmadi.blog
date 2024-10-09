"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";


import { cn } from "@/lib/utils";
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
import { api } from "@/trpc/react";  // Assuming trpc is configured correctly
import { useToast } from "@/hooks/use-toast";

// Define the schema for form validation
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "نام کاربری باید حداقل ۲ حرف داشته باشد.",
    })
    .max(30, {
      message: "نام کاربری نباید بیش از ۳۰ حرف باشد.",
    }),
  email: z
    .string({
      required_error: "لطفاً یک ایمیل برای نمایش انتخاب کنید.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  socials: z
    .array(
      z.object({
        title: z.string().min(1, { message: "لطفاً نام شبکه اجتماعی را وارد کنید." }), // Social network name
        link: z.string().url({ message: "لطفاً یک URL معتبر وارد کنید." }), // Social network link
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {

  const { toast } = useToast();
  
  // Initialize TRPC mutation for profile update
  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "پروفایل با موفقیت به‌روزرسانی شد",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطا در به‌روزرسانی پروفایل",
        description: error.message,
      });
    },
  });

  // Fetch the profile data with TRPC
  const { data: profileData, isLoading } = api.user.getProfile.useQuery();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      socials: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "socials", // Name of the array field
    control: form.control,
  });

  // Reset form values when profileData is fetched
  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        bio: profileData.bio || "",
        socials: profileData.socials?.map((social) => ({
          title: social.title, // Prefill the social network name
          link: social.link, // Prefill the social network link
        })) || [],
      });
    }
  }, [profileData, form]);

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate({
      name: data.name,
      email: data.email,
      bio: data.bio,
      socials: data.socials?.map((social) => ({
        title: social.title, // Social network name
        link: social.link, // Social network link
      })),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-right">
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل</FormLabel>
              <FormControl >
                <Input {...field} className="text-right" disabled/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام نمایشی</FormLabel>
              <FormControl>
                <Input {...field} className="text-right" />
              </FormControl>
              <FormDescription>
                این نام نمایشی عمومی شما است. می‌تواند نام واقعی یا یک نام مستعار باشد.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>بیوگرافی</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="کمی درباره خودتان بگویید"
                  className="resize-none text-right"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                شما می‌توانید دیگر کاربران و سازمان‌ها را با استفاده از <span>@</span> به آنها لینک دهید.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 space-x-reverse">
              <FormField
                control={form.control}
                name={`socials.${index}.title`} // Social network name field
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="نام شبکه اجتماعی" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socials.${index}.link`} // Social network link field
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="لینک شبکه اجتماعی" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ title: "", link: "" })} // Add new social network
          >
            اضافه کردن شبکه اجتماعی
          </Button>
        </div>
        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? "در حال بروزرسانی..." : "بروزرسانی پروفایل"}
        </Button>
      </form>
    </Form>
  );
}
