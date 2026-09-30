import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";
import FormattedText from "../FormattedText";

const ModernTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    themeColor,
    fontFamily,
  } = data;

  return (
    <div
      className="bg-white w-full h-full text-gray-800 flex flex-col"
      style={{ fontFamily: fontFamily || "'Inter', sans-serif" }}
    >
      {/* Header Banner */}
      <div
        className="px-8 py-6 text-white flex items-center justify-between min-h-[100px]"
        style={{ backgroundColor: themeColor || "#2563EB" }}
      >
        <div className="flex items-center gap-5">
          {personalInfo?.imageUrl && (
            <img
              src={personalInfo.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white/90 object-cover shadow-sm shrink-0"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white m-0 leading-tight">
              {personalInfo?.name || "Your Name"}
            </h1>
            {personalInfo?.title && (
              <p className="text-xs text-white/85 font-medium mt-1">
                {personalInfo.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-1.5 text-xs text-white/90 text-right shrink-0">
          {personalInfo?.email && (
            <span className="flex items-center justify-end gap-1.5">
              {personalInfo.email} <Mail size={12} />
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center justify-end gap-1.5">
              {personalInfo.phone} <Phone size={12} />
            </span>
          )}
          {personalInfo?.linkedIn && (
            <span className="flex items-center justify-end gap-1.5">
              {personalInfo.linkedIn} <Linkedin size={12} />
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center justify-end gap-1.5">
              {personalInfo.github} <Github size={12} />
            </span>
          )}
          {personalInfo?.portfolio && (
            <span className="flex items-center justify-end gap-1.5">
              {personalInfo.portfolio} <Globe size={12} />
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-10 grid grid-cols-3 gap-10">
        {/* Main Content (Left, 2 cols) */}
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          {professionalSummary && (
            <section>
              <h2
                className="text-xl font-bold pb-1 mb-3 border-b-2"
                style={{
                  borderColor: themeColor || "#2563EB",
                  color: themeColor || "#2563EB",
                }}
              >
                Profile
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                <FormattedText text={professionalSummary} />
              </p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold pb-1 mb-4 border-b-2"
                style={{
                  borderColor: themeColor || "#2563EB",
                  color: themeColor || "#2563EB",
                }}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-4 border-l-2"
                    style={{ borderColor: themeColor || "#e5e7eb" }}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5"
                      style={{ backgroundColor: themeColor || "#2563EB" }}
                    ></div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {exp.company} |{" "}
                      <span className="text-gray-500 font-normal">
                        {exp.dates}
                      </span>
                    </div>

                    {exp.description && (
                      <ul className="list-none text-sm text-gray-600 space-y-1 mt-2">
                        {exp.description.split("\n").map((point, i) => {
                          const cleanPoint = point.replace(/^- /, "");
                          return cleanPoint ? (
                            <li
                              key={i}
                              className="leading-relaxed relative pl-4"
                            >
                              <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              <FormattedText text={cleanPoint} />
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

          {/* Custom Sections */}
          {customSections &&
            customSections.length > 0 &&
            customSections.map((section) => (
              <section key={section.id}>
                <h2
                  className="text-xl font-bold pb-1 mb-4 border-b-2"
                  style={{
                    borderColor: themeColor || "#2563EB",
                    color: themeColor || "#2563EB",
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative pl-4 border-l-2"
                      style={{ borderColor: themeColor || "#e5e7eb" }}
                    >
                      <div
                        className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5"
                        style={{ backgroundColor: themeColor || "#2563EB" }}
                      ></div>
                      <h3 className="font-bold text-gray-900">
                        {item.title}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 font-normal hover:underline text-sm"
                          >
                            [Link]
                          </a>
                        )}
                      </h3>
                      {(item.subtitle || item.dates) && (
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          {item.subtitle} {item.subtitle && item.dates && "| "}
                          <span className="text-gray-500 font-normal">
                            {item.dates}
                          </span>
                        </div>
                      )}

                      {item.description && (
                        <ul className="list-none text-sm text-gray-600 space-y-1 mt-2">
                          {item.description.split("\n").map((point, i) => {
                            const cleanPoint = point.replace(/^- /, "");
                            return cleanPoint ? (
                              <li
                                key={i}
                                className="leading-relaxed relative pl-4"
                              >
                                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <FormattedText text={cleanPoint} />
                              </li>
                            ) : null;
                          })}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Sidebar (Right, 1 col) */}
        <div className="space-y-8">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold pb-1 mb-4 border-b-2"
                style={{
                  borderColor: themeColor || "#2563EB",
                  color: themeColor || "#2563EB",
                }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-sm text-gray-700 mt-0.5">
                      {edu.fieldOfStudy}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-1">
                      {edu.institution}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {edu.dates}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold pb-1 mb-4 border-b-2"
                style={{
                  borderColor: themeColor || "#2563EB",
                  color: themeColor || "#2563EB",
                }}
              >
                Skills
              </h2>
              <div className="flex flex-col space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-sm mr-2"
                      style={{ backgroundColor: themeColor || "#2563EB" }}
                    ></div>
                    <span className="text-sm text-gray-700 font-medium">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
