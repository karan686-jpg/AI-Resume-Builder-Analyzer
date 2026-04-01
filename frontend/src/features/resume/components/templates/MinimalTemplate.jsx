import React from "react";

/**
 * MinimalTemplate — clean, black & white, single column, serif feel
 */
const MinimalTemplate = ({ data }) => {
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
  const accent = themeColor || "#111827";
  const font = fontFamily || "Georgia, serif";

  return (
    <div
      className="bg-white w-full h-full text-gray-900"
      style={{ fontFamily: font, padding: "48px 56px" }}
    >
      {/* Name & Contact */}
      <div
        style={{
          borderBottom: `3px solid ${accent}`,
          paddingBottom: "20px",
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
            color: accent,
          }}
        >
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "0.82rem",
            color: "#4b5563",
          }}
        >
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo?.linkedIn && <span>🔗 {personalInfo.linkedIn}</span>}
          {personalInfo?.github && <span>💻 {personalInfo.github}</span>}
          {personalInfo?.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {professionalSummary && (
        <section style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "10px",
            }}
          >
            Profile
          </h2>
          <p
            style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#374151" }}
          >
            {professionalSummary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "14px",
            }}
          >
            Experience
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                      {exp.role}
                    </span>
                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {" "}
                      — {exp.company}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                    }}
                  >
                    {exp.dates}
                  </span>
                </div>
                {exp.description && (
                  <ul
                    style={{
                      marginTop: "6px",
                      paddingLeft: "0",
                      listStyle: "none",
                    }}
                  >
                    {exp.description
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((line, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.85rem",
                            color: "#4b5563",
                            lineHeight: "1.65",
                            paddingLeft: "12px",
                            borderLeft: `2px solid #e5e7eb`,
                            marginBottom: "4px",
                          }}
                        >
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
      {customSections &&
        customSections.length > 0 &&
        customSections.map((section) => (
          <section key={section.id} style={{ marginBottom: "28px" }}>
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: "14px",
              }}
            >
              {section.title}
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                        {item.title}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginLeft: "8px",
                              fontSize: "0.8rem",
                              color: "#3b82f6",
                              textDecoration: "none",
                            }}
                          >
                            [Link]
                          </a>
                        )}
                      </span>
                      {item.subtitle && (
                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                          {" "}
                          — {item.subtitle}
                        </span>
                      )}
                    </div>
                    {item.dates && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#9ca3af",
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                        }}
                      >
                        {item.dates}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <ul
                      style={{
                        marginTop: "6px",
                        paddingLeft: "0",
                        listStyle: "none",
                      }}
                    >
                      {item.description
                        .split("\n")
                        .filter((l) => l.trim())
                        .map((line, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "0.85rem",
                              color: "#4b5563",
                              lineHeight: "1.65",
                              paddingLeft: "12px",
                              borderLeft: `2px solid #e5e7eb`,
                              marginBottom: "4px",
                            }}
                          >
                            {line.replace(/^- /, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

      {/* Two column: Education + Skills */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
      >
        {education && education.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: "14px",
              }}
            >
              Education
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {edu.fieldOfStudy}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    {edu.institution} · {edu.dates}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {skills && skills.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: "14px",
              }}
            >
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.8rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
