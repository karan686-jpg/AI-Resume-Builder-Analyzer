import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Custom canvas that adds running header and page numbering."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AI Resume Builder & Analyzer — Project Verification Report")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_left = "Candidate: Karan Datta | College Placement Verification"
        footer_right = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 32, footer_left)
        self.drawRightString(558, 32, footer_right)
        self.restoreState()

def build_pdf(filename="AI_Resume_Builder_Analyzer_Project_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Color Palette
    PRIMARY = colors.HexColor("#1E3A8A")    # Deep Navy
    SECONDARY = colors.HexColor("#0284C7")  # Bright Teal/Blue
    DARK = colors.HexColor("#0F172A")       # Slate Dark
    MUTED = colors.HexColor("#475569")      # Slate Muted
    BG_LIGHT = colors.HexColor("#F8FAFC")   # Light background
    ACCENT_BG = colors.HexColor("#EFF6FF")  # Soft blue

    # Custom Typography Styles
    title_style = ParagraphStyle(
        "ProjectTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        "ProjectSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        "Bullet_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=DARK,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        "Code_Custom",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=DARK
    )

    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11.5,
        textColor=PRIMARY
    )

    story = []

    # Title & Header Banner
    story.append(Paragraph("AI-Powered Resume Builder & Analyzer", title_style))
    story.append(Paragraph("Full-Stack Intelligent Career Development & Interview Readiness Platform", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    # Metadata & Verification Table Box
    meta_data = [
        [
            Paragraph("<b>Developer Name:</b>", table_cell_bold),
            Paragraph("Karan Datta", table_cell),
            Paragraph("<b>Role / Specialization:</b>", table_cell_bold),
            Paragraph("Full-Stack & GenAI Developer", table_cell)
        ],
        [
            Paragraph("<b>Repository URL:</b>", table_cell_bold),
            Paragraph('<font color="#0284C7"><u>https://github.com/karan686-jpg/AI-Resume-Builder-Analyzer.git</u></font>', table_cell),
            Paragraph("<b>Core Stack:</b>", table_cell_bold),
            Paragraph("MERN Stack + Google Gemini AI", table_cell)
        ],
        [
            Paragraph("<b>Project Type:</b>", table_cell_bold),
            Paragraph("Major Project / Placement Verification", table_cell),
            Paragraph("<b>Deployment & Cloud:</b>", table_cell_bold),
            Paragraph("MongoDB Atlas, ImageKit, REST APIs", table_cell)
        ]
    ]

    meta_table = Table(meta_data, colWidths=[110, 190, 100, 104])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93C5FD")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DBEAFE")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    summary_text = (
        "In today's competitive job market, candidates often struggle with two major challenges: crafting "
        "ATS-compliant, visually compelling resumes tailored to specific roles, and adequately preparing "
        "for domain-specific interviews. <b>AI-Powered Resume Builder & Analyzer</b> is an end-to-end "
        "enterprise-grade solution designed to bridge this gap. By combining modern web architectures "
        "(React 19, Vite, Express, MongoDB) with cutting-edge Generative AI (Google Gemini), the platform "
        "empowers job seekers to build dynamic CVs, analyze resumes against target Job Descriptions (JD), "
        "and simulate interactive AI-guided mock interviews."
    )
    story.append(Paragraph(summary_text, body_style))

    # 2. Key Modules & Functional Architecture
    story.append(Paragraph("2. Key Platform Modules", h1_style))

    story.append(Paragraph("• <b>Module A: AI-Powered Resume Builder</b>", bullet_style))
    story.append(Paragraph(
        "Interactive multi-step resume builder allowing candidates to enter personal details, work history, "
        "education, and skills. Features dynamic theme/color selection, real-time live preview, and instant "
        "1-click PDF exporting powered by client-side document compilation.",
        ParagraphStyle("Sub", parent=body_style, leftIndent=15)
    ))

    story.append(Paragraph("• <b>Module B: Intelligent Resume Analyzer & JD Matcher</b>", bullet_style))
    story.append(Paragraph(
        "Enables users to upload existing PDF resumes along with targeted Job Descriptions. The backend extracts "
        "raw text using <code>pdf-parse</code>, sanitizes input with <code>Zod</code>, and prompts Google Gemini AI "
        "to evaluate ATS fitment, skill gaps, keyword matching, and candidate strengths.",
        ParagraphStyle("Sub", parent=body_style, leftIndent=15)
    ))

    story.append(Paragraph("• <b>Module C: Interactive AI Mock Interview System</b>", bullet_style))
    story.append(Paragraph(
        "Generates customized technical and behavioral interview questionnaires based on the candidate's exact resume "
        "and target JD. Users submit responses which are evaluated in real-time by AI, providing actionable feedback, "
        "score ratings, and areas of improvement.",
        ParagraphStyle("Sub", parent=body_style, leftIndent=15)
    ))

    story.append(Paragraph("• <b>Module D: Secure Authentication & Cloud Storage</b>", bullet_style))
    story.append(Paragraph(
        "Implements stateless JWT authentication with bcrypt password hashing. User assets and documents are "
        "managed via ImageKit cloud storage and MongoDB Atlas persistence.",
        ParagraphStyle("Sub", parent=body_style, leftIndent=15)
    ))

    # 3. Comprehensive Tech Stack Table
    story.append(Paragraph("3. Technology Stack Breakdown", h1_style))
    
    tech_data = [
        [Paragraph("<b>Layer</b>", table_cell_bold), Paragraph("<b>Technologies Used</b>", table_cell_bold), Paragraph("<b>Key Responsibilities / Purpose</b>", table_cell_bold)],
        [
            Paragraph("<b>Frontend UI</b>", table_cell),
            Paragraph("React.js 19, Vite, Tailwind CSS v4, React Router 7, Lucide Icons", table_cell),
            Paragraph("High-performance responsive UI, live state updates, component-driven layouts", table_cell)
        ],
        [
            Paragraph("<b>Backend Server</b>", table_cell),
            Paragraph("Node.js, Express.js 5, RESTful APIs, MVC Pattern", table_cell),
            Paragraph("Secure endpoint management, business logic, asynchronous request processing", table_cell)
        ],
        [
            Paragraph("<b>AI / LLM Engine</b>", table_cell),
            Paragraph("Google Gemini AI (@google/genai), Custom Prompt Engineering", table_cell),
            Paragraph("Context-aware CV analysis, ATS score calculation, interview question generation", table_cell)
        ],
        [
            Paragraph("<b>Database</b>", table_cell),
            Paragraph("MongoDB, Mongoose ODM", table_cell),
            Paragraph("Scalable NoSQL schema for users, resume documents, and interview sessions", table_cell)
        ],
        [
            Paragraph("<b>Security & Auth</b>", table_cell),
            Paragraph("JSON Web Tokens (JWT), Bcrypt.js, CORS, Helmet", table_cell),
            Paragraph("Password hashing, protected routes, stateless authorization token lifecycle", table_cell)
        ],
        [
            Paragraph("<b>File & Asset Mgmt</b>", table_cell),
            Paragraph("Multer, PDF-Parse, ImageKit SDK, HTML2PDF.js", table_cell),
            Paragraph("PDF parsing, cloud image storage, client-side report & resume PDF downloads", table_cell)
        ]
    ]

    tech_table = Table(tech_data, colWidths=[100, 180, 224])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94A3B8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)

    # 4. System Architecture & Workflow
    story.append(Paragraph("4. End-to-End System Workflow", h1_style))
    flow_steps = [
        "<b>1. User Authentication:</b> Candidate signs up/logs in; JWT token is issued and stored in secure cookies/client storage.",
        "<b>2. Document Ingestion:</b> User uploads resume (PDF) or enters data in structured builder forms. Backend processes multi-part form data via Multer and extracts text tokens via <code>pdf-parse</code>.",
        "<b>3. GenAI Context Processing:</b> Server constructs structured prompts combining resume credentials and target JD requirements, dispatching queries to Google Gemini API.",
        "<b>4. Structured Analysis & Plan Generation:</b> AI returns evaluated metrics (match percentage, missing keywords, personalized interview questions).",
        "<b>5. Live Interaction & PDF Export:</b> Frontend renders interactive interview simulator and enables high-fidelity resume generation and 1-click PDF download."
    ]
    for step in flow_steps:
        story.append(Paragraph(f"• {step}", bullet_style))

    # 5. College Placement & Verification Details
    story.append(Paragraph("5. Placement & Academic Verification", h1_style))
    story.append(Paragraph(
        "This project has been independently designed and implemented by <b>Karan Datta</b> to demonstrate "
        "practical engineering proficiency across Full-Stack Web Development, Cloud Services, and GenAI integration. "
        "The codebase adheres to industry standards with modular MVC directory structure, strict type validations, "
        "and clean UI/UX paradigms.",
        body_style
    ))

    # Verification Sign-off Box
    signoff_data = [
        [
            Paragraph("<b>Candidate Name:</b> Karan Datta", table_cell),
            Paragraph("<b>GitHub:</b> github.com/karan686-jpg", table_cell)
        ],
        [
            Paragraph("<b>Project Name:</b> AI-Resume-Builder-Analyzer", table_cell),
            Paragraph("<b>Verification Status:</b> Available for Evaluation", table_cell)
        ],
        [
            Paragraph("<b>Repository Link:</b>", table_cell_bold),
            Paragraph('<font color="#0284C7"><u>https://github.com/karan686-jpg/AI-Resume-Builder-Analyzer.git</u></font>', table_cell)
        ]
    ]
    signoff_table = Table(signoff_data, colWidths=[240, 264])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(Spacer(1, 4))
    story.append(signoff_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Report generated successfully: {filename}")

if __name__ == "__main__":
    build_pdf()
