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

    const {
      applicantName, applicantEmail, applicantPhone,
      companyName, jobTitle, jobDescription,
      skills, experience, whyCompany, tone,
    } = await req.json();

    const prompt = `You are a professional cover letter writer. Write a compelling, personalized cover letter based on the details below.

Applicant: ${applicantName}
Email: ${applicantEmail}
Phone: ${applicantPhone}
Target Role: ${jobTitle} at ${companyName}
Skills: ${skills}
Relevant Experience: ${experience}
Why this company: ${whyCompany}
Job Description Snippet: ${jobDescription || "Not provided"}
Tone: ${tone} (e.g. formal, enthusiastic, concise)

Rules:
1. Write exactly 4 paragraphs: opening hook, skills/experience match, why this company, closing CTA.
2. Keep the full letter under 400 words.
3. Do NOT use placeholder brackets like [Your Name] — use the actual provided values.
4. Match the requested tone.
5. Output ONLY valid JSON — no markdown, no extra text, no literal newlines inside string values.

Return exactly this JSON where each paragraph is a separate string in the array:
{
  "subject": "Application for ${jobTitle} – ${applicantName}",
  "paragraphs": [
    "Opening paragraph text",
    "Skills and experience paragraph text",
    "Why this company paragraph text",
    "Closing call-to-action paragraph text"
  ]
}`;

    let text = null;

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

    const cleaned = text
      .replace(/```(?:json)?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    // Sanitize: replace any literal newlines/tabs inside JSON string values
    // by processing character by character to avoid breaking the JSON structure
    let inString = false;
    let escaped = false;
    let sanitized = "";
    for (const ch of cleaned) {
      if (escaped) { sanitized += ch; escaped = false; continue; }
      if (ch === "\\") { escaped = true; sanitized += ch; continue; }
      if (ch === '"') { inString = !inString; sanitized += ch; continue; }
      if (inString && ch === "\n") { sanitized += "\\n"; continue; }
      if (inString && ch === "\r") { sanitized += "\\r"; continue; }
      if (inString && ch === "\t") { sanitized += "\\t"; continue; }
      sanitized += ch;
    }

    return NextResponse.json(JSON.parse(sanitized));
  } catch (error) {
    console.error("Cover Letter Error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate cover letter: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
