import { auth, currentUser } from "@clerk/nextjs/server";
import { onboardingSchema } from "@/app/lib/schema";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "@/actions/dashboard";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const parsed = onboardingSchema.parse(body);

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    const name = clerkUser
      ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null
      : null;
    const imageurl = clerkUser?.imageUrl ?? null;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing user email from Clerk" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the industry/specialization value to store
    const industryValue = parsed.subIndustry || parsed.industry;

    // Create IndustryInsights if it doesn't exist
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

    // Now update the user
    const user = await db.user.update({
      where: { clerkUserId: userId },
      data: {
        email,
        name,
        imageurl,
        industry: industryValue,
        bio: parsed.bio ?? null,
        experience: parsed.experience ?? null,
        skills: parsed.skills || [],
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/api/onboarding error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
