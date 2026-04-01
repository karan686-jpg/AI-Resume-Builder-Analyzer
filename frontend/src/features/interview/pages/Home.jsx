import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../../style/LandingHome.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="landing-home">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* ---- Navbar strip ---- */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="nav-logo">✦</span>
          <span className="nav-title">ResumeAI</span>
        </div>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <button
            className="nav-cta"
            onClick={() => navigate(user ? "/builder" : "/register")}
          >
            {user ? "Go to Builder" : "Get Started Free"}
          </button>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <div className="landing-hero">
        <div className="landing-badge">
          ✨ AI-Powered • 100% Free • No Credit Card
        </div>
        <h1>
          Land Your Dream Job with an{" "}
          <span className="highlight-purple">AI-Crafted</span>{" "}
          <span className="highlight-blue">Resume</span>
        </h1>
        <p className="hero-sub">
          Analyze gaps in your current resume or build a stunning new one from
          scratch — powered by Google Gemini AI.
        </p>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="stat-item">
            <span className="stat-num">4+</span>
            <span className="stat-label">Templates</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-label">Free</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">AI</span>
            <span className="stat-label">Writing Help</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">PDF</span>
            <span className="stat-label">Download</span>
          </div>
        </div>
      </div>

      {/* ---- Two Feature Cards ---- */}
      <div id="features" className="landing-cards">
        {/* Card 1: Analyze */}
        <div
          className="feature-card card-analyzer"
          onClick={() => navigate("/analyze")}
        >
          <div className="card-glow glow-purple" />
          <div className="card-icon-wrap icon-wrap-purple">
            <span className="card-icon">🔍</span>
          </div>
          <div className="card-title">Resume Analyzer</div>
          <p className="card-desc">
            Upload your resume + paste a job description. Our AI finds skill
            gaps, predicts interview questions, and gives you a personalized
            study roadmap to ace the interview.
          </p>
          <ul className="card-features">
            <li>
              <span className="check check-purple">✦</span> AI skill gap
              analysis
            </li>
            <li>
              <span className="check check-purple">✦</span> Personalized
              interview Qs
            </li>
            <li>
              <span className="check check-purple">✦</span> Job match score
            </li>
            <li>
              <span className="check check-purple">✦</span> PDF &amp; DOCX
              support
            </li>
          </ul>
          <button className="card-cta cta-purple">
            Analyze My Resume <span className="arrow">→</span>
          </button>
        </div>

        {/* Card 2: Build */}
        <div
          className="feature-card card-builder"
          onClick={() => navigate("/builder")}
        >
          <div className="card-glow glow-blue" />
          <div className="card-icon-wrap icon-wrap-blue">
            <span className="card-icon">🛠️</span>
          </div>
          <div className="card-title">Resume Builder</div>
          <p className="card-desc">
            Create a professional resume in minutes. Pick from beautiful
            templates, choose your accent color &amp; font, fill in your details
            — then download a perfect PDF.
          </p>
          <ul className="card-features">
            <li>
              <span className="check check-blue">✦</span> 4 professional
              templates
            </li>
            <li>
              <span className="check check-blue">✦</span> Custom colors &amp;
              fonts
            </li>
            <li>
              <span className="check check-blue">✦</span> AI-enhanced writing
            </li>
            <li>
              <span className="check check-blue">✦</span> One-click PDF download
            </li>
          </ul>
          <button className="card-cta cta-blue">
            Build My Resume <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* ---- How it works ---- */}
      <div id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Three simple steps to your perfect resume</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">📝</div>
            <h3>Fill Your Details</h3>
            <p>
              Enter your work experience, education, and skills using our easy
              step-by-step form.
            </p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">🎨</div>
            <h3>Pick a Template</h3>
            <p>
              Choose from Modern, Classic, Minimal, or Creative templates.
              Customize colors and fonts.
            </p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">⚡</div>
            <h3>Download &amp; Apply</h3>
            <p>
              Let AI enhance your writing, then download a perfect PDF resume
              ready to send to employers.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">✦ ResumeAI</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Help</a>
        </div>
        <div className="footer-copy">© 2025 ResumeAI. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
