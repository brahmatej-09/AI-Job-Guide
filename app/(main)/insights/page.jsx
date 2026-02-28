import React from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const levelColor = {
  HIGH:     "bg-green-100 text-green-800",
  MEDIUM:   "bg-yellow-100 text-yellow-800",
  LOW:      "bg-red-100 text-red-800",
};

const outlookColor = {
  POSITIVE: "text-green-600",
  NEUTRAL:  "text-yellow-600",
  NEGATIVE: "text-red-600",
};

const InsightsPage = async () => {
  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto p-6 mt-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Industry Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered analysis personalized to your industry and skills.
          {insights.lastUpdated && (
            <span className="ml-2 text-xs">
              Last updated: {new Date(insights.lastUpdated).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Row 1 — Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Market Outlook</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${outlookColor[insights.marketOutlook] || ""}`}>
              {insights.marketOutlook}
            </div>
            <p className="text-sm text-muted-foreground">Overall market sentiment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Demand Level</CardTitle></CardHeader>
          <CardContent>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${levelColor[insights.demandLevel] || ""}`}>
              {insights.demandLevel}
            </span>
            <p className="text-sm text-muted-foreground mt-2">Current hiring demand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Growth Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{insights.growthRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">Annual industry growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top In-Demand Skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {insights.topSkills?.map((skill, i) => (
              <Badge key={i} variant="secondary">{skill}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recommended Skills to Learn</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {insights.recommendedSkills?.map((skill, i) => (
              <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-200">{skill}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Salary Ranges */}
      <Card>
        <CardHeader><CardTitle>Salary Ranges by Role</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.salaryRanges?.map((range, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3">
                <div>
                  <div className="font-medium">{range.role}</div>
                  <div className="text-sm text-muted-foreground">{range.location}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-700">${range.median?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    ${range.min?.toLocaleString()} – ${range.max?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 4 — Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Key Industry Trends</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.keyTrends?.map((trend, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-blue-500 mt-0.5">▸</span>{trend}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Demand Trends</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.demandTrends?.length > 0
                ? insights.demandTrends.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500 mt-0.5">▸</span>{t}
                    </li>
                  ))
                : <p className="text-sm text-muted-foreground">No demand trend data yet.</p>
              }
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Row 5 — Future Outlook */}
      <Card>
        <CardHeader><CardTitle>Future Outlook</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {["1–2 Year", "3–5 Year", "5+ Year"].map((label, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">{label}</div>
                <p className="text-sm">{insights.futureOutlook?.[i] || "—"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 6 — Career Recommendations */}
      <Card>
        <CardHeader><CardTitle>Personalized Career Recommendations</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.careerRecommendations?.length > 0
              ? insights.careerRecommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))
              : <p className="text-sm text-muted-foreground">No recommendations yet.</p>
            }
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPage;

