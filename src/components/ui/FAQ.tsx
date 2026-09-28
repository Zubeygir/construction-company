"use client";

import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import { JsonLd, faqPageJsonLd } from "@/components/seo/JsonLd";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items, className = "" }: { items: FAQItem[], className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <MotionConfig reducedMotion="user">
      {/* Automate FAQPage Structured Data injection */}
      <JsonLd data={faqPageJsonLd(items)} />

      <div className={`border-t border-border ${className}`}>
        {items.map((item, index) => {
          const open = activeIndex === index;
          return (
            <div key={index} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  onClick={() => setActiveIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="type-title text-foreground">{item.question}</span>
                  <span aria-hidden className="shrink-0 text-cypress">
                    {open ? <RiSubtractLine className="size-6" /> : <RiAddLine className="size-6" />}
                  </span>
                </button>
              </h3>

              {/* DOM-persistent & height-animated for full search indexing */}
              <motion.div
                id={`faq-answer-${index}`}
                initial={false}
                animate={{ height: open ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden"
              >
                <p className="max-w-[68ch] pb-6 text-foreground">{item.answer}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
