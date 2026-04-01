import React from "react";

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

const SimpleTemplate = ({ data }) => {
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

  const fontStyle = { fontFamily: fontFamily || "Arial, sans-serif" };
  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-black flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* Header */}
      <header className={getSectionMargin()}>
        <h1 className="text-4xl font-bold mb-1">
          {personalInfo?.name || "Your Name"}
        </h1>
        <div className="text-[14px]">
          {personalInfo?.email && (
            <span className="mr-3">{personalInfo.email}</span>
          )}
          {personalInfo?.phone && (
            <span className="mr-3">{personalInfo.phone}</span>
          )}
          {personalInfo?.linkedIn && (
            <span className="mr-3">{cleanUrlText(personalInfo.linkedIn)}</span>
          )}
          {personalInfo?.github && (
            <span>{cleanUrlText(personalInfo.github)}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <h2 className="text-[16px] font-bold uppercase mb-2">Summary</h2>
          <p className="text-[14px] leading-relaxed">{professionalSummary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2 className="text-[16px] font-bold uppercase mb-3">Experience</h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px]">{exp.role}</h3>
                  <span className="text-[14px]">{exp.dates}</span>
                </div>
                <div className="text-[14.5px] italic mb-1.5">{exp.company}</div>
                {exp.description && (
                  <ul
                    className={`list-disc list-outside ml-4 text-[14px] leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
          <h2 className="text-[16px] font-bold uppercase mb-3">Education</h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px]">{edu.institution}</h3>
                  <div className="text-[14px] italic">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[14px]">{edu.dates}</span>
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
            <h2 className="text-[16px] font-bold uppercase mb-3">
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
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[15px] flex items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] underline"
                          >
                            [Link]
                          </a>
                        )}
                      </h3>
                      <span className="text-[14px]">{item.dates}</span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14.5px] italic mb-1.5">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[14px] leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
          <h2 className="text-[16px] font-bold uppercase mb-2">Skills</h2>
          <p className="text-[14px] leading-relaxed">{skills.join(" • ")}</p>
        </section>
      )}
    </div>
  );
};

export default SimpleTemplate;
