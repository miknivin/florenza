// components/TransparentAccordion.js
"use client";

import { useState } from "react";
import AccordionIcon from "../icons/AccordionIcon";

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="mb-2 overflow-hidden">
      {/* Header – Transparent background */}
      <button
        className="w-100 text-start p-3 bg-transparent text-light border-0 d-flex align-items-center justify-content-between"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <span style={{ fontWeight: 600 }} className="fw-700">
          {title}
        </span>
        <AccordionIcon
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: "#eee",
          }}
        />
      </button>

      {/* Content – Transparent with subtle bg */}
      <div
        style={{
          display: isOpen ? "block" : "none",
        }}
        className="p-3 bg-transparent"
      >
        <div className="rounded p-2">{children}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="bg-black font-roboto">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
