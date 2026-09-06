"""
================================================================================
 Automated Study Guide & NotebookLM Source Generator
 Author: Karan Datta & Antigravity Pair-Programming
 Description: Scans full codebase and exports:
   1. Publication-grade PDF Study Guide (ReportLab)
   2. AI-ready Markdown Source for Google NotebookLM (Audio Overview & Q&A)
================================================================================
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Configure UTF-8 encoding for Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# ReportLab Imports
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Preformatted, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

# ==============================================================================
# 1. CONFIGURATION & IGNORED PATTERNS
# ==============================================================================
PROJECT_NAME = "AI Resume Builder & Analyzer"
SUBTITLE = "Full-Stack System Architecture & Codebase Deep Dive"
WORKSPACE_DIR = Path(__file__).resolve().parent

IGNORE_DIRS = {
    "node_modules", ".git", ".vscode", ".idea", "dist", "build",
    "coverage", "__pycache__", ".next", ".cache", "venv", "env", ".agents",
    "study_guide"
}

IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".DS_Store",
    "generate_study_guide.py", "generate_project_report_pdf.py"
}

ALLOWED_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx", ".py", ".json", ".html",
    ".css", ".env.example", ".md", ".yml", ".yaml", ".sql"
}

# ==============================================================================
# 2. ARCHITECTURAL ANNOTATIONS & KNOWLEDGE BASE
# ==============================================================================
FILE_ANNOTATIONS = {
    "server.js": {
        "purpose": "Express application entry point and HTTP server lifecycle orchestrator.",
        "patterns": [
            "Configures core security middlewares (CORS, Helmet, Rate Limiter)",
            "Mounts modular REST API routes (/api/auth, /api/resumes, /api/analyze)",
            "Establishes MongoDB database connection pooling",
            "Global centralized error-handling middleware stack"
        ]
    },
    "app.js": {
        "purpose": "Application configuration and middleware bootstrapping module.",
        "patterns": [
            "Decouples app instance initialization from network listening for testability",
            "Body parser and JSON payload limits protection",
            "Morgan / Winston structured request logging"
        ]
    },
    "resumeController.js": {
        "purpose": "Business logic controller for Resume CRUD, parsing, and analysis dispatch.",
        "patterns": [
            "Asynchronous request-response handler pattern",
            "Validation of incoming resume payload structures",
            "Interfacing with Gemini / OpenAI API for AI semantic scoring and suggestions",
            "Error boundary handling for upstream AI service rate limits"
        ]
    },
    "authController.js": {
        "purpose": "Authentication and authorization lifecycle manager.",
        "patterns": [
            "Bcrypt password hashing with cryptographic salt rounds",
            "JWT token generation, refresh rotation, and cookie storage",
            "OAuth2 callback strategies handling"
        ]
    },
    "Resume.js": {
        "purpose": "Data model schema representing resume structured data.",
        "patterns": [
            "Mongoose schema definition with strict typing",
            "Nested schemas for Work History, Education, Skills, and ATS Scores",
            "Indexing on userId and timestamps for high query performance"
        ]
    },
    "User.js": {
        "purpose": "User identity and credential data schema.",
        "patterns": [
            "Secure credential storage, role-based access fields (User, Admin)",
            "Pre-save hooks for automated timestamp updating and password hashing"
        ]
    },
    "geminiService.js": {
        "purpose": "Dedicated AI service client for LLM analysis and ATS evaluation.",
        "patterns": [
            "Engineered system prompts for structured JSON output formatting",
            "Retry logic with exponential backoff for resilience",
            "Token optimization and response parsing sanitization"
        ]
    },
    "App.jsx": {
        "purpose": "Root React application container and router provider.",
        "patterns": [
            "React Router DOM layout routes configuration",
            "Global Context / State Providers (AuthContext, ThemeContext)",
            "Lazy loading & code splitting for performance"
        ]
    },
    "Dashboard.jsx": {
        "purpose": "Interactive analytics dashboard for resume performance & scores.",
        "patterns": [
            "Visual data charts rendering ATS metrics",
            "Optimistic UI updates for quick user responsiveness",
            "Responsive grid layout with modern glassmorphism aesthetic"
        ]
    },
    "ResumeBuilder.jsx": {
        "purpose": "Multi-step interactive resume builder with real-time live preview.",
        "patterns": [
            "Controlled form input state management",
            "Debounced live preview synchronization",
            "PDF export triggers and validation checks"
        ]
    }
}

def get_annotation(filepath: Path) -> dict:
    name = filepath.name
    if name in FILE_ANNOTATIONS:
        return FILE_ANNOTATIONS[name]
    
    ext = filepath.suffix.lower()
    parent = filepath.parent.name.lower()
    
    purpose = f"Source component handling {parent} logic in the system."
    patterns = [
        f"Implements standard {ext} modular architectural patterns",
        f"Encapsulates domain-specific behavior within {parent} scope",
        "Provides maintainable, decoupled functionality for upstream consumers"
    ]
    
    if "route" in name.lower():
        purpose = "API routing definition mapping HTTP endpoints to controllers."
        patterns = ["Route guard middleware enforcement", "RESTful endpoint mapping"]
    elif "model" in name.lower() or "schema" in name.lower():
        purpose = "Data layer definition enforcing data integrity."
        patterns = ["Schema validation rules", "Relational / Document data modeling"]
    elif "middleware" in name.lower():
        purpose = "Interception layer for request validation and security inspection."
        patterns = ["Chain of responsibility pattern", "Token decoding & validation"]
    elif "style" in name.lower() or ext in [".css", ".scss"]:
        purpose = "Visual styling and design tokens specification."
        patterns = ["Theme definitions & responsive layout variables"]
        
    return {"purpose": purpose, "patterns": patterns}

# ==============================================================================
# 3. DYNAMIC REPO SCANNER
# ==============================================================================
def scan_codebase(root_dir: Path):
    """Recursively collects project source files with architectural ordering."""
    collected_files = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith(".")]
        
        for file in sorted(filenames):
            if file in IGNORE_FILES or file.startswith("."):
                continue
            ext = Path(file).suffix.lower()
            if ext in ALLOWED_EXTENSIONS:
                full_path = Path(dirpath) / file
                rel_path = full_path.relative_to(root_dir)
                collected_files.append((rel_path, full_path))
    
    def sort_key(item):
        rel = str(item[0]).replace("\\", "/").lower()
        if "package.json" in rel or "readme" in rel:
            return 0
        if "server" in rel or "index.js" in rel or "app.js" in rel:
            return 1
        if "config" in rel or "env" in rel:
            return 2
        if "model" in rel or "schema" in rel:
            return 3
        if "controller" in rel or "route" in rel:
            return 4
        if "service" in rel or "util" in rel or "middleware" in rel:
            return 5
        if "src" in rel or "frontend" in rel or "component" in rel:
            return 6
        return 7

    return sorted(collected_files, key=sort_key)

# ==============================================================================
# 4. TWO-PASS NUMBERED CANVAS (Page X of Y & Headers)
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
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
        if self._pageNumber == 1:
            return
        
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Running Top Header
        self.drawString(54, 750, f"{PROJECT_NAME} — Architectural Study Guide")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 744, 558, 744)
        
        # Running Footer
        self.setFont("Helvetica", 8)
        self.drawString(54, 40, f"Confidential & Revision Ready — Generated on {datetime.now().strftime('%b %d, %Y')}")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_str)
        self.line(54, 52, 558, 52)
        
        self.restoreState()

# ==============================================================================
# 5. PDF GENERATION PIPELINE (ReportLab)
# ==============================================================================
def create_study_guide_pdf(scanned_files, output_pdf_path: Path):
    doc = SimpleDocTemplate(
        str(output_pdf_path),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=60,
        bottomMargin=60
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155")
    )
    
    callout_title = ParagraphStyle(
        'CalloutTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0369A1")
    )
    
    bullet_style = ParagraphStyle(
        'CalloutBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=12
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )
    
    story = []
    
    # Cover Section
    story.append(Paragraph(PROJECT_NAME, title_style))
    story.append(Paragraph(SUBTITLE, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563EB"), spaceAfter=15))
    
    overview_text = (
        "This revision dossier serves as an exhaustive architectural companion and "
        "codebase walkthrough. It synthesizes core system patterns, API lifecycles, "
        "data model constraints, and concrete implementation source files for thorough "
        "technical review and high-retention learning."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("System Component Matrix", h1_style))
    
    summary_data = [
        ["Layer / Module", "Technology", "Architectural Role"],
        ["API Gateway & Server", "Express.js / Node.js", "Security headers, routing, auth middleware, error boundary"],
        ["AI & ATS Engine", "Gemini API / LLM", "Semantic scoring, resume parsing, keyword suggestions"],
        ["Persistence Layer", "MongoDB / Mongoose", "Encapsulates users, resumes, templates, and revision histories"],
        ["Client Interface", "React + Vite / Tailwind", "Interactive forms, live PDF preview, analytics dashboard"],
        ["Automation Suite", "Python / ReportLab", "Study guide synthesis, document generation, revision packs"]
    ]
    
    table = Table(summary_data, colWidths=[130, 120, 254])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
    ]))
    story.append(table)
    story.append(Spacer(1, 20))
    story.append(PageBreak())
    
    # File Breakdowns
    for rel_path, full_path in scanned_files:
        rel_str = str(rel_path).replace("\\", "/")
        annotation = get_annotation(full_path)
        
        story.append(Paragraph(f"📄 {rel_str}", h1_style))
        
        callout_content = [
            [Paragraph(f"<b>Purpose & Role:</b> {annotation['purpose']}", callout_title)],
            [Spacer(1, 4)]
        ]
        for pt in annotation['patterns']:
            callout_content.append([Paragraph(f"• {pt}", bullet_style)])
            
        callout_table = Table(callout_content, colWidths=[504])
        callout_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BAE6FD")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        
        story.append(callout_table)
        story.append(Spacer(1, 8))
        
        try:
            with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
                code_text = f.read()
        except Exception as e:
            code_text = f"// Error reading file: {str(e)}"
            
        lines = code_text.splitlines()
        CHUNK_SIZE = 38
        
        for i in range(0, max(1, len(lines)), CHUNK_SIZE):
            chunk = "\n".join(lines[i:i + CHUNK_SIZE])
            if not chunk.strip():
                continue
                
            code_block = Preformatted(chunk, code_style)
            code_table = Table([[code_block]], colWidths=[504])
            code_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            story.append(code_table)
            story.append(Spacer(1, 4))
            
        story.append(Spacer(1, 14))
        
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ PDF Study Guide successfully generated: {output_pdf_path}")

# ==============================================================================
# 6. NOTEBOOKLM MARKDOWN GENERATION PIPELINE
# ==============================================================================
def create_notebooklm_markdown(scanned_files, output_md_path: Path):
    ext_to_lang = {
        ".js": "javascript", ".jsx": "jsx", ".ts": "typescript", ".tsx": "tsx",
        ".py": "python", ".json": "json", ".html": "html", ".css": "css",
        ".yml": "yaml", ".yaml": "yaml", ".md": "markdown", ".sql": "sql"
    }
    
    with open(output_md_path, 'w', encoding='utf-8') as md:
        md.write(f"# {PROJECT_NAME} — System Architecture & Knowledge Corpus\n\n")
        md.write(f"> **Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n")
        md.write(f"> **Target Audience:** Technical Revision, System Design Interviews, NotebookLM Audio Deep Dive\n\n")
        
        md.write("## 1. Executive System Overview\n\n")
        md.write(
            "This repository contains the complete source code and architectural definition "
            f"for **{PROJECT_NAME}**. It bridges user interface input, state management, "
            "RESTful API backend routing, and AI-driven semantic text processing.\n\n"
        )
        
        md.write("### Architectural Summary Table\n\n")
        md.write("| Component / File | Purpose & Role | Key Architectural Concepts |\n")
        md.write("| :--- | :--- | :--- |\n")
        
        for rel_path, full_path in scanned_files:
            rel_str = str(rel_path).replace("\\", "/")
            annot = get_annotation(full_path)
            patterns_str = "<br>• ".join(annot["patterns"])
            md.write(f"| `{rel_str}` | {annot['purpose']} | • {patterns_str} |\n")
            
        md.write("\n---\n\n")
        md.write("## 2. Complete Source Code Walkthrough\n\n")
        
        for rel_path, full_path in scanned_files:
            rel_str = str(rel_path).replace("\\", "/")
            annot = get_annotation(full_path)
            ext = full_path.suffix.lower()
            lang = ext_to_lang.get(ext, "")
            
            md.write(f"### File: `{rel_str}`\n\n")
            md.write(f"**Purpose & Role:** {annot['purpose']}\n\n")
            md.write("**Key Concepts & Design Highlights:**\n")
            for pt in annot['patterns']:
                md.write(f"- {pt}\n")
            md.write("\n")
            
            try:
                with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
            except Exception as e:
                content = f"// Error reading file: {str(e)}"
                
            md.write(f"```{lang}\n")
            md.write(content.rstrip() + "\n")
            md.write("```\n\n---\n\n")
            
    print(f"✅ NotebookLM Markdown Source successfully generated: {output_md_path}")

# ==============================================================================
# 7. MAIN EXECUTION ENTRY
# ==============================================================================
def main():
    print("=" * 70)
    print(f"🚀 Initializing Study Guide Generation for: {PROJECT_NAME}")
    print(f"📂 Workspace Directory: {WORKSPACE_DIR}")
    print("=" * 70)
    
    scanned_files = scan_codebase(WORKSPACE_DIR)
    print(f"🔍 Discovered {len(scanned_files)} project source files for inclusion.\n")
    
    out_dir = WORKSPACE_DIR / "study_guide"
    out_dir.mkdir(exist_ok=True)
    
    clean_name = PROJECT_NAME.replace(" ", "_").replace("&", "and")
    pdf_path = out_dir / f"{clean_name}_Study_Guide.pdf"
    md_path = out_dir / f"{clean_name}_NotebookLM_Source.md"
    
    create_study_guide_pdf(scanned_files, pdf_path)
    create_notebooklm_markdown(scanned_files, md_path)
    
    print("\n🎉 All deliverables generated successfully!")
    print(f"📁 Study Guide PDF: {pdf_path}")
    print(f"📁 NotebookLM MD:   {md_path}")
    print("=" * 70)

if __name__ == "__main__":
    main()
