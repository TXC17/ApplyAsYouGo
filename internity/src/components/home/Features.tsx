"use client";

import React, { useEffect, useState } from "react";
import PixelCard from "../PixelCard/PixelCard";
import { Search, Target, FileText, Send } from "lucide-react";

const Features = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client side
  }, []);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">

        {/* AI Tools Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered Tools for Effortless Job Search
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-justify">
              Leverage Apply As You Go to streamline your job search. Our AI-driven tools customize resumes based on your profile and job description, while filtering and ranking job postings, ensuring only the best-fit opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FeatureCard
              title="Job Search with ease"
              description="Axios analyzes your profile and the job description to provide you with the jobs that are best compatible with you."
            />
            <FeatureCard
              title="On-demand Resumes"
              description="ProAI detects your skills and job roles from your profile."
            />
          </div>
        </div>

        {/* 4-Step Process */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Works like Magic, but How?
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-justify">
            Choose the jobs you like. We take care of the rest. Our goal is to help you find the best job offers quickly and with the least possible effort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isClient &&
            steps.map(({ icon: Icon, title, desc, points, color }, idx) => (
              <PixelCard key={idx} variant="blue">
                <div className="absolute p-4 flex flex-col items-center text-center">
                  <Icon className={`w-5 h-5 mb-2 ${color}`} />
                  <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
                  <p className="text-neutral-300 text-xs mb-2">{desc}</p>
                  <ul className="text-xs text-neutral-400 list-disc text-left space-y-0.5 ml-4">
                    {points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </PixelCard>
            ))}
        </div>

      </div>
    </section>
  );
};

const steps = [
  {
    icon: Search,
    color: "text-blue-500",
    title: "Search",
    desc: "We surface roles that match your skills and preferences.",
    points: ["Live job sourcing", "Domain/location filter", "No duplicates"],
  },
  {
    icon: Target,
    color: "text-green-500",
    title: "Match",
    desc: "AI matches your experience with jobs.",
    points: ["Skill matching", "Gap detection", "Ranked listings"],
  },
  {
    icon: FileText,
    color: "text-yellow-400",
    title: "Generate",
    desc: "Create ATS-friendly resumes instantly.",
    points: ["Skill-focused output", "Formats supported", "Easy customization"],
  },
  {
    icon: Send,
    color: "text-purple-500",
    title: "Apply",
    desc: "Auto-apply with personalized docs.",
    points: ["1-click apply", "Track application", "Email updates"],
  },
];

// Centered Feature Cards
const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/10 to-transparent rounded-2xl p-8 backdrop-blur-sm border border-purple-900/20 h-48 flex flex-col justify-center items-center text-center">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs">{description}</p>
    </div>
  );
};

export default Features;
