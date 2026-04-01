import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

// Helper to ensure URLs are valid
const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const cleanUrlText = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

const ClassicTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    fontFamily,
    alignment = "left",
    spacing = "medium",
  } = data;

  const fontStyle = { fontFamily: fontFamily || "Georgia, serif" };

  const getAlignmentStyle = (align) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const getSpacingClass = (space) => {
    if (space === "small") return "space-y-3";
    if (space === "large") return "space-y-7";
    return "space-y-5"; // medium default
  };

  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* Header */}
      <header
        className={`mb-6 text-center ${alignment === "left" ? "!text-left" : alignment === "right" ? "!text-right" : ""}`}
      >
        <h1 className="text-4xl font-bold uppercase tracking-widest text-black mb-3">
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          className={`flex items-center flex-wrap gap-4 text-sm text-gray-700 ${alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start"}`}
        >
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Mail size={14} className="mr-1" /> {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone size={14} className="mr-1" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <a
              href={formatUrl(personalInfo.linkedIn)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Linkedin size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.linkedIn)}
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={formatUrl(personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Github size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.github)}
            </a>
          )}
          {personalInfo?.portfolio && (
            <a
              href={formatUrl(personalInfo.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Globe size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.portfolio)}
            </a>
          )}
        </div>
      </header>

      <div className="border-b border-black mb-6"></div>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-black">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {professionalSummary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px] text-black">
                    {exp.role}
                  </h3>
                  <span className="text-[13px] font-medium text-gray-700">
                    {exp.dates}
                  </span>
                </div>
                <div className="text-[14px] italic text-gray-800 mb-2">
                  {exp.company}
                </div>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 text-[13.5px] text-gray-800 space-y-1.5 leading-relaxed">
                    {exp.description.split("\n").map((point, i) => {
                      const cleanPoint = point.replace(/^[-*]\s*/, "").trim();
                      return cleanPoint ? (
                        <li key={i} className="pl-1">
                          {cleanPoint}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-black">
                    {edu.institution}
                  </h3>
                  <div className="text-[14px] text-gray-800">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[13px] font-medium text-gray-700">
                  {edu.dates}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections &&
        customSections.length > 0 &&
        customSections.map((section) => (
          <section key={section.id} className={getSectionMargin()}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
              {section.title}
            </h2>
            <div className={itemSpacing}>
              {section.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  {item.imageUrl && (
                    <div className="shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded shadow-sm border"
                      />
                    </div>
                  )}
                  <div className="grow">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[15px] text-black flex items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] text-gray-500 hover:text-black hover:underline transition-colors tracking-normal flex items-center"
                          >
                            <Globe size={11} className="mr-0.5 opacity-70" />{" "}
                            {cleanUrlText(item.link)}
                          </a>
                        )}
                      </h3>
                      <span className="text-[13px] font-medium text-gray-700">
                        {item.dates}
                      </span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14px] italic text-gray-800 mb-2">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[13.5px] text-gray-800 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
                      >
                        {item.description.split("\n").map((point, i) => {
                          const cleanPoint = point
                            .replace(/^[-*]\s*/, "")
                            .trim();
                          return cleanPoint ? (
                            <li key={i} className="pl-1">
                              {cleanPoint}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-black border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="text-[14px] text-gray-800 leading-relaxed font-medium">
            {skills.join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
