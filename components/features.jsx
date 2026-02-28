import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Briefcase, LineChart, FileText } from "lucide-react";

const features = [
  {
    title: "AI-Powered Career Guidance",
    description: "Get personalized career advice and insights powered by advanced AI technology.",
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-white" />,
  },
  {
    title: "Interview Preparation",
    description: "Practice with role-specific questions and get instant feedback to improve your performance.",
    icon: <Briefcase className="w-10 h-10 mb-4 text-white" />,
  },
  {
    title: "Industry Insights",
    description: "Stay ahead with real-time industry trends, salary data, and market analysis.",
    icon: <LineChart className="w-10 h-10 mb-4 text-white" />,
  },
  {
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
    icon: <FileText className="w-10 h-10 mb-4 text-white" />,
  },
];

const Features = () => {
  return (
    <section className="w-full py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Slightly smaller section heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 tracking-tight">
          Powerful Features for Your Career Growth
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 transition-all duration-300"
            >
              <CardContent className="p-7 flex flex-col items-center text-center">
                <div className="flex justify-center items-center mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;