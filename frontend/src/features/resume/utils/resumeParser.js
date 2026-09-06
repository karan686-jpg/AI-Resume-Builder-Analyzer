/**
 * ⚡ 0-Token Client-Side Resume Parser & Normalizer
 * Pure Heuristics, Regex, and State Machine — 100% Free & Fast
 */

// ─── Section Dictionary ────────────────────────────────────────────────────────
const KNOWN_SECTIONS = {
  summary: [
    "summary",
    "professional summary",
    "about me",
    "profile",
    "career objective",
    "objective",
    "executive summary",
    "biography",
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "work history",
    "career history",
    "employment",
  ],
  education: [
    "education",
    "academic background",
    "educational background",
    "qualifications",
    "academics",
    "degrees",
  ],
  skills: [
    "skills",
    "technical skills",
    "core skills",
    "core competencies",
    "technologies",
    "key skills",
    "expertise",
    "proficiencies",
    "tools & technologies",
  ],
};

// ─── Helper Regexes ────────────────────────────────────────────────────────────
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const PHONE_REGEX = /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,14})/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Common Date Range Patterns: e.g. "Jan 2021 - Present", "2020 - 2024", "08/2019 - 05/2023"
const DATE_RANGE_REGEX = /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:-|–|to)\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current)\b/i;

/**
 * Parses raw plain text of a resume into the structured state used by ResumeBuilder
 * @param {string} rawText
 * @returns {object} Parsed resume schema
 */
export function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("No resume text provided for parsing.");
  }

  const rawLines = rawText.split(/\r?\n/);
  const lines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0);

  const result = {
    title: "Imported Resume",
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
      portfolio: "",
    },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  };

  // ─── 1. Extract Contact Info via Regex ───
  const emailMatch = rawText.match(EMAIL_REGEX);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  const phoneMatch = rawText.match(PHONE_REGEX);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];

  const linkedinMatch = rawText.match(LINKEDIN_REGEX);
  if (linkedinMatch) result.personalInfo.linkedIn = linkedinMatch[0];

  const githubMatch = rawText.match(GITHUB_REGEX);
  if (githubMatch) result.personalInfo.github = githubMatch[0];

  // Try to find general portfolio/website
  const allUrls = rawText.match(URL_REGEX) || [];
  for (const url of allUrls) {
    if (!url.includes("linkedin.com") && !url.includes("github.com")) {
      result.personalInfo.portfolio = url;
      break;
    }
  }

  // ─── 2. Identify Name & Job Title ───
  // Typically within the first 4 non-empty lines
  const candidateHeaderLines = lines.slice(0, 5).filter((l, idx) => {
    return (
      !l.includes("@") &&
      !l.match(PHONE_REGEX) &&
      !l.toLowerCase().includes("linkedin") &&
      !l.toLowerCase().includes("github") &&
      !l.toLowerCase().includes("http") &&
      !isHeaderLine(l, idx)
    );
  });

  if (candidateHeaderLines.length > 0) {
    // First line is candidate's name
    result.personalInfo.name = candidateHeaderLines[0]
      .replace(/^(Resume|Curriculum Vitae|CV)\s*[:-]?\s*/i, "")
      .trim();

    if (candidateHeaderLines.length > 1 && candidateHeaderLines[1].length < 40) {
      // Second line often holds candidate's current title (e.g. "Full Stack Developer")
      result.personalInfo.title = candidateHeaderLines[1].trim();
    }
  }

  // ─── 3. State Machine: Break lines into sections ───
  const sectionsFound = []; // [{ type, title, lines: [] }]
  let currentSec = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerCheck = checkSectionHeader(line, i);

    if (headerCheck) {
      if (currentSec) {
        sectionsFound.push(currentSec);
      }
      currentSec = {
        type: headerCheck.type,
        title: headerCheck.title,
        lines: [],
      };
    } else {
      if (currentSec) {
        currentSec.lines.push(line);
      }
    }
  }
  if (currentSec) {
    sectionsFound.push(currentSec);
  }

  // ─── 4. Process each detected section ───
  sectionsFound.forEach((sec) => {
    switch (sec.type) {
      case "summary":
        result.professionalSummary = sec.lines.join(" ");
        break;

      case "skills": {
        const skillSet = new Set();
        sec.lines.forEach((l) => {
          // Remove leading bullets or labels like "Languages: JavaScript, Python"
          const cleanLine = l.replace(/^[A-Za-z\s]+:\s*/, "");
          const items = cleanLine
            .split(/[,|•·\n\t]/)
            .map((s) => s.trim().replace(/^[-*•]\s*/, ""))
            .filter((s) => s.length >= 2 && s.length <= 35);
          items.forEach((item) => skillSet.add(item));
        });
        result.skills = Array.from(skillSet);
        break;
      }

      case "experience": {
        result.experience = parseExperienceLines(sec.lines);
        break;
      }

      case "education": {
        result.education = parseEducationLines(sec.lines);
        break;
      }

      case "custom":
      default: {
        // Any custom title! (e.g. Projects, Certifications, Publications, Awards)
        const customItems = parseCustomSectionLines(sec.lines, sec.title);
        result.customSections.push({
          id: "custom_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          title: sec.title,
          items: customItems,
        });
        break;
      }
    }
  });

  return result;
}

// ─── Section Header Detection Logic ──────────────────────────────────────────
function checkSectionHeader(line, lineIndex = 999) {
  const clean = line.replace(/[:#_=-]/g, "").trim();
  const lower = clean.toLowerCase();

  // Top 3 lines of resume are candidate name / title / contact info, never a section header!
  if (lineIndex < 3) return null;

  // Avoid GPA, scores, phone numbers, or lines starting with digits being treated as headers
  if (/\b(?:gpa|cgpa|score|percentage|grade|phone|email)\b/i.test(clean) || /^\d/.test(clean)) {
    return null;
  }

  // Too long or too short to be a section header
  if (clean.length < 3 || clean.length > 45) return null;
  const wordCount = clean.split(/\s+/).length;
  if (wordCount > 5) return null;

  // Check against known standard sections
  for (const [type, aliases] of Object.entries(KNOWN_SECTIONS)) {
    if (aliases.some((a) => lower === a || lower === a + "s")) {
      return { type, title: clean };
    }
  }

  // Check against known custom section categories
  const isSpecialSection = [
    "project",
    "projects",
    "personal project",
    "personal projects",
    "certification",
    "certifications",
    "award",
    "awards",
    "publication",
    "publications",
    "volunteering",
    "volunteer work",
    "languages",
    "interests",
    "activities",
    "leadership",
    "courses",
    "coursework",
    "honors",
    "honors & awards",
    "publications & awards",
    "achievements",
    "extracurricular",
    "open source",
    "patents",
  ].some((s) => lower === s || lower.includes(s));

  if (isSpecialSection) {
    return {
      type: "custom",
      title: clean.charAt(0).toUpperCase() + clean.slice(1),
    };
  }

  // Standalone ALL-CAPS header (e.g. "CONFERENCES", "HIGHLIGHTS")
  const isAllCaps = clean === clean.toUpperCase() && /[A-Z]/.test(clean);
  if (isAllCaps && wordCount <= 4 && clean.length > 3) {
    return {
      type: "custom",
      title: clean,
    };
  }

  return null;
}

function isHeaderLine(line, lineIndex = 999) {
  return checkSectionHeader(line, lineIndex) !== null;
}

// ─── Experience Parser ────────────────────────────────────────────────────────
function parseExperienceLines(lines) {
  const experiences = [];
  let currentExp = null;

  lines.forEach((line) => {
    const dateMatch = line.match(DATE_RANGE_REGEX);

    // New role heuristic: has a date or starts a distinct block
    if (dateMatch || (!currentExp && line.length > 0)) {
      if (currentExp) experiences.push(finalizeExp(currentExp));
      
      const roleCompanyPart = line.replace(DATE_RANGE_REGEX, "").trim().replace(/[-|,]$/, "").trim();
      let role = roleCompanyPart || "Job Title";
      let company = "";

      // Check if line contains "at" or "|" or "-" (e.g. "Software Engineer at Google")
      if (role.includes(" at ")) {
        const parts = role.split(" at ");
        role = parts[0].trim();
        company = parts[1].trim();
      } else if (role.includes(" | ")) {
        const parts = role.split(" | ");
        role = parts[0].trim();
        company = parts[1].trim();
      } else if (role.includes(" - ")) {
        const parts = role.split(" - ");
        role = parts[0].trim();
        company = parts[1].trim();
      }

      currentExp = {
        role,
        company,
        dates: dateMatch ? dateMatch[0] : "",
        bullets: [],
      };
    } else if (currentExp) {
      // If company wasn't found in title line, second line might be company
      if (!currentExp.company && line.length < 40 && !line.startsWith("•") && !line.startsWith("-")) {
        currentExp.company = line;
      } else {
        const bulletText = line.replace(/^[-*•·]\s*/, "").trim();
        if (bulletText) currentExp.bullets.push(bulletText);
      }
    }
  });

  if (currentExp) experiences.push(finalizeExp(currentExp));
  return experiences;
}

function finalizeExp(exp) {
  return {
    id: "exp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    role: exp.role || "Professional Role",
    company: exp.company || "Company / Organization",
    location: "",
    startDate: exp.dates ? exp.dates.split(/[-–to]/)[0]?.trim() || "" : "",
    endDate: exp.dates ? exp.dates.split(/[-–to]/)[1]?.trim() || "Present" : "",
    current: exp.dates ? /present|current/i.test(exp.dates) : false,
    description: exp.bullets.join("\n"),
    bullets: exp.bullets,
  };
}

// ─── Education Parser ─────────────────────────────────────────────────────────
function parseEducationLines(lines) {
  const educations = [];
  let currentEdu = null;

  lines.forEach((line) => {
    const dateMatch = line.match(DATE_RANGE_REGEX) || line.match(/\b(20\d{2}|19\d{2})\b/);
    const isDegreeIndicator = /\b(bachelor|master|b\.?s|m\.?s|b\.?tech|m\.?tech|ph\.?d|associate|diploma|degree)\b/i.test(line);
    const isInstitutionIndicator = /\b(university|college|institute|school|academy)\b/i.test(line);

    if (isDegreeIndicator || isInstitutionIndicator || dateMatch || !currentEdu) {
      if (currentEdu && (isDegreeIndicator || isInstitutionIndicator)) {
        educations.push(currentEdu);
        currentEdu = null;
      }

      if (!currentEdu) {
        currentEdu = {
          id: "edu_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          institution: isInstitutionIndicator ? line.replace(DATE_RANGE_REGEX, "").trim() : "",
          degree: isDegreeIndicator ? line.replace(DATE_RANGE_REGEX, "").trim() : "",
          field: "",
          graduationDate: dateMatch ? dateMatch[0] : "",
          gpa: "",
        };
      } else {
        if (!currentEdu.institution && isInstitutionIndicator) {
          currentEdu.institution = line.replace(DATE_RANGE_REGEX, "").trim();
        } else if (!currentEdu.degree && isDegreeIndicator) {
          currentEdu.degree = line.replace(DATE_RANGE_REGEX, "").trim();
        }
        if (dateMatch && !currentEdu.graduationDate) {
          currentEdu.graduationDate = dateMatch[0];
        }
      }
    }

    // Extract GPA if present
    const gpaMatch = line.match(/(?:gpa|cgpa)[:\s]*([0-9.]+)(?:\s*\/\s*([0-9.]+))?/i);
    if (gpaMatch && currentEdu) {
      currentEdu.gpa = gpaMatch[1];
    }
  });

  if (currentEdu) educations.push(currentEdu);
  return educations;
}

// ─── Custom Section Parser ───────────────────────────────────────────────────
function parseCustomSectionLines(lines, defaultTitle) {
  const items = [];
  let currentItem = null;

  lines.forEach((line) => {
    const isBullet = /^[-*•·]\s*/.test(line);
    const dateMatch = line.match(DATE_RANGE_REGEX);

    if (!isBullet && line.length < 50 && (dateMatch || !currentItem)) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        title: line.replace(DATE_RANGE_REGEX, "").trim(),
        subtitle: "",
        dates: dateMatch ? dateMatch[0] : "",
        description: "",
        link: "",
        imageUrl: "",
      };
    } else {
      if (!currentItem) {
        currentItem = {
          title: defaultTitle,
          subtitle: "",
          dates: "",
          description: "",
          link: "",
          imageUrl: "",
        };
      }
      const text = line.replace(/^[-*•·]\s*/, "").trim();
      currentItem.description = currentItem.description
        ? currentItem.description + "\n" + text
        : text;

      // Extract url if present in item
      const urlMatch = line.match(URL_REGEX);
      if (urlMatch && !currentItem.link) {
        currentItem.link = urlMatch[0];
      }
    }
  });

  if (currentItem) items.push(currentItem);
  return items;
}

// ─── PDF Client-Side Text Extractor ───────────────────────────────────────────
let cachedPdfJs = null;

async function getPdfJsLib() {
  if (cachedPdfJs) return cachedPdfJs;

  try {
    // Try local npm package
    const mod = await import("pdfjs-dist");
    cachedPdfJs = mod;
    if (!cachedPdfJs.GlobalWorkerOptions.workerSrc) {
      cachedPdfJs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${cachedPdfJs.version || "3.11.174"}/build/pdf.worker.min.mjs`;
    }
    return cachedPdfJs;
  } catch (err) {
    // Fallback to high-speed CDN ES module
    try {
      const cdn = await import(/* @vite-ignore */ "https://esm.sh/pdfjs-dist@3.11.174");
      cachedPdfJs = cdn;
      cachedPdfJs.GlobalWorkerOptions.workerSrc = "https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      return cachedPdfJs;
    } catch (e) {
      throw new Error("Could not load PDF engine. Please paste resume text directly instead.");
    }
  }
}

/**
 * Extracts raw textual lines from an uploaded PDF File object
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(file) {
  const pdfjs = await getPdfJsLib();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();

    // Group text items by roughly identical Y-coordinates to preserve line breaks
    const items = content.items || [];
    let lastY = null;
    let pageText = "";

    items.forEach((item) => {
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 5) {
        pageText += "\n";
      } else if (lastY !== null) {
        pageText += " ";
      }
      pageText += item.str;
      lastY = y;
    });

    fullText += pageText + "\n\n";
  }

  return fullText;
}
