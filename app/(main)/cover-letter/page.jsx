"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Label = ({ children }) => <p className="text-sm font-medium mb-1">{children}</p>;

const CoverLetterPage = () => {
  const printRef = useRef(null);

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    skills: "",
    experience: "",
    whyCompany: "",
    tone: "professional",
  });

  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const generateLetter = async () => {
    if (!form.applicantName || !form.companyName || !form.jobTitle) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLetter(data);
      setTimeout(() => printRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const paras = letter.paragraphs || (letter.body ? letter.body.split("\n\n").filter(Boolean) : []);
    const paragraphs = paras
      .map((p) => `<p style="margin-bottom:14px;">${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cover Letter – ${form.applicantName}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; color: #111; background: #fff; padding: 50px 60px; font-size: 13px; line-height: 1.7; max-width: 800px; }
            .header { margin-bottom: 28px; }
            .header h1 { font-size: 20px; font-weight: bold; }
            .header p { color: #555; font-size: 12px; }
            .date { margin-bottom: 20px; color: #444; font-size: 12px; }
            .subject { font-weight: bold; margin-bottom: 20px; }
            .body p { margin-bottom: 14px; }
            .sign { margin-top: 24px; }
            @media print { body { padding: 20px 28px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${form.applicantName}</h1>
            <p>${[form.applicantEmail, form.applicantPhone].filter(Boolean).join(" · ")}</p>
          </div>
          <div class="date">${today}</div>
          <div class="subject">Re: ${letter.subject}</div>
          <div class="body">${paragraphs}</div>
          <div class="sign">
            <p>Sincerely,</p>
            <p style="margin-top:20px;font-weight:bold;">${form.applicantName}</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const canGenerate = form.applicantName && form.companyName && form.jobTitle;

  return (
    <div className="container mx-auto p-6 mt-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Cover Letter Builder</h1>
        <p className="text-muted-foreground mt-1">Fill in the details and let AI write a tailored cover letter for you.</p>
      </div>

      {/* ── FORM ── */}
      <div className="space-y-5">

        {/* Applicant Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Your Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Full Name *</Label>
              <Input value={form.applicantName} onChange={(e) => set("applicantName", e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.applicantEmail} onChange={(e) => set("applicantEmail", e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.applicantPhone} onChange={(e) => set("applicantPhone", e.target.value)} placeholder="+1 234 567 8900" />
            </div>
          </CardContent>
        </Card>

        {/* Job Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Job Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Company Name *</Label>
              <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Google" />
            </div>
            <div>
              <Label>Job Title *</Label>
              <Input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Software Engineer" />
            </div>
            <div className="sm:col-span-2">
              <Label>Job Description (paste key requirements)</Label>
              <Textarea value={form.jobDescription} onChange={(e) => set("jobDescription", e.target.value)} placeholder="Paste the job description or key requirements here..." className="h-28" />
            </div>
          </CardContent>
        </Card>

        {/* About You */}
        <Card>
          <CardHeader><CardTitle className="text-base">About You</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Relevant Skills</Label>
              <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, Node.js, TypeScript, Problem Solving..." />
            </div>
            <div>
              <Label>Relevant Experience / Achievements</Label>
              <Textarea value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Briefly describe your most relevant experience, projects, or achievements..." className="h-28" />
            </div>
            <div>
              <Label>Why this company?</Label>
              <Textarea value={form.whyCompany} onChange={(e) => set("whyCompany", e.target.value)} placeholder="What excites you about this specific company or role?" className="h-20" />
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">Error: {error}</p>}

        <Button onClick={generateLetter} disabled={loading || !canGenerate} size="lg" className="w-full">
          {loading ? "Generating Cover Letter..." : "✨ Generate Cover Letter"}
        </Button>
      </div>

      {/* ── PREVIEW ── */}
      {letter && (
        <div ref={printRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Cover Letter</h2>
            <Button onClick={handleDownload} variant="outline">⬇ Download PDF</Button>
          </div>

          <Card className="bg-white text-black dark:bg-white dark:text-black shadow-md">
            <CardContent className="p-10 font-serif text-sm leading-relaxed space-y-5">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-black">{form.applicantName}</h2>
                <p className="text-gray-500 text-xs mt-1">
                  {[form.applicantEmail, form.applicantPhone].filter(Boolean).join(" · ")}
                </p>
              </div>

              {/* Date + Subject */}
              <div className="space-y-1">
                <p className="text-gray-500 text-xs">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="font-semibold text-black">{letter.subject}</p>
              </div>

              {/* Body */}
              <div className="space-y-4 text-gray-800">
                {(letter.paragraphs || (letter.body ? letter.body.split("\n\n").filter(Boolean) : [])).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Sign-off */}
              <div className="pt-2 text-gray-800">
                <p>Sincerely,</p>
                <p className="font-bold mt-4 text-black">{form.applicantName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CoverLetterPage;
