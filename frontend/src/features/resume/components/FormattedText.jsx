import React from "react";

/**
 * FormattedText: Parses lightweight formatting in resume content
 * Supports:
 * - **bold text** -> <strong className="font-bold">
 * - __underlined text__ or <u>underlined text</u> -> <u className="underline underline-offset-2">
 * - *italic text* -> <em className="italic">
 */
export const FormattedText = ({ text }) => {
  if (!text || typeof text !== "string") return text || null;

  // Regex matches: **bold**, __underline__, <u>underline</u>, *italic*
  const pattern = /(\*\*[\s\S]*?\*\*|__[\s\S]*?__|<u>[\s\S]*?<\/u>|\*[\s\S]*?\*)/g;
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={index} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith("__") && part.endsWith("__") && part.length >= 4) {
          return (
            <u key={index} className="underline underline-offset-2">
              {part.slice(2, -2)}
            </u>
          );
        }

        if (part.startsWith("<u>") && part.endsWith("</u>") && part.length >= 7) {
          return (
            <u key={index} className="underline underline-offset-2">
              {part.slice(3, -4)}
            </u>
          );
        }

        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

export default FormattedText;
