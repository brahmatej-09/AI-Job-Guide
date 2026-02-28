"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());
const GROQ_MODEL = "llama-3.3-70b-versatile";
const SYSTEM_INSTRUCTION = `You are an industry analyst AI. 
You ONLY return valid JSON — no markdown, no explanation, no extra text.
All numeric values must be real numbers, not 0 unless truly accurate.
All arrays must have at least 5 items.
Be specific and data-driven.`;

// ── Shared helpers ────────────────────────────────────────────────────────────

const buildInsightsPrompt = (industry, userSkills = [], experience = 0) => `
You are an expert industry analyst. Analyze the "${industry}" industry as of 2025 and return a JSON object.

User context: experience=${experience} years, current skills=[${userSkills.join(", ") || "none provided"}]

Return ONLY this JSON structure, no markdown, no extra text:
{
  "salaryRanges": [
    { "role": "string", "min": 50000, "max": 150000, "median": 95000, "location": "string" }
  ],
  "growthRate": 12.5,
  "demandLevel": "HIGH",
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "marketOutlook": "POSITIVE",
  "keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
  "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "demandTrends": [
    "Short description of demand trend 1",
    "Short description of demand trend 2",
    "Short description of demand trend 3"
  ],
  "futureOutlook": [
    "1-2 year outlook statement",
    "3-5 year outlook statement",
    "Long-term (5+ years) outlook statement"
  ],
  "careerRecommendations": [
    "Actionable recommendation personalized to user skills and experience",
    "Recommendation 2",
    "Recommendation 3",
    "Recommendation 4"
  ]
}

Rules:
- growthRate must be a realistic percentage number (e.g. 12.5 not 0)
- demandLevel must be exactly one of: HIGH, MEDIUM, LOW
- marketOutlook must be exactly one of: POSITIVE, NEUTRAL, NEGATIVE
- salaryRanges must include at least 6 common roles in this industry
- All arrays must have at least 5 items (except futureOutlook=3, careerRecommendations=4)
- careerRecommendations must be personalized based on the user's ${experience} years of experience and skills
`;

const parseInsightsResponse = (text) => {
    const cleaned = text.replace(/```(?:json)?\n?/g, " ").trim();
    const parsed = JSON.parse(cleaned);
    // If the AI returned the 4-module structure, extract from trends sub-key
    const src = (parsed.trends && !parsed.salaryRanges) ? parsed.trends : parsed;
    return {
        salaryRanges:          src.salaryRanges          || [],
        growthRate:            src.growthRate            || 0,
        demandLevel:           src.demandLevel           || "MEDIUM",
        topSkills:             src.topSkills             || [],
        marketOutlook:         src.marketOutlook         || "NEUTRAL",
        keyTrends:             src.keyTrends             || [],
        recommendedSkills:     src.recommendedSkills     || [],
        demandTrends:          src.demandTrends          || [],
        futureOutlook:         src.futureOutlook         || [],
        careerRecommendations: src.careerRecommendations || [],
    };
};

// ── Main export ──────────────────────────────────────────────────────────────

export const generateAIInsights = async (industry, userSkills = [], experience = 0) => {
    const prompt = SYSTEM_INSTRUCTION + "\n\n" + buildInsightsPrompt(industry, userSkills, experience);
    let text = "";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        text = result.response.text();
    } catch (geminiErr) {
        console.warn("Gemini failed in generateAIInsights, falling back to Groq:", geminiErr?.message);
        const completion = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user", content: buildInsightsPrompt(industry, userSkills, experience) },
            ],
        });
        text = completion.choices[0]?.message?.content || "";
    }
    return parseInsightsResponse(text);
};
export async function getIndustryInsights() {
    const{userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { industryInsight: true },  // ← was missing: always caused AI call
    });

    if (!user) throw new Error("User not found");

    // Return cached data if it's still fresh
    if (user.industryInsight && user.industryInsight.nextUpdate > new Date()) {
        return user.industryInsight;
    }

    // Generate fresh insights personalized to the user
    const insights = await generateAIInsights(
        user.industry,
        user.skills || [],
        user.experience || 0,
    );

    const insightData = {
        salaryRanges:          insights.salaryRanges          || [],
        growthRate:            insights.growthRate            || 0,
        demandLevel:           insights.demandLevel           || "MEDIUM",
        topSkills:             insights.topSkills             || [],
        marketOutlook:         insights.marketOutlook         || "NEUTRAL",
        keyTrends:             insights.keyTrends             || [],
        recommendedSkills:     insights.recommendedSkills     || [],
        demandTrends:          insights.demandTrends          || [],
        futureOutlook:         insights.futureOutlook         || [],
        careerRecommendations: insights.careerRecommendations || [],
        lastUpdated:           new Date(),
        nextUpdate:            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const industryInsight = await db.industryInsights.upsert({
        where:  { industry: user.industry },
        update: insightData,
        create: { industry: user.industry, ...insightData },
    });

    return industryInsight;
}