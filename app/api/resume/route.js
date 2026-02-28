import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { personalInfo, targetRole, skills, experience, education, projects } = await req.json();

    const expText = experience
      .filter((e) => e.title || e.company)
      .map((e) => `- ${e.title} at ${e.company} (${e.duration})\n  ${e.bullets}`)
      .join("\n");

    const eduText = education
      .filter((e) => e.degree || e.institution)
      .map((e) => `- ${e.degree}, ${e.institution} (${e.year})${e.gpa ? `, GPA: ${e.gpa}` : ""}`)
      .join("\n");

    const projText = projects
      .filter((p) => p.name)
      .map((p) => `- ${p.name} [${p.tech}]: ${p.description}`)
      .join("\n");

    const prompt = `You are an expert Resume Writer and ATS Optimizer. Rewrite and enhance the following resume information for a ${targetRole} role into a polished, professional, ATS-friendly format.

Candidate: ${personalInfo.name}
Target Role: ${targetRole}
Skills: ${skills}

Work Experience:
${expText || "None provided"}

Education:
${eduText || "None provided"}

Projects:
${projText || "None provided"}

Rules:
1. Rewrite experience bullets to start with strong action verbs and add measurable impact where logical.
2. Generate a compelling 2-3 sentence professional summary tailored to the ${targetRole} role.
3. Parse skills into a clean array.
4. Keep education and project data as-is but polish descriptions.
5. Output ONLY valid JSON — no markdown, no extra text.

Return exactly this JSON structure:
{
  "name": "${personalInfo.name}",
  "summary": "Professional summary here...",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company",
      "duration": "Jan 2023 – Present",
      "bullets": ["Strong bullet 1", "Strong bullet 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree",
      "institution": "School",
      "year": "2019–2023",
      "gpa": "3.8"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tech": "Tech stack",
      "description": "High-impact description"
    }
  ]
}`;

    let text = null;

    // Try Gemini first, fallback to Groq
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (geminiErr) {
      console.warn("Gemini failed, falling back to Groq:", geminiErr?.message);
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });
      text = completion.choices[0]?.message?.content || "";
    }

    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    console.error("Resume Builder Error:", error?.message || error);
    return NextResponse.json({ error: "Failed to generate resume: " + (error?.message || "Unknown error") }, { status: 500 });
  }
}
