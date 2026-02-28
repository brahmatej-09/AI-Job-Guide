"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CareerPathPage = () => {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);

  const generatePath = async () => {
    if (!currentRole || !targetRole || !skills) return;
    setLoading(true);
    try {
      const res = await fetch("/api/career-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRole, targetRole, skills }),
      });
      const data = await res.json();
      setPath(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Career Path Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Map Your Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Current Role</label>
              <Input 
                value={currentRole} 
                onChange={(e) => setCurrentRole(e.target.value)} 
                placeholder="e.g. Junior Developer"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target Role</label>
              <Input 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Current Skills</label>
              <Input 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                placeholder="e.g. React, Node.js, SQL"
              />
            </div>
          </div>
          <Button onClick={generatePath} disabled={loading || !currentRole || !targetRole || !skills}>
            {loading ? "Generating Roadmap..." : "Generate Career Path"}
          </Button>
        </CardContent>
      </Card>

      {path && (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {path.milestones.map((milestone, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-primary-foreground group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {milestone.step}
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900">{milestone.title}</div>
                </div>
                <div className="text-slate-500 text-sm mb-3">{milestone.description}</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {milestone.tasks.map((task, j) => (
                    <li key={j}>{task}</li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerPathPage;
