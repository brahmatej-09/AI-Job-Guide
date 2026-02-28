"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const industryValue = data?.subIndustry || data?.industry;
    if (!industryValue) throw new Error("Industry is required");

    const experienceValue =
      typeof data?.experience === "string"
        ? Number.parseInt(data.experience, 10)
        : data?.experience;

    const skillsValue =
      typeof data?.skills === "string"
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(data?.skills)
        ? data.skills
        : [];

    let industryRecord = await db.industryInsights.findUnique({
      where: { industry: industryValue },
    });

    if (!industryRecord) {
      const insights = await generateAIInsights(industryValue);

      industryRecord = await db.industryInsights.create({
        data: {
          industry: industryValue,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        industry: industryValue,
        experience: Number.isFinite(experienceValue) ? experienceValue : null,
        bio: data?.bio ?? null,
        skills: skillsValue,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) {
    return { isOnboarded: false };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return {
      isOnboarded: !!user?.industry, // Returns true if industry exists
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}