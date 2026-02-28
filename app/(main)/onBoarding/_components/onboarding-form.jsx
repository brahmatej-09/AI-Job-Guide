"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { onboardingSchema } from "@/app/lib/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  // local loading state for submit
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  // no server-action success watcher when using REST endpoint

  const watchIndustry = watch("industry");

  useEffect(() => {
    if (watchIndustry) {
      const industry = industries.find((ind) => ind.id === watchIndustry);
      setSelectedIndustry(industry);
    }
  }, [watchIndustry, industries]);

  // 3. Updated onSubmit to use the fetch function
  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to save profile");
      }

      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Onboarding Error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Industry Selection */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={watch("industry") || undefined}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger
                  id="industry"
                  className={errors.industry ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Specialization Selection */}
            {selectedIndustry && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  value={watch("subIndustry") || undefined}
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger
                    id="subIndustry"
                    className={errors.subIndustry ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-destructive">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* Experience Input */}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Enter years of experience"
                {...register("experience")}
                className={errors.experience ? "border-destructive" : ""}
              />
              {errors.experience && (
                <p className="text-sm text-destructive">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills Input */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
                className={errors.skills ? "border-destructive" : ""}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-destructive">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className={`min-h-[120px] resize-none ${
                  errors.bio ? "border-destructive" : ""
                }`}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            {/* 4. Use 'loading' from useFetch for the disabled state */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;