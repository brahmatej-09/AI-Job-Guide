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

    const { messages, targetRole } = await req.json();

    const systemInstruction = `You are an expert Technical Recruiter conducting a mock interview for a ${targetRole} position.
      
      Rules:
      1. Ask one question at a time.
      2. Wait for the user's answer.
      3. Provide brief, constructive feedback on their answer.
      4. Then ask the next question.
      5. Keep the tone professional but encouraging.
      6. If the user asks for a hint, provide a small clue without giving away the answer.
      7. After 5 questions, provide a final summary of their performance.`;

    const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "Start the interview.";
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    // Groq requires conversations to start with a user message after system.
    // If history begins with an assistant message (the opening question), prepend a user turn.
    const normalizedHistory = [];
    if (history.length > 0 && history[0].role === "assistant") {
      normalizedHistory.push({ role: "user", content: "Start the interview." });
    }
    normalizedHistory.push(...history);

    let responseText = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const chatHistory = [
        ...normalizedHistory.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
      ];
      const chat = model.startChat({ history: chatHistory, systemInstruction });
      const result = await chat.sendMessage(lastMessage);
      responseText = result.response.text();
    } catch (geminiErr) {
      console.warn("Gemini failed in interview, falling back to Groq:", geminiErr?.message);
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          ...normalizedHistory,
          { role: "user", content: lastMessage },
        ],
      });
      responseText = completion.choices[0]?.message?.content || "";
    }

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Mock Interview Error:", error?.message || error);
    return NextResponse.json({ text: `Error: ${error?.message || "Unknown error"}` }, { status: 500 });
  }
}
