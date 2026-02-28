"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Triggers earlier (at 60px) so the user sees it immediately
      if (imageElement && scrollPosition > 60) {
        imageElement.classList.add("scrolled");
      } else if (imageElement) {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-28 md:pt-36 pb-10 px-4">
      <div className="space-y-10 text-center">
        <div className="space-y-6 mx-auto">
          {/* Large, high-contrast gradient title matching reference pics */}
          <h1 className="text-5xl font-extrabold md:text-7xl lg:text-8xl gradient bg-clip-text text-transparent pb-2 tracking-tighter leading-tight">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          
          <p className="mx-auto max-w-[600px] text-zinc-400 text-lg md:text-xl leading-relaxed">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          {/* THE FLOATING FEATURE: Wrapper for the button movement */}
          <div className="animate-float">
            <Link href="/onBoarding">
              <Button size="lg" className="px-10 h-14 bg-white text-black hover:bg-zinc-200 transition-all rounded-full text-lg font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Get Started
              </Button>
            </Link>
          </div>

          <Link href="/onBoarding">
            <Button size="lg" variant="outline" className="px-10 h-14 border-zinc-700 text-white hover:bg-zinc-900 rounded-full text-lg">
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* IMAGE SLIDING FEATURE: Constrained width for a "perfect" look */}
        <div className="hero-image-wrapper mt-8 md:mt-12" ref={imageRef}>
          <div className="relative max-w-5xl mx-auto">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border border-white/10 mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;