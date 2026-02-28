import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true, skills: true, experience: true },
    });

    const industry = user?.industry || "Software Engineering";
    const skills = user?.skills?.join(", ") || "General programming";
    const experience = user?.experience ?? 0;

    const prompt = `You are a technical interviewer. Generate exactly 10 multiple-choice interview questions for a candidate with the following profile:
- Industry/Role: ${industry}
- Skills: ${skills}
- Years of experience: ${experience}

Rules:
1. Each question must have exactly 4 options labeled A, B, C, D.
2. Exactly one option must be correct.
3. Include a short explanation (1-2 sentences) for why the correct answer is right.
4. Vary difficulty: mix easy, medium, and hard questions.
5. Output ONLY valid JSON — no markdown, no extra text.

Return this exact JSON structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the correct answer."
    }
  ]
}

correctIndex is 0-based (0=A, 1=B, 2=C, 3=D).`;

    let text = null;

    // Try Gemini first
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
      console.log("Interview Prep: used Gemini");
    } catch (geminiError) {
      console.warn("Gemini failed, falling back to Groq:", geminiError?.message);
      // Fallback to Groq
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt },
        ],
      });
      text = completion.choices[0]?.message?.content || "";
      console.log("Interview Prep: used Groq fallback");
    }

    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Interview Prep Error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate questions: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
