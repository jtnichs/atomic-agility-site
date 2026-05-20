"use client";

import { useState } from "react";

const domains = [
  {
    name: "Strategy and Investment Funding",
    topics: [
      "Define portfolio vision and strategic themes",
      "Connect portfolio to enterprise strategy",
      "Apply Lean budget guardrails",
      "Fund value streams over projects",
    ],
  },
  {
    name: "Agile Portfolio Operations",
    topics: [
      "Coordinate value streams and ARTs",
      "Support communities of practice",
      "Apply agile PMO practices",
      "Manage operational excellence",
    ],
  },
  {
    name: "Lean Governance",
    topics: [
      "Measure portfolio performance",
      "Apply portfolio-level metrics",
      "Manage epic and initiative compliance",
      "Forecast and dynamically re-plan",
    ],
  },
  {
    name: "Lean Portfolio Management Adoption",
    topics: [
      "Assess current portfolio state",
      "Define the portfolio canvas",
      "Build an LPM adoption roadmap",
      "Lead organizational change",
    ],
  },
];

export default function LPMExamDomainAccordion() {
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
              <span className="text-lg font-semibold text-white">
                {domain.name}
              </span>
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
