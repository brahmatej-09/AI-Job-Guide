import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { currentRole, targetRole, skills } = await req.json();

    const systemInstruction = `You are an expert Career Coach.
      
      Your task is to generate a 3-step professional progression plan based on the user's current skills and target role.
      
      Rules:
      1. Provide exactly 3 milestones.
      2. Each milestone should have a clear goal and actionable tasks.
      3. Output ONLY valid JSON in this exact format:
      {
        "milestones": [
          {
            "step": 1,
            "title": "Milestone Title",
            "description": "Brief description of the goal",
            "tasks": ["Task 1", "Task 2", "Task 3"]
          }
        ]
      }
      
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`;

    const prompt = `Current Role: ${currentRole}\nTarget Role: ${targetRole}\nCurrent Skills: ${skills}`;
    let text = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(systemInstruction + "\n\n" + prompt);
      text = result.response.text();
    } catch (geminiErr) {
      console.warn("Gemini failed in career-path, falling back to Groq:", geminiErr?.message);
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
      });
      text = completion.choices[0]?.message?.content || "";
    }

    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    console.error("Career Path Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
