import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const cleanUrlText = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

const getAlignmentStyle = (align) => {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
};

const getSpacingClass = (spacing) => {
  if (spacing === "small") return "space-y-3";
  if (spacing === "large") return "space-y-7";
  return "space-y-5"; // medium default
};

const CorporateTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    fontFamily,
    themeColor,
    alignment = "left",
    spacing = "medium",
  } = data;

  const fontStyle = { fontFamily: fontFamily || "Times New Roman, serif" };
  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* corporate header: name on left, details on right if left aligned */}
      <header
        className={`flex ${alignment === "left" ? "justify-between" : alignment === "center" ? "flex-col items-center" : "flex-row-reverse justify-between"} items-center border-b-2 pb-4 ${getSectionMargin()}`}
        style={{ borderColor: themeColor }}
      >
        <h1
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
          style={{ color: themeColor }}
        >
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          className={`flex flex-col text-sm text-gray-700 font-medium ${alignment === "left" ? "items-end" : alignment === "center" ? "items-center mt-3" : "items-start"}`}
        >
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.linkedIn && (
            <span>{cleanUrlText(personalInfo.linkedIn)}</span>
          )}
          {personalInfo?.github && (
            <span>{cleanUrlText(personalInfo.github)}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <p className="text-[14.5px] leading-relaxed text-gray-800 italic">
            "{professionalSummary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Experience
          </h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {exp.role}
                  </h3>
                  <span className="text-[13px] text-gray-600">{exp.dates}</span>
                </div>
                <div className="text-[14px] text-gray-800 font-semibold mb-2">
                  {exp.company}
                </div>
                {exp.description && (
                  <ul
                    className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
                  >
                    {exp.description.split("\n").map((point, i) => {
                      const cleanPoint = point.replace(/^[-*]\s*/, "").trim();
                      return cleanPoint ? <li key={i}>{cleanPoint}</li> : null;
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
          <h2
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Education
          </h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {edu.institution}
                  </h3>
                  <div className="text-[14px] text-gray-800">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[13px] text-gray-600">{edu.dates}</span>
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
            <h2
              className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              {section.title}
            </h2>
            <div className={itemSpacing}>
              {section.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  {item.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] text-blue-600 hover:underline"
                          >
                            [Link]
                          </a>
                        )}
                      </h3>
                      <span className="text-[13px] text-gray-600">
                        {item.dates}
                      </span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14px] text-gray-800 font-semibold mb-2">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
                      >
                        {item.description.split("\n").map((point, i) => {
                          const cleanPoint = point
                            .replace(/^[-*]\s*/, "")
                            .trim();
                          return cleanPoint ? (
                            <li key={i}>{cleanPoint}</li>
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
          <h2
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-3 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Skills
          </h2>
          <p className="text-[14px] text-gray-800 font-medium leading-relaxed">
            {skills.join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default CorporateTemplate;
