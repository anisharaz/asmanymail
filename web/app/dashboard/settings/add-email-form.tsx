"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { welcomeSchema, type WelcomeSchema } from "@/lib/zod-schemas/welcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import { AddEmailAddress } from "@/app/actions/welcome-actions";
import { useRouter } from "next/navigation";

export function AddEmailForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const emailDomain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<WelcomeSchema>({
    resolver: zodResolver(welcomeSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: WelcomeSchema) => {
    try {
      const res = await AddEmailAddress({ email: data.email });
      if (!res.success) {
        throw new Error(res.message);
      }

      setSubmitSuccess(true);
      reset();
      router.refresh();
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
      console.error("Error adding email:", error);
    }
  };

  return (
    <Card className="border-2">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Email Address</h2>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 animate-in slide-in-from-top duration-300">
            <p className="text-primary text-sm font-semibold flex items-center gap-2">
              <Check className="h-4 w-4" />
              Email address added successfully!
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background border-2 border-border focus-within:border-primary transition-colors">
                <Input
                  id="email"
                  placeholder="username"
                  {...register("email")}
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                  disabled={isSubmitting}
                />
                <Badge variant="secondary" className="shrink-0">
                  @{emailDomain}
                </Badge>
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1.5">
                  {errors.email.message}
                </p>
              )}
              {errors.root && (
                <p className="text-sm text-destructive mt-1.5">
                  {errors.root.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="shrink-0">
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
