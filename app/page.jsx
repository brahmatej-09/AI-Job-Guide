import Link from "next/link";
import Hero from "@/components/hero";
import { 
  BrainCircuit, Briefcase, LineChart, FileText, 
  UserPlus, FileEdit, Users2, TrendingUp, ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const features = [
  { title: "AI-Powered Career Guidance", description: "Get personalized career advice and insights powered by advanced AI technology.", icon: <BrainCircuit className="w-12 h-12 mb-4 text-white" /> },
  { title: "Interview Preparation", description: "Practice with role-specific questions and get instant feedback to improve your performance.", icon: <Briefcase className="w-12 h-12 mb-4 text-white" /> },
  { title: "Industry Insights", description: "Stay ahead with real-time industry trends, salary data, and market analysis.", icon: <LineChart className="w-12 h-12 mb-4 text-white" /> },
  { title: "Smart Resume Creation", description: "Generate ATS-optimized resumes with AI assistance.", icon: <FileText className="w-12 h-12 mb-4 text-white" /> },
];

const stats = [
  { label: "Industries Covered", value: "50+" },
  { label: "Interview Questions", value: "1000+" },
  { label: "Success Rate", value: "95%" },
  { label: "AI Support", value: "24/7" },
];

const howItWorks = [
  { title: "Professional Onboarding", description: "Share your industry and expertise for personalized guidance", icon: <UserPlus className="w-8 h-8 text-white" /> },
  { title: "Craft Your Documents", description: "Create ATS-optimized resumes and compelling cover letters", icon: <FileEdit className="w-8 h-8 text-white" /> },
  { title: "Prepare for Interviews", description: "Practice with AI-powered mock interviews tailored to your role", icon: <Users2 className="w-8 h-8 text-white" /> },
  { title: "Track Your Progress", description: "Monitor improvements with detailed performance analytics", icon: <TrendingUp className="w-8 h-8 text-white" /> },
];

const testimonials = [
  { name: "Vamika Singh", role: "Software Engineer", company: "Tech Giant Co.", quote: "The AI-powered interview prep was a game-changer. Landed my dream job at a top tech company!" },
  { name: "Ravi Verma", role: "Product Manager", company: "StartUp Inc.", quote: "The industry insights helped me pivot my career successfully. The salary data was spot-on!" },
  { name: "Priya Patel", role: "Marketing Director", company: "Global Corp", quote: "My resume's ATS score improved significantly. Got more interviews in two weeks than in six months!" },
];

const faqs = [
  { q: "What makes AiJobGuide unique as a career development tool?", a: "AiJobGuide combines AI-powered career tools with industry-specific insights to help you advance your career. Our platform offers three main features: an intelligent resume builder, a cover letter generator, and an adaptive interview preparation system." },
  { q: "How does AiJobGuide create tailored content?", a: "AiJobGuide learns about your industry, experience, and skills during onboarding. It then uses this information to generate customized resumes, cover letters, and interview questions. The content is specifically aligned with your professional background." },
  { q: "How accurate and up-to-date are AiJobGuide's industry insights?", a: "We update our industry insights weekly using advanced AI analysis of current market trends. This includes salary data, in-demand skills, and industry growth patterns." },
  { q: "Is my data secure with AiJobGuide?", a: "Absolutely. We prioritize the security of your professional information. All data is encrypted and securely stored using industry-standard practices. We use Clerk for authentication." },
  { q: "How can I track my interview preparation progress?", a: "AiJobGuide tracks your performance across multiple practice interviews, providing detailed analytics and improvement suggestions." },
  { q: "Can I edit the AI-generated content?", a: "Yes! While AiJobGuide generates high-quality initial content, you have full control to edit and customize all generated resumes, cover letters, and other content." },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* 1. Grid Background - Fixed and correctly masked via globals.css */}
      <div className="grid-background" />

      <div className="relative z-10">
        <Hero />

        {/* 2. Stats Section */}
        <section className="py-20 border-y border-zinc-800/50 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{stat.value}</h3>
                  <p className="text-zinc-400 text-sm uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16 tracking-tight">Powerful Features for Your Career Growth</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {features.map((feature, i) => (
                <Card key={i} className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="bg-zinc-800/50 p-3 rounded-xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section className="py-24 bg-zinc-900/10 border-y border-zinc-800/30 text-center px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg mb-16">Four simple steps to accelerate your career growth</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
              {howItWorks.map((step, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-zinc-500 transition-all duration-300 shadow-xl">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Testimonials Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16 tracking-tight">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonials.map((t, i) => (
                <Card key={i} className="bg-zinc-900/30 border-zinc-800 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                      <div>
                        <h4 className="text-white font-bold">{t.name}</h4>
                        <p className="text-zinc-500 text-xs">{t.role} • {t.company}</p>
                      </div>
                    </div>
                    <p className="text-zinc-300 italic text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="py-24 px-4 bg-zinc-900/10">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-zinc-400">Find answers to common questions about our platform</p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-zinc-800 bg-zinc-900/20 px-6 rounded-lg">
                  <AccordionTrigger className="text-white hover:no-underline text-left py-6">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-zinc-400 pb-6 leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 7. Final CTA Section - Floating button included */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-12 md:p-24 text-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <h2 className="text-4xl md:text-7xl font-bold text-black mb-8 tracking-tighter">Ready to Accelerate Your Career?</h2>
            <p className="text-zinc-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who are advancing their careers with AI-powered guidance.
            </p>
            <div className="animate-float inline-block">
              <Link href="/dashboard">
                <Button size="lg" className="bg-black text-white hover:bg-zinc-800 px-12 h-16 text-xl rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Start Your Journey Today <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}