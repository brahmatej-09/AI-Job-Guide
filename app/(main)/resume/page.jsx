"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── helpers ────────────────────────────────────────────────────────────────────
const emptyExp = () => ({ title: "", company: "", duration: "", bullets: "" });
const emptyEdu = () => ({ degree: "", institution: "", year: "", gpa: "" });
const emptyProj = () => ({ name: "", tech: "", description: "" });

const Label = ({ children }) => (
  <p className="text-sm font-medium mb-1">{children}</p>
);

const SectionHeader = ({ title, onAdd, addLabel }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold text-base">{title}</h2>
    <button
      type="button"
      onClick={onAdd}
      className="text-xs text-primary border border-primary rounded px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      + {addLabel}
    </button>
  </div>
);

// ── main component ─────────────────────────────────────────────────────────────
const ResumeBuilderPage = () => {
  const printRef = useRef(null);

  // form state
  const [personalInfo, setPersonalInfo] = useState({
    name: "", email: "", phone: "", location: "", linkedin: "", github: "",
  });
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState([emptyExp()]);
  const [education, setEducation] = useState([emptyEdu()]);
  const [projects, setProjects] = useState([emptyProj()]);

  // output state
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── personal info helper
  const setPI = (field, val) => setPersonalInfo((p) => ({ ...p, [field]: val }));

  // ── array field helpers
  const updateArr = (setter, index, field, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  const removeArr = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  // ── generate
  const generateResume = async () => {
    if (!personalInfo.name || !targetRole) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalInfo, targetRole, skills, experience, education, projects }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResume(data);
      setTimeout(() => printRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── download as PDF via print
  const handleDownload = () => {
    const content = document.getElementById("resume-printable").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${personalInfo.name} - Resume</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; color: #111; background: #fff; padding: 40px 50px; font-size: 13px; line-height: 1.5; }
            h1 { font-size: 26px; font-weight: bold; margin-bottom: 2px; }
            .contact { color: #444; font-size: 12px; margin-bottom: 14px; }
            .contact span { margin-right: 12px; }
            h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #111; padding-bottom: 3px; margin: 16px 0 8px; }
            .summary { margin-bottom: 6px; }
            .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
            .skill-tag { background: #f0f0f0; border-radius: 3px; padding: 2px 8px; font-size: 11px; }
            .exp-header { display: flex; justify-content: space-between; font-weight: bold; }
            .exp-sub { color: #555; font-size: 12px; margin-bottom: 4px; }
            ul { padding-left: 18px; }
            li { margin-bottom: 2px; }
            .edu-row { display: flex; justify-content: space-between; }
            .proj-name { font-weight: bold; }
            .proj-tech { color: #555; font-size: 11px; }
            @media print { body { padding: 20px 28px; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="container mx-auto p-6 mt-8 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <p className="text-muted-foreground mt-1">Fill in your details and let AI craft an ATS-friendly resume.</p>
      </div>

      {/* ── FORM ── */}
      <div className="space-y-6">

        {/* Personal Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Full Name *", "name", "John Doe"],
              ["Target Role *", null, "e.g. Full Stack Developer"],
              ["Email", "email", "john@example.com"],
              ["Phone", "phone", "+1 234 567 8900"],
              ["Location", "location", "San Francisco, CA"],
              ["LinkedIn URL", "linkedin", "linkedin.com/in/johndoe"],
              ["GitHub URL", "github", "github.com/johndoe"],
            ].map(([label, field, placeholder]) =>
              field === null ? (
                <div key="role">
                  <Label>Target Role *</Label>
                  <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder={placeholder} />
                </div>
              ) : (
                <div key={field}>
                  <Label>{label}</Label>
                  <Input value={personalInfo[field]} onChange={(e) => setPI(field, e.target.value)} placeholder={placeholder} />
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
          <CardContent>
            <Label>Enter skills (comma-separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, TypeScript, PostgreSQL, Docker..." />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <SectionHeader title="Work Experience" onAdd={() => setExperience((p) => [...p, emptyExp()])} addLabel="Add Experience" />
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                {experience.length > 1 && (
                  <button type="button" onClick={() => removeArr(setExperience, i)} className="absolute top-3 right-3 text-xs text-red-500 hover:underline">Remove</button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Job Title</Label><Input value={exp.title} onChange={(e) => updateArr(setExperience, i, "title", e.target.value)} placeholder="Software Engineer" /></div>
                  <div><Label>Company</Label><Input value={exp.company} onChange={(e) => updateArr(setExperience, i, "company", e.target.value)} placeholder="Google" /></div>
                  <div><Label>Duration</Label><Input value={exp.duration} onChange={(e) => updateArr(setExperience, i, "duration", e.target.value)} placeholder="Jan 2023 – Present" /></div>
                </div>
                <div>
                  <Label>Key Responsibilities / Achievements</Label>
                  <Textarea value={exp.bullets} onChange={(e) => updateArr(setExperience, i, "bullets", e.target.value)} placeholder="Describe what you did, built, or improved. One point per line." className="h-28" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <SectionHeader title="Education" onAdd={() => setEducation((p) => [...p, emptyEdu()])} addLabel="Add Education" />
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="border rounded-lg p-4 relative">
                {education.length > 1 && (
                  <button type="button" onClick={() => removeArr(setEducation, i)} className="absolute top-3 right-3 text-xs text-red-500 hover:underline">Remove</button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Degree / Qualification</Label><Input value={edu.degree} onChange={(e) => updateArr(setEducation, i, "degree", e.target.value)} placeholder="B.Tech Computer Science" /></div>
                  <div><Label>Institution</Label><Input value={edu.institution} onChange={(e) => updateArr(setEducation, i, "institution", e.target.value)} placeholder="MIT" /></div>
                  <div><Label>Year</Label><Input value={edu.year} onChange={(e) => updateArr(setEducation, i, "year", e.target.value)} placeholder="2019 – 2023" /></div>
                  <div><Label>GPA / Score (optional)</Label><Input value={edu.gpa} onChange={(e) => updateArr(setEducation, i, "gpa", e.target.value)} placeholder="3.8 / 4.0" /></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <SectionHeader title="Projects" onAdd={() => setProjects((p) => [...p, emptyProj()])} addLabel="Add Project" />
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                {projects.length > 1 && (
                  <button type="button" onClick={() => removeArr(setProjects, i)} className="absolute top-3 right-3 text-xs text-red-500 hover:underline">Remove</button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => updateArr(setProjects, i, "name", e.target.value)} placeholder="SensAI" /></div>
                  <div><Label>Technologies Used</Label><Input value={proj.tech} onChange={(e) => updateArr(setProjects, i, "tech", e.target.value)} placeholder="Next.js, Prisma, PostgreSQL" /></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={proj.description} onChange={(e) => updateArr(setProjects, i, "description", e.target.value)} placeholder="What did you build, what problem did it solve, what was the impact?" className="h-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">Error: {error}</p>}

        <Button
          onClick={generateResume}
          disabled={loading || !personalInfo.name || !targetRole}
          size="lg"
          className="w-full"
        >
          {loading ? "Generating Resume..." : "✨ Generate Resume"}
        </Button>
      </div>

      {/* ── RESUME PREVIEW ── */}
      {resume && (
        <div ref={printRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Resume</h2>
            <Button onClick={handleDownload} variant="outline">
              ⬇ Download PDF
            </Button>
          </div>

          {/* Printable resume */}
          <div
            id="resume-printable"
            className="bg-white text-black rounded-lg border shadow-md p-10 font-serif text-sm leading-relaxed"
          >
            {/* Header */}
            <h1 className="text-3xl font-bold text-black">{resume.name || personalInfo.name}</h1>
            <p className="text-gray-500 text-xs mt-1 mb-4 space-x-3">
              {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github]
                .filter(Boolean)
                .map((v, i) => <span key={i}>{v}</span>)}
            </p>

            {/* Summary */}
            {resume.summary && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Summary</h2>
                <p className="text-gray-800">{resume.summary}</p>
              </section>
            )}

            {/* Skills */}
            {resume.skills?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((s, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs border border-gray-300">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {resume.experience?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Experience</h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{exp.title}</p>
                          <p className="text-gray-600 text-xs">{exp.company}</p>
                        </div>
                        <p className="text-gray-500 text-xs shrink-0 ml-4">{exp.duration}</p>
                      </div>
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-800">
                        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resume.education?.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Education</h2>
                <div className="space-y-2">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{edu.degree}</p>
                        <p className="text-gray-600 text-xs">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                      </div>
                      <p className="text-gray-500 text-xs shrink-0 ml-4">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {resume.projects?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Projects</h2>
                <div className="space-y-3">
                  {resume.projects.map((proj, i) => (
                    <div key={i}>
                      <p className="font-bold text-sm">
                        {proj.name}
                        {proj.tech && <span className="font-normal text-gray-500 text-xs ml-2">· {proj.tech}</span>}
                      </p>
                      <p className="text-gray-800 mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
