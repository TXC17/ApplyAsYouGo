"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

import Aurora from '@/components/Aurora/Aurora';

const blogPosts = [
  {
    title: 'How AI is Revolutionizing the Job Search Process',
    excerpt: 'Artificial Intelligence is transforming how job seekers find and apply for jobs. Learn how Proism is leading this revolution.',
    date: 'March 10, 2025',
    category: 'Technology',
    slug: 'https://blog.theinterviewguys.com/how-ai-is-revolutionizing-the-job-search-process/'
  },
  {
    title: 'The Future of Resume Building: Automation and Personalization',
    excerpt: 'Discover how automated resume building tools are helping job seekers create personalized resumes that stand out to employers.',
    date: 'February 28, 2025',
    category: 'Career Tips',
    slug: 'https://www.linkedin.com/pulse/future-resume-writing-services-ai-automation-free-resume-builder-zf0oc/'
  },
  {
    title: '5 Ways to Make Your Job Application Stand Out in 2025',
    excerpt: 'With increasing competition in the job market, here are 5 expert tips to ensure your application catches the recruiter\'s attention.',
    date: 'February 15, 2025',
    category: 'Career Tips',
    slug: 'https://resumod.co/blog/10-ai-driven-job-search-trends-to-watch-in-2025/'
  },
  {
    title: 'Why Personalized Resumes Get More Interviews',
    excerpt: 'Research shows that personalized resumes tailored to specific job descriptions are more likely to result in interview invitations.',
    date: 'January 25, 2025',
    category: 'Research',
    slug: 'https://resume.io/blog/customize-resume-for-each-application'
  },
];

export default function BlogPage() {
  return (
    <MainLayout>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Apply As You Go Blogs</h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              Insights, tips, and updates on job searching, resume building, and career development.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="overflow-hidden transition-all duration-300 border rounded-xl bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-purple-900/30 hover:-translate-y-1"
              >
                <div className="h-48 bg-purple-900/20" aria-hidden="true"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <span>{post.category}</span>
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{post.title}</h3>
                  <p className="mb-6 text-sm text-gray-400">{post.excerpt}</p>
                  <Link href={post.slug}>
                    <Button variant="link" className="p-0 text-purple-400 hover:text-purple-300">
                      Read More
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          
          
        </div>
      </section>

      
    </MainLayout>
  );
}
