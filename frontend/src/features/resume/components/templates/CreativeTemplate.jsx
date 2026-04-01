import React from "react";

/**
 * CreativeTemplate — bold colored left sidebar, white right content area
 */
const CreativeTemplate = ({ data }) => {
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
  const accent = themeColor || "#7c3aed";
  const font = fontFamily || "'Inter', sans-serif";

  // A lighter version of the accent for tag backgrounds
  const lightAccent = accent + "22";

  return (
    <div
      className="w-full h-full bg-white"
      style={{ fontFamily: font, display: "flex", minHeight: "1123px" }}
    >
      {/* ---- Left Sidebar ---- */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          backgroundColor: accent,
          color: "white",
          padding: "40px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Photo spot */}
        {personalInfo?.imageUrl ? (
          <img
            src={personalInfo.imageUrl}
            alt="Profile"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.4)",
              objectFit: "cover",
              alignSelf: "center",
            }}
          />
        ) : (
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.2rem",
              alignSelf: "center",
            }}
          >
            👤
          </div>
        )}

        {/* Name */}
        <div>
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              lineHeight: "1.2",
              letterSpacing: "-0.01em",
              marginBottom: "4px",
            }}
          >
            {personalInfo?.name || "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "10px",
            }}
          >
            Contact
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {personalInfo?.email && (
              <div
                style={{
                  fontSize: "0.78rem",
                  opacity: 0.9,
                  wordBreak: "break-all",
                }}
              >
                📧 {personalInfo.email}
              </div>
            )}
            {personalInfo?.phone && (
              <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>
                📞 {personalInfo.phone}
              </div>
            )}
            {personalInfo?.linkedIn && (
              <div
                style={{
                  fontSize: "0.78rem",
                  opacity: 0.9,
                  wordBreak: "break-all",
                }}
              >
                🔗 {personalInfo.linkedIn}
              </div>
            )}
            {personalInfo?.github && (
              <div
                style={{
                  fontSize: "0.78rem",
                  opacity: 0.9,
                  wordBreak: "break-all",
                }}
              >
                💻 {personalInfo.github}
              </div>
            )}
            {personalInfo?.portfolio && (
              <div
                style={{
                  fontSize: "0.78rem",
                  opacity: 0.9,
                  wordBreak: "break-all",
                }}
              >
                🌐 {personalInfo.portfolio}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.7,
                marginBottom: "10px",
              }}
            >
              Skills
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.6)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", opacity: 0.9 }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education side */}
        {education && education.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.7,
                marginBottom: "10px",
              }}
            >
              Education
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ fontWeight: "700", fontSize: "0.82rem" }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>
                    {edu.fieldOfStudy}
                  </div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.65 }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                    {edu.dates}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- Right Content ---- */}
      <div
        style={{
          flex: 1,
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* Summary */}
        {professionalSummary && (
          <section>
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: "800",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: "10px",
              }}
            >
              About Me
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: "1.75",
                color: "#374151",
              }}
            >
              {professionalSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: "800",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: "14px",
              }}
            >
              Work Experience
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: `3px solid ${accent}`,
                    paddingLeft: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        color: "#111827",
                      }}
                    >
                      {exp.role}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#9ca3af",
                        background: lightAccent,
                        padding: "2px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      {exp.dates}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: accent,
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    {exp.company}
                  </div>
                  {exp.description && (
                    <ul
                      style={{
                        paddingLeft: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {exp.description
                        .split("\n")
                        .filter((l) => l.trim())
                        .map((line, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "0.83rem",
                              color: "#4b5563",
                              lineHeight: "1.65",
                              paddingLeft: "12px",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                top: "8px",
                                width: "5px",
                                height: "5px",
                                borderRadius: "50%",
                                background: accent,
                                display: "block",
                              }}
                            />
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
            <section key={section.id}>
              <h2
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: `3px solid ${accent}`,
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          color: "#111827",
                        }}
                      >
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
                              fontWeight: "400",
                            }}
                          >
                            [Link]
                          </a>
                        )}
                      </span>
                      {item.dates && (
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: "#9ca3af",
                            background: lightAccent,
                            padding: "2px 10px",
                            borderRadius: "999px",
                          }}
                        >
                          {item.dates}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: accent,
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        style={{
                          paddingLeft: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {item.description
                          .split("\n")
                          .filter((l) => l.trim())
                          .map((line, i) => (
                            <li
                              key={i}
                              style={{
                                fontSize: "0.83rem",
                                color: "#4b5563",
                                lineHeight: "1.65",
                                paddingLeft: "12px",
                                position: "relative",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  top: "8px",
                                  width: "5px",
                                  height: "5px",
                                  borderRadius: "50%",
                                  background: accent,
                                  display: "block",
                                }}
                              />
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
      </div>
    </div>
  );
};

export default CreativeTemplate;
