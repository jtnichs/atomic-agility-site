"use client";

import { useState } from "react";

const domains = [
  {
    name: "Adapting and Thriving with SAFe",
    weight: "7–9%",
    topics: [
      "Thrive in the age of disruption",
      "Build a Lean-Agile organization",
    ],
  },
  {
    name: "Building a Foundation with Mindset, Values and Principles",
    weight: "18–21%",
    topics: [
      "Lean-Agile mindset and SAFe Core Values",
      "Apply SAFe Lean-Agile principles",
      "Empower agility with AI",
    ],
  },
  {
    name: "Establishing Team and Technical Agility",
    weight: "7–9%",
    topics: [
      "Cross-functional Agile Teams",
      "Organize around value with Agile Release Trains (ARTs)",
      "Built-In Quality practices",
      "Continuous Delivery Pipeline with DevOps",
    ],
  },
  {
    name: "Product Development Flow",
    weight: "25–28%",
    topics: [
      "Customer-centricity and Design Thinking",
      "Prioritize the ART Backlog",
      "Participate in PI Planning",
      "Execute the PI",
    ],
  },
  {
    name: "Exploring Lean Portfolio Management",
    weight: "25–28%",
    topics: [
      "Define a SAFe Portfolio",
      "Connect Portfolio to enterprise strategy",
      "Maintain the Portfolio Vision",
      "Realize the Portfolio Vision through Epics",
      "Establish Portfolio flow",
      "Apply AI tools to LPM",
    ],
  },
  {
    name: "Leading the Change",
    weight: "7–9%",
    topics: [
      "Lead by example",
      "Lead the change",
      "Empower leaders with AI",
    ],
  },
];

export default function ExamDomainAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 divide-y divide-[#00487B] rounded-xl border border-[#00487B] overflow-hidden">
      {domains.map((domain, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={domain.name} className="bg-[#000E22]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-[#00234B]"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-white">
                  {domain.name}
                </span>
                <span className="rounded-full bg-[#00234B] px-3 py-0.5 text-sm font-medium text-[#00A5F0]">
                  {domain.weight}
                </span>
              </div>
              {/* Chevron icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 flex-shrink-0 text-[#00A5F0] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-6 pb-6">
                <ul className="space-y-2">
                  {domain.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3 text-[#94a3b8]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00A5F0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
