"use client";

import { useState } from "react";

const domains = [
  {
    name: "Understanding Product Owner/Product Management Roles and Responsibilities",
    weight: "12–14%",
    topics: [
      "Applying SAFe to PO/PM Roles and Responsibilities",
      "Apply the Lean-Agile Mindset",
      "Explain Value Streams",
      "Apply Product Owner/Product Management Responsibilities",
    ],
  },
  {
    name: "PI Planning Preparation",
    weight: "17–19%",
    topics: [
      "Summarize PI Planning",
      "Explain the Solution Vision",
      "Forecast work through Roadmaps",
      "Planning Features",
      "Managing the ART Backlog and Kanban",
    ],
  },
  {
    name: "Leadership for PI Planning",
    weight: "14–16%",
    topics: [
      "Communicate the Vision in PI Planning",
      "Plan PI Objectives",
      "Organize and Manage Dependencies",
      "Analyze Risks",
    ],
  },
  {
    name: "Iteration Execution",
    weight: "28–30%",
    topics: [
      "Creating Stories",
      "Planning an Iteration",
      "Manage Flow with the Team Kanban",
      "Refine the Team Backlog",
      "Participate in the Iteration Review and Retrospective",
      "Support DevOps and Release on Demand",
    ],
  },
  {
    name: "PI Execution",
    weight: "10–12%",
    topics: [
      "Participate in the PO Sync",
      "Participate in the System Demo",
      "Innovation throughout the PI",
      "Understand how to Inspect and Adapt",
    ],
  },
  {
    name: "Apply AI to Product Roles",
    weight: "12–14%",
    topics: [
      "Understand AI Basics and Terminology",
      "Understand AI Prompting",
      "Understanding Risks and Responsible AI Use",
      "Augmenting Product Roles with AI",
    ],
  },
];

export default function PoPMExamDomainAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 divide-y divide-[#00487B] rounded-xl border border-[#00487B] overflow-hidden">
      {domains.map((domain, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={domain.name} className="bg-[#00234B]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-[#00487B]"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-lg font-semibold text-white">
                  {domain.name}
                </span>
                <span className="flex-shrink-0 rounded-full bg-[#000E22] px-3 py-0.5 text-sm font-medium text-[#00A5F0]">
                  {domain.weight}
                </span>
              </div>
              {/* Chevron icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-4 h-5 w-5 flex-shrink-0 text-[#00A5F0] transition-transform duration-200 ${
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
