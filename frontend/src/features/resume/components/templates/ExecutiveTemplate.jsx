import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

const ExecutiveTemplate = ({ data }) => {
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

  const accent = themeColor || "#0f172a";
  const font = fontFamily || "'Inter', sans-serif";

  return (
    <div
      className="bg-white w-full h-full text-gray-800 flex"
      style={{ fontFamily: font, minHeight: "1123px" }}
    >
      {/* Left Column (Narrower) */}
      <div className="w-[32%] bg-gray-50 flex flex-col p-8 border-r border-gray-200">
        {/* Photo Spot */}
        <div className="flex justify-center mb-6">
          {personalInfo?.imageUrl ? (
            <img
              src={personalInfo.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded object-cover shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 rounded bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
              👤
            </div>
          )}
        </div>

        {/* Contact info inside left col */}
        <div className="mb-8 space-y-3">
          <h2
            className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-1 mb-4"
            style={{ borderColor: accent }}
          >
            Contact
          </h2>
          {personalInfo?.email && (
            <div className="flex items-center text-xs text-gray-700">
              <Mail size={12} className="mr-2" style={{ color: accent }} />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center text-xs text-gray-700">
              <Phone size={12} className="mr-2" style={{ color: accent }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.linkedIn && (
            <div className="flex items-center text-xs text-gray-700">
              <Linkedin size={12} className="mr-2" style={{ color: accent }} />
              <span className="break-all">{personalInfo.linkedIn}</span>
            </div>
          )}
          {personalInfo?.github && (
            <div className="flex items-center text-xs text-gray-700">
              <Github size={12} className="mr-2" style={{ color: accent }} />
              <span className="break-all">{personalInfo.github}</span>
            </div>
          )}
          {personalInfo?.portfolio && (
            <div className="flex items-center text-xs text-gray-700">
              <Globe size={12} className="mr-2" style={{ color: accent }} />
              <span className="break-all">{personalInfo.portfolio}</span>
            </div>
          )}
        </div>

        {/* Education (moved to sidebar) */}
        {education && education.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-1 mb-4"
              style={{ borderColor: accent }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="text-xs font-bold text-gray-900">
                    {edu.degree}
                  </div>
                  <div className="text-xs text-gray-600">
                    {edu.fieldOfStudy}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {edu.institution}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {edu.dates}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2
              className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-1 mb-4"
              style={{ borderColor: accent }}
            >
              Expertise
            </h2>
            <div className="flex flex-col gap-2">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className="w-1.5 h-1.5 rounded-full mr-2"
                    style={{ backgroundColor: accent }}
                  ></div>
                  <span className="text-xs text-gray-700 font-medium">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Wider) */}
      <div className="flex-1 p-10 flex flex-col gap-8">
        {/* Name Header */}
        <header>
          <h1
            className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1"
            style={{ color: accent }}
          >
            {personalInfo?.name || "Your Name"}
          </h1>
        </header>

        {/* Summary */}
        {professionalSummary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-3 flex items-center">
              <div className="w-full border-b border-gray-300 relative">
                <span
                  className="absolute -top-3 left-0 pr-3 bg-white"
                  style={{ color: accent }}
                >
                  Profile
                </span>
              </div>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mt-4">
              {professionalSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-5 flex items-center">
              <div className="w-full border-b border-gray-300 relative">
                <span
                  className="absolute -top-3 left-0 pr-3 bg-white"
                  style={{ color: accent }}
                >
                  Experience
                </span>
              </div>
            </h2>
            <div className="space-y-6 mt-4">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[15px] font-bold text-gray-900">
                      {exp.role}
                    </h3>
                    <div
                      className="text-xs font-semibold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {exp.dates}
                    </div>
                  </div>
                  <div className="text-[13px] font-medium text-gray-600 mb-2">
                    {exp.company}
                  </div>
                  {exp.description && (
                    <ul className="text-[13px] text-gray-700 space-y-1 pl-4 list-disc marker:text-gray-400">
                      {exp.description
                        .split("\n")
                        .filter((l) => l.trim())
                        .map((line, i) => (
                          <li key={i} className="pl-1 leading-relaxed">
                            {line.replace(/^- /, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-8 mt-2">
            {customSections.map((section) => (
              <section key={section.id}>
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-5 flex items-center">
                  <div className="w-full border-b border-gray-300 relative">
                    <span
                      className="absolute -top-3 left-0 pr-3 bg-white"
                      style={{ color: accent }}
                    >
                      {section.title}
                    </span>
                  </div>
                </h2>
                <div className="space-y-5 mt-4">
                  {section.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-[14px] font-bold text-gray-900">
                          {item.title}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-500 font-normal hover:underline text-xs"
                            >
                              [Link]
                            </a>
                          )}
                        </h3>
                        {item.dates && (
                          <div
                            className="text-xs font-semibold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: accent }}
                          >
                            {item.dates}
                          </div>
                        )}
                      </div>
                      {item.subtitle && (
                        <div className="text-[13px] font-medium text-gray-600 mb-1.5">
                          {item.subtitle}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-[13px] text-gray-700 leading-relaxed max-w-full whitespace-pre-line mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
