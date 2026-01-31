"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { welcomeSchema, type WelcomeSchema } from "@/lib/zod-schemas/welcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles } from "lucide-react";

function WelcomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const emailDomain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WelcomeSchema>({
    resolver: zodResolver(welcomeSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const fullEmail = emailValue
    ? `${emailValue}@${emailDomain}`
    : `@${emailDomain}`;

  const onSubmit = async (data: WelcomeSchema) => {
    setIsSubmitting(true);
    try {
      // Add your email registration logic here
      console.log("Registering email:", `${data.email}@${emailDomain}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error registering email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center justify-center mb-8 animate-fade-in">
          <div className="flex items-center gap-3 group mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Mail className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AsManyMail
            </span>
          </div>
          <p className="text-center text-muted-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Your perfect email address awaits
          </p>
        </div>

        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95 animate-slide-up">
          <div className="p-8 space-y-6">
            {/* Success Message */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 animate-in slide-in-from-top duration-300">
                <p className="text-primary text-sm font-semibold text-center flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Email registered successfully!
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">
                  Choose Your Username
                </Label>
                <div className="space-y-3">
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-1.5 rounded-lg bg-background border-2 border-border focus-within:border-primary hover:border-primary/50 transition-all duration-300">
                      <Input
                        id="email"
                        placeholder="yourname"
                        {...register("email")}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-3"
                        disabled={isSubmitting || submitSuccess}
                      />
                      <Badge
                        variant="secondary"
                        className="shrink-0 px-3 py-1.5 font-medium"
                      >
                        @{emailDomain}
                      </Badge>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Preview */}
                {emailValue && !errors.email && (
                  <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-in slide-in-from-bottom duration-300">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Preview
                    </p>
                    <p className="text-base font-semibold text-foreground break-all">
                      {fullEmail}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                disabled={isSubmitting || submitSuccess}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Creating your email...
                  </span>
                ) : submitSuccess ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Registered Successfully
                  </span>
                ) : (
                  "Claim Your Email Address"
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default WelcomePage;
