import React from "react";
import { Globe } from "lucide-react";

const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const getSpacingClass = (spacing) => {
  if (spacing === "small") return "space-y-3";
  if (spacing === "large") return "space-y-7";
  return "space-y-5"; // medium default
};

const ElegantTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    fontFamily,
    themeColor,
    alignment = "left", // Center is somewhat forced for headings in this template, but body obeys alignment
    spacing = "medium",
  } = data;

  const fontStyle = { fontFamily: fontFamily || "Garamond, serif" };
  const getSectionMargin = () =>
    spacing === "small" ? "mb-5" : spacing === "large" ? "mb-10" : "mb-8";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col`}
      style={fontStyle}
    >
      {/* Header - Always Centered for Elegance */}
      <header
        className={`text-center ${getSectionMargin()} border-b-2 pb-6`}
        style={{ borderColor: themeColor }}
      >
        <h1
          className="text-5xl font-light tracking-widest uppercase mb-4"
          style={{ color: themeColor }}
        >
          {personalInfo?.name || "Your Name"}
        </h1>
        <div className="text-sm tracking-widest text-gray-500 uppercase flex flex-col items-center gap-1">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.linkedIn && (
            <span>{personalInfo.linkedIn.replace(/^https?:\/\//, "")}</span>
          )}
        </div>
      </header>

      {/* Body alignment wrapper */}
      <div
        className={
          alignment === "center"
            ? "text-center"
            : alignment === "right"
              ? "text-right"
              : "text-left"
        }
      >
        {/* Summary */}
        {professionalSummary && (
          <section className={getSectionMargin()}>
            <h2
              className="text-xl font-bold uppercase tracking-widest text-center mb-4"
              style={{ color: themeColor }}
            >
              Profile
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {professionalSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className={getSectionMargin()}>
            <h2
              className="text-xl font-bold uppercase tracking-widest text-center mb-6"
              style={{ color: themeColor }}
            >
              Experience
            </h2>
            <div className={itemSpacing}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${alignment === "center" ? "flex-col items-center" : alignment === "right" ? "flex-col items-end" : "justify-between items-baseline"} mb-1`}
                  >
                    <h3 className="font-bold text-lg text-gray-900">
                      {exp.role}
                    </h3>
                    <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      {exp.dates}
                    </span>
                  </div>
                  <div className="text-base italic text-gray-600 mb-2">
                    {exp.company}
                  </div>
                  {exp.description && (
                    <ul
                      className={`list-disc list-outside ml-5 text-sm text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
                    >
                      {exp.description.split("\n").map((point, i) => {
                        const cleanPoint = point.replace(/^[-*]\s*/, "").trim();
                        return cleanPoint ? (
                          <li key={i}>{cleanPoint}</li>
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
            <h2
              className="text-xl font-bold uppercase tracking-widest text-center mb-6"
              style={{ color: themeColor }}
            >
              Education
            </h2>
            <div className={itemSpacing}>
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className={`flex ${alignment === "center" ? "flex-col items-center" : alignment === "right" ? "flex-col items-end" : "justify-between items-baseline"}`}
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {edu.institution}
                    </h3>
                    <div className="text-base text-gray-700">
                      {edu.degree}{" "}
                      {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
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
              <h2
                className="text-xl font-bold uppercase tracking-widest text-center mb-6"
                style={{ color: themeColor }}
              >
                {section.title}
              </h2>
              <div className={itemSpacing}>
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex ${alignment === "center" ? "flex-col items-center text-center" : alignment === "right" ? "flex-row-reverse text-right" : "gap-5"}`}
                  >
                    {item.imageUrl && (
                      <div
                        className={`${alignment === "center" ? "mb-3" : "flex-shrink-0"}`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded shadow ring-1 ring-gray-200"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div
                        className={`flex ${alignment === "center" ? "flex-col items-center" : alignment === "right" ? "flex-col items-end" : "justify-between items-baseline"} mb-1`}
                      >
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          {item.title}
                          {item.link && (
                            <a
                              href={formatUrl(item.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-normal text-xs text-blue-600 hover:underline uppercase tracking-wider"
                            >
                              Link
                            </a>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                          {item.dates}
                        </span>
                      </div>
                      {item.subtitle && (
                        <div className="text-base italic text-gray-600 mb-2">
                          {item.subtitle}
                        </div>
                      )}
                      {item.description && (
                        <ul
                          className={`list-disc list-outside ml-5 text-sm text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
              className="text-xl font-bold uppercase tracking-widest text-center mb-4"
              style={{ color: themeColor }}
            >
              Skills
            </h2>
            <p className="text-base text-gray-700 leading-relaxed text-center">
              {skills.join(" • ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ElegantTemplate;
