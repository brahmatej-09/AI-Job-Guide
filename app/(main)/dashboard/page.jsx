import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Mic, LineChart } from "lucide-react";

const DashboardPage = async () => {
  // Check if user is onboarded before showing the dashboard
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to the onboarding form
  if (!isOnboarded) {
    redirect("/onBoarding");
  }

  return (
    <div className="container mx-auto p-6 space-y-8 mt-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your career progress and tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Industry Insights Card */}
        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Insights</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Trends</div>
            <p className="text-xs text-muted-foreground mb-4">
              View latest market trends and salaries
            </p>
            <Link href="/insights">
              <Button variant="outline" className="w-full">View Insights</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mock Interview Card */}
        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mock Interview</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Practice</div>
            <p className="text-xs text-muted-foreground mb-4">
              AI-powered interview preparation
            </p>
            <Link href="/interview/mock">
              <Button variant="outline" className="w-full">Start Interview</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Resume Builder Card */}
        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Builder</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Optimize</div>
            <p className="text-xs text-muted-foreground mb-4">
              Tailor your resume with AI assistance
            </p>
            <Link href="/resume">
              <Button variant="outline" className="w-full">Edit Resume</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Career Path Card */}
        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Path</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Plan</div>
            <p className="text-xs text-muted-foreground mb-4">
              Map out your next professional steps
            </p>
            <Link href="/career-path">
              <Button variant="outline" className="w-full">View Path</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;