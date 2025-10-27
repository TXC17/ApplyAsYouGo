"use client";

import React from "react";
import {
  IconRocket,
  IconFileText,
  IconFilter,
  IconClock,
  IconTerminal2,
  IconRobot,
  IconThumbUp,
  IconBulb,
  IconBolt,
} from "@tabler/icons-react";

const testimonials = [
  {
    name: "Siddharth Verma",
    role: "Front-end Developer",
    quote:
      "I think Apply As You Go has allowed me to market myself better in front of so many companies, and I now realize how much time I was wasting filling so many applications everyday.",
    icon: <IconRocket />,
  },
  {
    name: "Soumya",
    role: "Data Analyst",
    quote:
      "The resumes I made on proresume are truly professional - it feels like I wrote it.",
    icon: <IconFileText />,
  },
  {
    name: "Chahal Jain",
    role: "SDE 1",
    quote:
      "It's hard to find and filter jobs, but with Apply As You Go I was able to apply to multiple jobs in practically no time, that too were matching my domain.",
    icon: <IconFilter />,
  },
  {
    name: "Rahul Gupta",
    role: "Front-end Developer",
    quote:
      "Apply As You Go has really simplified my job search. I used to spend hours just finding the right jobs to apply for, now it's all done for me!",
    icon: <IconClock />,
  },
  {
    name: "Parth Agarwal",
    role: "DevOps Engineer",
    quote:
      "I can see the jobs getting applied right in front of my eyes! It's not some tie-up with some job board or just another job platform, this is the universal job board.",
    icon: <IconTerminal2 />,
  },
  {
    name: "Pankaja Karale",
    role: "Full-stack Developer",
    quote:
      "I think Apply As You Go helped me by saving hours of my time by filling applications and making resumes for me, and I was able to use that time to prepare for interviews.",
    icon: <IconRobot />,
  },
  {
    name: "Nisha Patel",
    role: "Marketing Specialist",
    quote:
      "I was skeptical at first, but Apply As You Go proved to be a game changer. The auto-apply feature is amazing, saved me so much hassle.",
    icon: <IconThumbUp />,
  },
  {
    name: "Rohit Khandelwal",
    role: "UI/UX Designer",
    quote:
      "The job recommendations are spot on! I don't have to sift through irrelevant jobs anymore. Apply As You Go does it all for me.",
    icon: <IconBulb />,
  },
  {
    name: "Vikram Singh",
    role: "Business Analyst",
    quote:
      "I used to miss out on job opportunities because of late applications. With Apply As You Go, I am always on top of the game.",
    icon: <IconBolt />,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            This is What We Have Heard
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            We would like you to try Apply As You Go and share what you think.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-900/50 hover:-translate-y-1"
            >
              <div className="mb-4 text-purple-400">{testimonial.icon}</div>
              <div className="mb-4 text-lg text-gray-300">
                "{testimonial.quote}"
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;