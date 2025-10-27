"use client"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "../hooks/use-outside-click"
import {
  FileQuestion,
  FileText,
  Download,
  Search,
  DollarSign,
  PuzzleIcon as PuzzlePiece,
  BarChart,
  CheckIcon as BrowserCheck,
  Briefcase,
} from "lucide-react"

export default function ExpandableFAQ() {
  const [active, setActive] = useState<(typeof faqs)[number] | boolean | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false)
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  const faqCategories = [
    { id: "all", name: "All" },
    { id: "prosearch", name: "Search" },
    { id: "proresume", name: "Resume" },
  ]

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQs</h2>
          <p className="text-gray-400">Do you have a question? We probably have answers.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full border transition-colors duration-200 ${
                category.id === activeCategory
                  ? "border-white text-white bg-gray-800"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <>
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 h-full w-full z-10"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {active && typeof active === "object" ? (
              <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.button
                  key={`button-${active.question}-${id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="flex absolute top-4 right-4 items-center justify-center bg-white dark:bg-gray-800 rounded-full h-8 w-8"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`card-${active.question}-${id}`}
                  ref={ref}
                  className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl overflow-hidden"
                >
                  <div className="flex justify-between items-start p-6">
                    <div className="flex items-center gap-4">
                      <motion.div layoutId={`icon-${active.question}-${id}`} className="text-purple-500">
                        {active.icon}
                      </motion.div>
                      <div>
                        <motion.h3
                          layoutId={`question-${active.question}-${id}`}
                          className="font-bold text-xl text-gray-900 dark:text-gray-100"
                        >
                          {active.question}
                        </motion.h3>
                        <motion.p
                          layoutId={`category-${active.category}-${id}`}
                          className="text-gray-500 dark:text-gray-400 text-sm"
                        >
                          {active.category === "prosearch"
                            ? "Search"
                            : active.category === "proresume"
                              ? "Resume"
                              : "General"}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      {active.answer}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>
          <ul className="max-w-3xl mx-auto w-full gap-4 space-y-4">
            {filteredFaqs.map((faq) => (
              <motion.div
                layoutId={`card-${faq.question}-${id}`}
                key={`card-${faq.question}-${id}`}
                onClick={() => setActive(faq)}
                className="p-4 flex justify-between items-center hover:bg-gray-800 rounded-xl cursor-pointer border border-gray-800"
              >
                <div className="flex gap-4 items-center">
                  <motion.div
                    layoutId={`icon-${faq.question}-${id}`}
                    className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center text-purple-500"
                  >
                    {faq.icon}
                  </motion.div>
                  <div>
                    <motion.h3 layoutId={`question-${faq.question}-${id}`} className="font-medium text-white">
                      {faq.question}
                    </motion.h3>
                    <motion.p layoutId={`category-${faq.category}-${id}`} className="text-gray-400 text-sm">
                      {faq.category === "prosearch"
                        ? "Search"
                        : faq.category === "proresume"
                          ? "Resume"
                          : "General"}
                    </motion.p>
                  </div>
                </div>
                <motion.button className="px-4 py-2 text-sm rounded-full font-medium bg-gray-700 hover:bg-purple-600 text-white">
                  Peep
                </motion.button>
              </motion.div>
            ))}
          </ul>
        </>
      </div>
    </section>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}

const faqs = [
  {
    question: "How is your resume different from other similar resume building apps?",
    answer:
      "Our resume builder at Apply As You Go is specifically designed for internship seekers, with templates and AI recommendations tailored to highlight relevant skills and experiences that matter most to internship recruiters. Unlike generic builders, we focus on showcasing academic projects, coursework, and transferable skills that make students and early-career professionals stand out, even with limited work experience.",
    category: "proresume",
    icon: <FileText size={24} />,
  },
  {
    question: "How many resume templates are available?",
    answer:
      "Apply As You Go offers 15+ professionally designed resume templates specifically optimized for internship applications. Each template is ATS-friendly, customizable to different industries, and comes in multiple color schemes. We regularly add new templates based on the latest recruiting trends and user feedback.",
    category: "proresume",
    icon: <Download size={24} />,
  },
  {
    question: "How do you ensure the resumes are customized to my domain?",
    answer:
      "Apply As You Go uses industry-specific AI analysis to tailor your resume to your target field. We analyze thousands of successful internship resumes across different domains to identify key skills, terminology, and formatting preferences. When you select your field of interest, our system automatically highlights relevant coursework and skills while suggesting improvements to match industry expectations.",
    category: "proresume",
    icon: <PuzzlePiece size={24} />,
  },
  {
    question: "Is it really free?",
    answer:
      "Yes! Apply As You Go offers a comprehensive free tier that includes basic resume building, internship searching, and application tracking. We believe in supporting students on their career journey without financial barriers. We do offer premium features for power users, such as advanced AI optimization, unlimited resume versions, and priority application insights, but you can absolutely use our core services at no cost.",
    category: "all",
    icon: <DollarSign size={24} />,
  },
  {
    question: "Is it like a job board?",
    answer:
      "Apply As You Go is more than a traditional job board. While we do aggregate internship opportunities from across the web, we also provide intelligent matching between your skills and internship requirements, application tracking, resume optimization for specific postings, and insights into company hiring patterns. Think of us as your complete internship search companion rather than just a listing service.",
    category: "prosearch",
    icon: <Briefcase size={24} />,
  },
  {
    question: "Why do I have to download an extension?",
    answer:
      "Our browser extension enables Apply As You Go to work seamlessly with job sites you already use. It allows us to analyze internship listings in real-time, provide compatibility scores as you browse, auto-fill applications, and track your application status across different platforms. The extension is lightweight, privacy-focused (we never collect personal browsing data), and significantly enhances your internship search experience.",
    category: "prosearch",
    icon: <BrowserCheck size={24} />,
  },
  {
    question: "Do you send the same resume with every job application?",
    answer:
      "Absolutely not! Apply As You Go encourages and facilitates resume customization for each application. Our system analyzes each internship posting and suggests specific modifications to highlight relevant skills and experiences. We make it easy to maintain multiple versions of your resume while ensuring consistency in your personal brand. This targeted approach significantly increases your chances of getting interviews.",
    category: "all",
    icon: <FileQuestion size={24} />,
  },
  {
    question: "Which internships can I see on Apply As You Go?",
    answer:
      "Apply As You Go aggregates internship opportunities from major job boards, company career pages, university career centers, and exclusive partnerships. We cover opportunities across technology, business, healthcare, engineering, arts, nonprofit sectors, and more. Our platform includes both paid and unpaid internships, remote and in-person positions, as well as summer programs and year-round opportunities.",
    category: "prosearch",
    icon: <Search size={24} />,
  },
  {
    question: "What is job compatibility score?",
    answer:
      "The job compatibility score is our proprietary algorithm that calculates how well your profile matches a specific internship opportunity. It analyzes factors like your skills, coursework, projects, experience level, and even writing style against the job description requirements and company hiring patterns. Scores range from 1-100, with anything above 70 suggesting you're a competitive candidate. The score helps you prioritize applications and identify skills you might want to develop.",
    category: "prosearch",
    icon: <BarChart size={24} />,
  },
]

