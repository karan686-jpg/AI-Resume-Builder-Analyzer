# AI Resume Builder & Analyzer — System Architecture & Knowledge Corpus

> **Generated on:** 2026-08-29 20:45:55  
> **Target Audience:** Technical Revision, System Design Interviews, NotebookLM Audio Deep Dive

## 1. Executive System Overview

This repository contains the complete source code and architectural definition for **AI Resume Builder & Analyzer**. It bridges user interface input, state management, RESTful API backend routing, and AI-driven semantic text processing.

### Architectural Summary Table

| Component / File | Purpose & Role | Key Architectural Concepts |
| :--- | :--- | :--- |
| `README.md` | Source component handling resumefinal logic in the system. | • Implements standard .md modular architectural patterns<br>• Encapsulates domain-specific behavior within resumefinal scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/package.json` | Source component handling backend logic in the system. | • Implements standard .json modular architectural patterns<br>• Encapsulates domain-specific behavior within backend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/README.md` | Source component handling frontend logic in the system. | • Implements standard .md modular architectural patterns<br>• Encapsulates domain-specific behavior within frontend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/package.json` | Source component handling frontend logic in the system. | • Implements standard .json modular architectural patterns<br>• Encapsulates domain-specific behavior within frontend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/server.js` | Express application entry point and HTTP server lifecycle orchestrator. | • Configures core security middlewares (CORS, Helmet, Rate Limiter)<br>• Mounts modular REST API routes (/api/auth, /api/resumes, /api/analyze)<br>• Establishes MongoDB database connection pooling<br>• Global centralized error-handling middleware stack |
| `backend/src/app.js` | Application configuration and middleware bootstrapping module. | • Decouples app instance initialization from network listening for testability<br>• Body parser and JSON payload limits protection<br>• Morgan / Winston structured request logging |
| `frontend/src/App.jsx` | Root React application container and router provider. | • React Router DOM layout routes configuration<br>• Global Context / State Providers (AuthContext, ThemeContext)<br>• Lazy loading & code splitting for performance |
| `backend/src/config/database.js` | Source component handling config logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within config scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/config/imagekit.config.js` | Source component handling config logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within config scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/eslint.config.js` | Source component handling frontend logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within frontend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/vite.config.js` | Source component handling frontend logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within frontend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/models/blacklist.model.js` | Data layer definition enforcing data integrity. | • Schema validation rules<br>• Relational / Document data modeling |
| `backend/src/models/interviewReport.model.js` | Data layer definition enforcing data integrity. | • Schema validation rules<br>• Relational / Document data modeling |
| `backend/src/models/resume.model.js` | Data layer definition enforcing data integrity. | • Schema validation rules<br>• Relational / Document data modeling |
| `backend/src/models/user.model.js` | Data layer definition enforcing data integrity. | • Schema validation rules<br>• Relational / Document data modeling |
| `backend/src/controllers/ai.controller.js` | Source component handling controllers logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within controllers scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/controllers/auth.controller.js` | Source component handling controllers logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within controllers scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/controllers/imagekit.controller.js` | Source component handling controllers logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within controllers scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/controllers/interview.controller.js` | Source component handling controllers logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within controllers scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/routes/ai.routes.js` | API routing definition mapping HTTP endpoints to controllers. | • Route guard middleware enforcement<br>• RESTful endpoint mapping |
| `backend/src/routes/auth.routes.js` | API routing definition mapping HTTP endpoints to controllers. | • Route guard middleware enforcement<br>• RESTful endpoint mapping |
| `backend/src/routes/imagekit.routes.js` | API routing definition mapping HTTP endpoints to controllers. | • Route guard middleware enforcement<br>• RESTful endpoint mapping |
| `backend/src/routes/interview.routes.js` | API routing definition mapping HTTP endpoints to controllers. | • Route guard middleware enforcement<br>• RESTful endpoint mapping |
| `frontend/src/app.routes.jsx` | API routing definition mapping HTTP endpoints to controllers. | • Route guard middleware enforcement<br>• RESTful endpoint mapping |
| `backend/src/middleware/auth.middleware.js` | Interception layer for request validation and security inspection. | • Chain of responsibility pattern<br>• Token decoding & validation |
| `backend/src/middleware/file.middleware.js` | Interception layer for request validation and security inspection. | • Chain of responsibility pattern<br>• Token decoding & validation |
| `backend/src/services/ai.service.js` | Source component handling services logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within services scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/services/auth.api.services.js` | Source component handling services logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within services scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/interview/services/interview.api.js` | Source component handling services logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within services scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/services/resume.api.js` | Source component handling services logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within services scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `backend/src/examples/cvToResume.js` | Source component handling examples logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within examples scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/index.html` | Source component handling frontend logic in the system. | • Implements standard .html modular architectural patterns<br>• Encapsulates domain-specific behavior within frontend scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/index.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/main.jsx` | Source component handling src logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within src scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/assets/assets.js` | Source component handling assets logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within assets scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/auth.context.jsx` | Source component handling auth logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within auth scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/auth.form.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/features/auth/components/Protected.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/hooks/useAuth.js` | Source component handling hooks logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within hooks scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/pages/Dashboard.jsx` | Interactive analytics dashboard for resume performance & scores. | • Visual data charts rendering ATS metrics<br>• Optimistic UI updates for quick user responsiveness<br>• Responsive grid layout with modern glassmorphism aesthetic |
| `frontend/src/features/auth/pages/Layout.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/pages/Login.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/pages/Preview.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/pages/Register.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/auth/pages/ResumeBuilder.jsx` | Multi-step interactive resume builder with real-time live preview. | • Controlled form input state management<br>• Debounced live preview synchronization<br>• PDF export triggers and validation checks |
| `frontend/src/features/interview/interview.context.jsx` | Source component handling interview logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within interview scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/interview/hooks/useInterview.js` | Source component handling hooks logic in the system. | • Implements standard .js modular architectural patterns<br>• Encapsulates domain-specific behavior within hooks scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/interview/pages/AnalyzePage.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/interview/pages/Home.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/interview/pages/interview.jsx` | Source component handling pages logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within pages scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/ColorPicker.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/CustomSectionForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/EducationForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/ExperienceForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/PersonalInfoForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/ProfessionalSummaryForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/ResumePreview.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/SkillsForm.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/TemplatePicker.jsx` | Source component handling components logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within components scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/ClassicTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/CorporateTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/CreativeTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/ElegantTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/ExecutiveTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/MinimalTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/ModernTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/ProfessionalTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/components/templates/SimpleTemplate.jsx` | Source component handling templates logic in the system. | • Implements standard .jsx modular architectural patterns<br>• Encapsulates domain-specific behavior within templates scope<br>• Provides maintainable, decoupled functionality for upstream consumers |
| `frontend/src/features/resume/pages/ResumeBuilder.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/features/resume/pages/ResumeBuilder.jsx` | Multi-step interactive resume builder with real-time live preview. | • Controlled form input state management<br>• Debounced live preview synchronization<br>• PDF export triggers and validation checks |
| `frontend/src/style/Home.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/style/LandingHome.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/style/button.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |
| `frontend/src/style/interview.css` | Visual styling and design tokens specification. | • Theme definitions & responsive layout variables |

---

## 2. Complete Source Code Walkthrough

### File: `README.md`

**Purpose & Role:** Source component handling resumefinal logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .md modular architectural patterns
- Encapsulates domain-specific behavior within resumefinal scope
- Provides maintainable, decoupled functionality for upstream consumers

```markdown
# 📄 AI-Powered CV Generator

![CV Generator Hero](https://via.placeholder.com/1000x400.png?text=AI-Powered+CV+Generator)

An advanced full-stack AI-Driven Curriculum Vitae (CV) Generator developed using modern web technologies. This application leverages the power of generative AI models (Google Gemini) to transform user inputs and parsed PDFs into beautiful, professional portfolios effortlessly.

---

## 🌟 Key Features

* **🤖 AI-Powered Content Formatting:** Employs the Google Gemini AI module to parse user credentials and intelligently formulate descriptions and experiences.
* **🔧 Full-Stack React & Express:** Built efficiently with a React/Vite frontend for lightning-fast UI and an Express/Node.js backend for robust API integration.
* **☁️ Cloud Integrated Services:** Employs MongoDB/Mongoose for scalable data storage and ImageKit & Multer for versatile image and PDF upload handling.
* **🎨 Modern UI & PDF Export:** Fully styled using Tailwind CSS and Lucide React icons, offering an aesthetically pleasing interface with 1-click PDF exporting via `html2pdf.js`.
* **🔒 Secure Authentication:** Custom JWT integration alongside Bcrypt to ensure secure handling of personal data.

---

## 🚀 Tech Stack

### Frontend
- **React.js 19**
- **Vite**
- **Tailwind CSS V4**
- **React Router**
- **Lucide Icons**
- **HTML2PDF.js**

### Backend
- **Node.js & Express 5**
- **MongoDB (Mongoose)**
- **Google GenAI (Gemini)**
- **JSON Web Tokens (JWT) & Bcrypt**
- **ImageKit & Multer**
- **PDF-Parse** & **Zod** Validation

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a MongoDB cluster and API keys for Google Gemini and ImageKit.

### 1. Clone the repository
```bash
git clone https://github.com/karan686-jpg/AI-Resume-Builder-Analyzer.git
cd AI-Resume-Builder-Analyzer
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*Note: Create a `.env` file in the `backend` directory containing your necessary environment variables (e.g., `PORT`, `MONGO_URI`, `GEMINI_API_KEY`, `JWT_SECRET`, ImageKit strings).*
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to interact with your CV generator.

---

## 👨‍💻 Developed by Karan Datta
A showcase project built to demonstrate proficiency in orchestrating GenAI integration within a modern JavaScript ecosystem.
```

---

### File: `backend/package.json`

**Purpose & Role:** Source component handling backend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .json modular architectural patterns
- Encapsulates domain-specific behavior within backend scope
- Provides maintainable, decoupled functionality for upstream consumers

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "npx nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@google/genai": "^1.44.0",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "imagekit": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.4",
    "multer": "^2.1.1",
    "pdf-parse": "^2.4.5",
    "zod": "^4.3.6",
    "zod-to-json-schema": "^3.25.1"
  }
}
```

---

### File: `frontend/README.md`

**Purpose & Role:** Source component handling frontend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .md modular architectural patterns
- Encapsulates domain-specific behavior within frontend scope
- Provides maintainable, decoupled functionality for upstream consumers

```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

---

### File: `frontend/package.json`

**Purpose & Role:** Source component handling frontend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .json modular architectural patterns
- Encapsulates domain-specific behavior within frontend scope
- Provides maintainable, decoupled functionality for upstream consumers

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "axios": "^1.13.6",
    "html2pdf.js": "^0.14.0",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.13.1",
    "react-router-dom": "^7.13.1",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "sass": "^1.98.0",
    "vite": "^7.3.1"
  }
}
```

---

### File: `backend/server.js`

**Purpose & Role:** Express application entry point and HTTP server lifecycle orchestrator.

**Key Concepts & Design Highlights:**
- Configures core security middlewares (CORS, Helmet, Rate Limiter)
- Mounts modular REST API routes (/api/auth, /api/resumes, /api/analyze)
- Establishes MongoDB database connection pooling
- Global centralized error-handling middleware stack

```javascript
const dotenv = require("dotenv");
dotenv.config();
const {generateInterviewReport}=require("./src/services/ai.service");
const app = require("./src/app");
const connectDB= require("./src/config/database");

connectDB();


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

---

### File: `backend/src/app.js`

**Purpose & Role:** Application configuration and middleware bootstrapping module.

**Key Concepts & Design Highlights:**
- Decouples app instance initialization from network listening for testability
- Body parser and JSON payload limits protection
- Morgan / Winston structured request logging

```javascript
const express=require("express");
const app=express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json())
app.use(cookieParser());
app.use(cors({
     origin: function (origin, callback) {
       if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials:true
}));


const authRouter= require("./routes/auth.routes");
const interviewRouter= require("./routes/interview.routes");
const aiRouter = require("./routes/ai.routes");
const imagekitRouter = require("./routes/imagekit.routes");






app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/imagekit", imagekitRouter);

module.exports=app;
```

---

### File: `frontend/src/App.jsx`

**Purpose & Role:** Root React application container and router provider.

**Key Concepts & Design Highlights:**
- React Router DOM layout routes configuration
- Global Context / State Providers (AuthContext, ThemeContext)
- Lazy loading & code splitting for performance

```jsx
import "./App.scss";
import { router } from "./app.routes";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/interview.context";
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
```

---

### File: `backend/src/config/database.js`

**Purpose & Role:** Source component handling config logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within config scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const mongoose= require("mongoose");

const connectDB= async ()=>{
     try{
           await mongoose.connect(process.env.MONGO_URI);
           console.log("MongoDB connected");
     }
     catch(error){
           console.log(error);
           process.exit(1);
     }
}

module.exports=connectDB;
```

---

### File: `backend/src/config/imagekit.config.js`

**Purpose & Role:** Source component handling config logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within config scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_dummy_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_dummy_key",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
});

module.exports = imagekit;
```

---

### File: `frontend/eslint.config.js`

**Purpose & Role:** Source component handling frontend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within frontend scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

---

### File: `frontend/vite.config.js`

**Purpose & Role:** Source component handling frontend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within frontend scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    hmr: { clientPort: 5173 },
  }
})
```

---

### File: `backend/src/models/blacklist.model.js`

**Purpose & Role:** Data layer definition enforcing data integrity.

**Key Concepts & Design Highlights:**
- Schema validation rules
- Relational / Document data modeling

```javascript
const mongoose = require("mongoose");

const blacklistSchema= new mongoose.Schema({
    token:{
        type: String,
        required: true,
    }
});

const tokenBlacklistModel= mongoose.model("BlacklistTokens", blacklistSchema);

module.exports= tokenBlacklistModel;
```

---

### File: `backend/src/models/interviewReport.model.js`

**Purpose & Role:** Data layer definition enforcing data integrity.

**Key Concepts & Design Highlights:**
- Schema validation rules
- Relational / Document data modeling

```javascript
const mongoose= require ('mongoose');



const technicalQuestionSchema= new mongoose.Schema({
   question:{
    type:String,
    required:[true, "Technical question is required"]
   },
   intention:{
    type:String,
    required:[true," Intention is required"]
   },
   answer:{
    type:String,
    required:[true," Answer is required"]
 } 
},
   {
     _id:false
   
})

const behavioralQuestionSchema= new mongoose.Schema({
   question:{
    type:String,
    required:[true, "Behavioral question is required"]
   },
   intention:{
    type:String,
    required:[true," Intention is required"]
   },
   answer:{
    type:String,
    required:[true," Answer is required"]
 } 
},
   {
     _id:false
   
})
const skillGapsSchema= new mongoose.Schema({
   skillName:{
    type:String,
    required:[true, "Skill name is required"]
   },
   severity:{
     type:String,
     enum:["low","medium","high"],
     required:[true," Severity is required"] 
   },
   description:{
     type:String,
     default:""
   }
},{
     _id:false
})

const preparationPlanSchema= new mongoose.Schema({
   day:{ 
    type:Number,
    required:[true," Day is required"]
   },
   focus:{
    type:String,
    required:[true," focus is required"]
   },
   tasks:{
    type:[String],
    required:[true," Tasks are required"]
   },
   title:{
    type:String,
    default:""
   }
})

const interviewReportSchema= new mongoose.Schema({
   jobDescription:{
    type:String,
    required:true
   },
   resume:{
    type:String,
    default:""
   },
   resumeFile:{
       type: Buffer
   },
   resumeContentType:{
       type: String,
       default: "application/pdf"
   },
   selfDescription:{
    type:String,
    default:""
   },
   matchScore:{
     type:Number,
     min:0,
     max:100,
   },
   title:{
    type:String,
    default:"Interview Preparation"
   },
   technicalQuestions:[technicalQuestionSchema],
   behavioralQuestions:[behavioralQuestionSchema],
   skillGaps:[skillGapsSchema],
   preparationPlan:[preparationPlanSchema],
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
   }

},{
     timestamps:true
})

const interviewReportModel= mongoose.model("InterviewReport",interviewReportSchema);
module.exports= interviewReportModel;
```

---

### File: `backend/src/models/resume.model.js`

**Purpose & Role:** Data layer definition enforcing data integrity.

**Key Concepts & Design Highlights:**
- Schema validation rules
- Relational / Document data modeling

```javascript
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Resume"
  },
  themeColor: {
    type: String,
    default: "#000000"
  },
  activeTemplate: {
    type: String,
    default: "classic"
  },
  personalInfo: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  professionalSummary: {
    type: String,
    default: ""
  },
  experience: [{
    company: { type: String, required: true },
    role: { type: String, required: true },
    dates: { type: String, required: true },
    description: { type: String, default: "" }
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    dates: { type: String, required: true },
    fieldOfStudy: { type: String, default: "" }
  }],
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
```

---

### File: `backend/src/models/user.model.js`

**Purpose & Role:** Data layer definition enforcing data integrity.

**Key Concepts & Design Highlights:**
- Schema validation rules
- Relational / Document data modeling

```javascript
const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
});

const userModel= mongoose.model("User", userSchema);

module.exports= userModel;
```

---

### File: `backend/src/controllers/ai.controller.js`

**Purpose & Role:** Source component handling controllers logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within controllers scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Endpoint: /api/ai/enhance-summary
const enhanceSummary = async (req, res) => {
  try {
    const { draftSummary } = req.body;

    if (!draftSummary) {
      return res.status(400).json({ error: "draftSummary is required." });
    }

    const prompt = `
      You are an expert resume writer and career coach. 
      Please take the following draft professional summary and rewrite it into a powerful, ATS-friendly, 2-sentence version that highlights the candidate's value.
      
      Draft Summary:
      ${draftSummary}

      Return ONLY the final 2-sentence summary without any extra conversational text.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const enhancedSummary = response.text.trim();

    res.status(200).json({ success: true, enhancedSummary });
  } catch (error) {
    console.error("Enhance Summary Error:", error);
    if (error.status === 429) {
      return res.status(429).json({ error: "Gemini API Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to enhance summary." });
  }
};

// Endpoint: /api/ai/enhance-experience
const enhanceExperience = async (req, res) => {
  try {
    const { draftDescription, jobTitle, companyName } = req.body;

    if (!draftDescription || !jobTitle || !companyName) {
      return res.status(400).json({ 
        error: "draftDescription, jobTitle, and companyName are required." 
      });
    }

    const prompt = `
      You are an expert resume writer. Please improve the following draft job description for a ${jobTitle} at ${companyName}.
      
      Draft Description:
      ${draftDescription}
      
      Rewrite it into a highly professional, strong, bulleted description using powerful action verbs focusing on achievements and impact. 
      Limit to 3-5 concise bullet points. Make it ATS-friendly.
      Return ONLY the bullet points (use standard bullet characters or markdown hyphens). Do not include extra conversational text.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const enhancedDescription = response.text.trim();

    res.status(200).json({ success: true, enhancedDescription });
  } catch (error) {
    console.error("Enhance Experience Error:", error);
    if (error.status === 429) {
      return res.status(429).json({ error: "Gemini API Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to enhance experience." });
  }
};

module.exports = {
  enhanceSummary,
  enhanceExperience
};
```

---

### File: `backend/src/controllers/auth.controller.js`

**Purpose & Role:** Source component handling controllers logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within controllers scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 1. REGISTER - Create a new user
const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password (so it's not stored as plain text)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Create a JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send token in a cookie
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({ message: "User registered successfully", user: { username: newUser.username, email: newUser.email } });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 2. LOGIN - Log in an existing user
const loginUserConroller = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the entered password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send token in a cookie
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 3. LOGOUT - Log out the user
const logoutUserConroller = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        // Add token to blacklist so it can't be used again
        await tokenBlacklistModel.create({ token });

        // Clear the cookie from browser
        res.clearCookie("token");

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 4. GET ME - Get the currently logged-in user's info
const getMeController = async (req, res) => {
    try {
        // req.user is set by the auth middleware (it has the decoded token)
        const user = await userModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


module.exports = {
    registerController,
    loginUserConroller,
    logoutUserConroller,
    getMeController,
};
```

---

### File: `backend/src/controllers/imagekit.controller.js`

**Purpose & Role:** Source component handling controllers logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within controllers scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const imagekit = require("../config/imagekit.config");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const { removeBackground } = req.body;

    // Convert multer file buffer to base64 for ImageKit upload
    const fileBase64 = req.file.buffer.toString("base64");

    // Upload options
    const uploadOptions = {
      file: fileBase64,
      fileName: req.file.originalname,
      folder: "/resumeai/avatars",
    };

    // If removeBackground is true, apply the background removal extension
    if (removeBackground === "true" || removeBackground === true) {
      uploadOptions.extensions = [
        {
          name: "remove-bg",
          options: {
            add_shadow: false
          }
        }
      ];
    }

    const response = await imagekit.upload(uploadOptions);

    res.status(200).json({
      success: true,
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

module.exports = {
  uploadImage
};
```

---

### File: `backend/src/controllers/interview.controller.js`

**Purpose & Role:** Source component handling controllers logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within controllers scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const { PDFParse } = require("pdf-parse");

const {generateInterviewReport}=require("../services/ai.service");
const InterviewReportModel= require("../models/interviewReport.model");

const generateInterviewReportController= async (req,res)=>{
     try{
          const {jobDescription}=req.body;
          
          let resumeContent = "";
          let resumeFileBuffer = undefined;
          let resumeContentType = undefined;

          if (req.file) {
               resumeFileBuffer = req.file.buffer;
               resumeContentType = req.file.mimetype;
               // Correctly instantiate the new version 2.x which provides a class
               const parser = new PDFParse({ data: resumeFileBuffer });
               const pdfData = await parser.getText();
               await parser.destroy(); // Free memory
               resumeContent = pdfData.text;
          }

          const interviewReportByAi = await generateInterviewReport({
               resume: resumeContent,
               jobDescription,
               selfDescription: req.body.selfDescription || ""
          });

          // Save to DB before returning
          const interviewReport = await InterviewReportModel.create({
               jobDescription,
               title: interviewReportByAi.title || "Software Engineer Interview",
               resume: resumeContent,
               resumeFile: resumeFileBuffer,
               resumeContentType: resumeContentType,
               selfDescription: req.body.selfDescription || "",
               ...interviewReportByAi,
               user: req.user.id
          });

          // Don't send the heavy buffer back in the JSON response
          const reportObj = interviewReport.toObject();
          delete reportObj.resumeFile;
          
          return res.status(200).json({ interviewReport: reportObj });

     }catch(error){
          console.error("Interview Generation Error:", error);
          const status = error.status || 500;
          let message = "Something went wrong: " + (error.message || JSON.stringify(error));
          
          if (status === 429) {
               message = "Gemini API Rate Limit / Quota Exceeded. Please check your Google API console for limits.";
          } else if (status === 400) {
               message = "Gemini API Bad Request. Please check your inputs.";
          } else if (status === 502) {
               message = "The AI generated an invalid response that couldn't be parsed. Please try again.";
          } else if (error.name === "ValidationError") {
               message = "The AI missed some crucial information based on your inputs. Please provide a more detailed job description or resume and try again.";
          }
          
          return res.status(status).json({ message, error: error.message });
     }
}

const getInterviewReportByIdController = async (req, res) => {
     try {
         const { id } = req.params;
         // Exclude the heavy resumeFile buffer from the JSON response
         const report = await InterviewReportModel.findById(id).select('-resumeFile');
         
         if (!report) {
             return res.status(404).json({ message: "Interview report not found" });
         }
         
         // ensure user owns this?
         if (report.user.toString() !== req.user.id) {
             return res.status(403).json({ message: "Unauthorized to view this report" });
         }

         return res.status(200).json(report);
     } catch (error) {
         return res.status(500).json({ message: "Something went wrong", error: error.message });
     }
};

const getResumePdfById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await InterviewReportModel.findById(id).select('resumeFile resumeContentType user');
        
        if (!report || !report.resumeFile) {
            return res.status(404).json({ message: "Resume PDF not found" });
        }
        
        if (report.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to download this resume" });
        }

        res.set({
            'Content-Type': report.resumeContentType || 'application/pdf',
            'Content-Disposition': `attachment; filename="resume_${id}.pdf"`,
        });

        return res.send(report.resumeFile);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
async function getAllInterviewReportsController(req,res){
     try{
          const reports= await InterviewReportModel.find({user:req.user.id}).select('-resumeFile -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -resume');
          return res.status(200).json(reports);
     }catch(error){
          return res.status(500).json({message:"Something went wrong",error:error.message});
     }
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getResumePdfById ,
    getAllInterviewReportsController
}
```

---

### File: `backend/src/routes/ai.routes.js`

**Purpose & Role:** API routing definition mapping HTTP endpoints to controllers.

**Key Concepts & Design Highlights:**
- Route guard middleware enforcement
- RESTful endpoint mapping

```javascript
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

// POST /api/ai/enhance-summary
router.post("/enhance-summary", aiController.enhanceSummary);

// POST /api/ai/enhance-experience
router.post("/enhance-experience", aiController.enhanceExperience);

module.exports = router;
```

---

### File: `backend/src/routes/auth.routes.js`

**Purpose & Role:** API routing definition mapping HTTP endpoints to controllers.

**Key Concepts & Design Highlights:**
- Route guard middleware enforcement
- RESTful endpoint mapping

```javascript
const {Router}= require("express");
const authController= require("../controllers/auth.controller");
const authRouter= Router();

const authMiddleware= require("../middleware/auth.middleware");

//Register
authRouter.post("/register", authController.registerController);     
//Login
authRouter.post("/login", authController.loginUserConroller);

//logout 
authRouter.get("/logout", authController.logoutUserConroller);

//get-me
authRouter.get("/get-me", authMiddleware, authController.getMeController);

module.exports= authRouter;
```

---

### File: `backend/src/routes/imagekit.routes.js`

**Purpose & Role:** API routing definition mapping HTTP endpoints to controllers.

**Key Concepts & Design Highlights:**
- Route guard middleware enforcement
- RESTful endpoint mapping

```javascript
const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageKitController = require("../controllers/imagekit.controller");

// Set up multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), imageKitController.uploadImage);

module.exports = router;
```

---

### File: `backend/src/routes/interview.routes.js`

**Purpose & Role:** API routing definition mapping HTTP endpoints to controllers.

**Key Concepts & Design Highlights:**
- Route guard middleware enforcement
- RESTful endpoint mapping

```javascript
const express= require("express");
const authMiddleware= require("../middleware/auth.middleware");
const interviewController= require("../controllers/interview.controller");
const interviewRouter= express.Router();
const upload= require("../middleware/file.middleware");
interviewRouter.post("/",authMiddleware,upload.single("resume"),interviewController.generateInterviewReportController)


// Get a specific report by ID
interviewRouter.get("/:id", authMiddleware, interviewController.getInterviewReportByIdController);

// Download the original resume PDF by report ID
interviewRouter.get("/:id/resume", authMiddleware, interviewController.getResumePdfById);

interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController);

module.exports=interviewRouter;
```

---

### File: `frontend/src/app.routes.jsx`

**Purpose & Role:** API routing definition mapping HTTP endpoints to controllers.

**Key Concepts & Design Highlights:**
- Route guard middleware enforcement
- RESTful endpoint mapping

```jsx
import { createBrowserRouter } from "react-router";
import Home from "./features/interview/pages/Home";
import AnalyzePage from "./features/interview/pages/AnalyzePage";
import Interview from "./features/interview/pages/interview";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./features/auth/pages/Dashboard";
import Protected from "./features/auth/components/Protected";
import ResumeBuilder from "./features/resume/pages/ResumeBuilder";

export const router = createBrowserRouter([
  {
    // Landing page — user picks Analyzer or Builder
    path: "/",
    element: <Home />,
  },
  {
    // Resume Analyzer: upload PDF + job description → AI interview plan
    path: "/analyze",
    element: (
      <Protected>
        <AnalyzePage />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    // Resume Builder: fill details → pick template & color → download PDF
    path: "/builder",
    element: (
      <Protected>
        <ResumeBuilder />
      </Protected>
    ),
  },
]);
```

---

### File: `backend/src/middleware/auth.middleware.js`

**Purpose & Role:** Interception layer for request validation and security inspection.

**Key Concepts & Design Highlights:**
- Chain of responsibility pattern
- Token decoding & validation

```javascript
const tokenBlacklistModel= require("../models/blacklist.model");

const jwt= require("jsonwebtoken");

async function authUser(req, res, next){
    const token= req.cookies.token;
    if(!token){
        return res.status(400).json({message: "No token found"});
    }

    const isTokenBlacklisted= await tokenBlacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(400).json({message: "Invalid token"});
    }

    try{
    const decodedToken= jwt.verify(token, process.env.JWT_SECRET);

    req.user= decodedToken;

    next();
    }catch(error){
        return res.status(400).json({message: "Invalid token"});
    }
}

module.exports= authUser;
```

---

### File: `backend/src/middleware/file.middleware.js`

**Purpose & Role:** Interception layer for request validation and security inspection.

**Key Concepts & Design Highlights:**
- Chain of responsibility pattern
- Token decoding & validation

```javascript
const multer=require("multer");

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, "uploads/");
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     },
});

const upload = multer({ 
     storage :multer.memoryStorage(),
     limits:{
          fileSize:1024*1024*3
          
     }
});

module.exports= upload;
```

---

### File: `backend/src/services/ai.service.js`

**Purpose & Role:** Source component handling services logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within services scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
const {GoogleGenAI} =require("@google/genai");

const genAI = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});
const {z} =require("zod");
const {zodToJsonSchema} =require("zod-to-json-schema");

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The percentage match between the candidate's resume and the job requirements"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question"),
            intention: z.string().describe("The intention behind asking the question"),
            answer: z.string().describe(" How to answer the question, What points to cover ,what is the approach"),
            title: z.string().describe(" The title of the day in the preparation strategy"),
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("The behavioral question"),
            intention: z.string().describe("The intention behind asking the question"),
            answer: z.string().describe(" How to answer the question, What points to cover ,what is the approach")
        }).describe("Behavioral questions")
    ),
    skillGaps: z.array(
        z.object({
            skillName: z.string().describe("The skill name"),
            severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
            description: z.string().describe("The description of the skill gap")
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe(" The day number in the preparation plan starting from 1"),
            focus: z.string().describe(" The main focus of the day in the preparation strategy"),
            tasks: z.array(z.string()).describe(" The tasks to be completed on the day"),
            title: z.string().describe(" The title of the day in the preparation strategy"),
        })
    )
});

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    const prompt = `
    You are an expert career coach and technical interviewer. 
    Generate a comprehensive interview report based on the following inputs:
    
    1. Job Description:
    ${jobDescription}
    
    2. Candidate's Resume:
    ${resume || "(No resume provided)"}
    
    3. Candidate's Self-Description:
    ${selfDescription || "(No self description provided)"}
    
    Please generate the following sections:
    
    A. Title:
    - A short, catchy title for this interview report (e.g., "Software Engineer at Google Interview Prep").
    
    A. Match Score (0-100):
    - Calculate the percentage match between the candidate's resume and the job requirements.
    
    B. Technical Questions:
    - Generate 5-7 technical questions that would be asked in an interview for this role.
    - For each question, provide:
      - The question itself
      - The intention behind asking the question
      - A sample ideal answer
    
    C. Behavioral Questions:
    - Generate 5-7 behavioral questions to assess soft skills and cultural fit.
    - For each question, provide:
      - The question itself
      - The intention behind asking the question
      - A sample ideal answer
    
    D. Skill Gaps:
    - Identify key skill gaps between the candidate's profile and the job requirements.
    - For each gap, provide:
      - Skill name
      - Severity (low, medium, high)
    
    E. Preparation Plan:
    - Create a structured 7-day preparation plan.
    - For each day, provide:
      - Day number
      - Focus area
      - Specific tasks to work on
    
    Please format the output as a JSON object with the following structure:
    {
      "title": "string (short report title)",
      "matchScore": number,
      "technicalQuestions": [
        {
          "question": "string",
          "intention": "string",
          "answer": "string"
        }
      ],
      "behavioralQuestions": [
        {
          "question": "string",
          "intention": "string",
          "answer": "string"
        }
      ],
      "skillGaps": [
        {
          "skillName": "string",
          "severity": "low | medium | high",
          "description": "string"
        }
      ],
      "preparationPlan": [
        {
          "day": number,
          "title": "string",
          "focus": "string",
          "tasks": ["string"]
        }
      ]
    }
    `;

    
    const response = await genAI.models.generateContent({
          model:"gemini-2.0-flash",
          contents: prompt,
        config:{
            responseMimeType:"application/json"
        }
        });
        let result = response.text;
        
        // Sometimes the AI wraps the JSON in markdown code blocks
        // Extract the content between the backticks if present
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (jsonMatch) {
            result = jsonMatch[1];
        }
        
        try {
            return JSON.parse(result);
        } catch (err) {
            console.error("AI JSON Parse Error:", err);
            // Throw a specific error we can catch in the controller
            const error = new Error("Failed to parse AI response into valid JSON.");
            error.status = 502; // Bad Gateway / Bad Response from upstream
            throw error;
        }
    }


module.exports = {
    generateInterviewReport
};
```

---

### File: `frontend/src/features/auth/services/auth.api.services.js`

**Purpose & Role:** Source component handling services logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within services scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import axios from "axios";

const api= axios.create({
     baseURL:'http://localhost:3000/api/auth',
     withCredentials:true,
})

export async function register(username,email,password){
     try{
          const response= await api.post('/register',{
               username,
               email,
               password
          })
          return response.data;
     }catch(error){
          console.log(error); 
          throw error;
     }
}




export async function login(email,password){
     try{
          const response= await api.post('/login',{
               email,
               password
          })
          return response.data;
     }catch(error){
          console.log(error); 
          throw error;
     }
}



export async function logout(){
     try{
          const response= await api.get('/logout')
          return response.data;
     }catch(error){
          console.log(error); 
          throw error;
     }
}


export async function getMe(){
     try{
          const response= await api.get('/get-me')
          return response.data;
     }catch(error){
          console.log(error); 
          throw error;
     }
}
```

---

### File: `frontend/src/features/interview/services/interview.api.js`

**Purpose & Role:** Source component handling services logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within services scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import axios from "axios";

const api = axios.create({
     baseURL: 'http://localhost:3000/api/interview',
     withCredentials: true,
});

export const generateInterviewReport= async ({resume,jobDescription,selfDescription})=>{
     try{
          const formData= new FormData();
          if (resume) {
               formData.append("resume", resume);
          }
          formData.append("jobDescription",jobDescription);
          formData.append("selfDescription",selfDescription);
          console.log(formData);
          const response= await api.post("/",formData,{
               headers:{
                    "Content-Type":"multipart/form-data"
               }
          });
          return response.data;
     }catch(error){
          console.error("Generate Report Error:", error);
          throw error;
     }
}

export const getInterviewReportById= async (id)=>{
     try{
          const response= await api.get(`/${id}`);
          return response.data;
     }catch(error){
          console.error("Get Report Error:", error);
          throw error;
     }
}
export const getAllInterviewReports= async ()=>{
     try{
          const response= await api.get("/");
          return response.data;
     }catch(error){
          console.error("Get All Reports Error:", error);
          throw error;
     }
}

export const getResumePdf = async (id) => {
     try {
          // Must set responseType to blob to handle binary data correctly
          const response = await api.get(`/${id}/resume`, {
               responseType: 'blob'
          });
          return response.data;
     } catch (error) {
          console.error("Download Resume Error:", error);
          throw error;
     }
}
```

---

### File: `frontend/src/features/resume/services/resume.api.js`

**Purpose & Role:** Source component handling services logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within services scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import axios from "axios";

// Separate instances for AI and ImageKit if needed, or point to base APIs
const aiApi = axios.create({
  baseURL: "http://localhost:3000/api/ai",
  withCredentials: true,
});

const imagekitApi = axios.create({
  baseURL: "http://localhost:3000/api/imagekit",
  withCredentials: true,
});

export const enhanceSummary = async (draftSummary) => {
  try {
    const response = await aiApi.post("/enhance-summary", { draftSummary });
    return response.data.enhancedSummary;
  } catch (error) {
    console.error("Enhance Summary Error:", error);
    throw error;
  }
};

export const enhanceExperience = async (draftDescription, jobTitle, companyName) => {
  try {
    const response = await aiApi.post("/enhance-experience", {
      draftDescription,
      jobTitle,
      companyName,
    });
    return response.data.enhancedDescription;
  } catch (error) {
    console.error("Enhance Experience Error:", error);
    throw error;
  }
};

export const uploadProfileImage = async (file, removeBackground) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("removeBackground", removeBackground);

    const response = await imagekitApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { success, url, fileId }
  } catch (error) {
    console.error("Upload Image Error:", error);
    throw error;
  }
};
```

---

### File: `backend/src/examples/cvToResume.js`

**Purpose & Role:** Source component handling examples logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within examples scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
/**
 * Example Integration: Mapping CV Parser Output to the new Resume Schema
 * 
 * Let's assume you have a parsedCV object output from your existing logic (e.g., pdf-parse, OpenAI, or Gemini parser):
 * 
 * const parsedCV = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   phone: "123-456-7890",
 *   skills: ["React", "Express", "Node.js"],
 *   summary: "A passionate backend developer...",
 *   experience: [
 *     { company: "Tech Corp", jobTitle: "Backend Dev", duration: "Jan 2020 - Jan 2023", duties: "Built APIs" }
 *   ],
 *   education: [
 *     { school: "University X", degree: "B.S. CS", dates: "2016-2020" }
 *   ]
 * };
 * 
 * You can map this output directly when creating a new Resume document:
 */

const Resume = require("./models/resume.model");

async function createResumeFromCV(userId, parsedCV) {
  try {
    const newResumeData = {
      userId: userId,
      title: `${parsedCV.name || 'Candidate'}'s Generated Resume`,
      themeColor: "#2563EB", // Blue default
      activeTemplate: "modern",

      // Spread personal info
      personalInfo: {
        name: parsedCV.name || "",
        email: parsedCV.email || "",
        phone: parsedCV.phone || "",
        linkedIn: parsedCV.linkedIn || "", // If available
        imageUrl: "" // Set later via ImageKit if needed
      },

      professionalSummary: parsedCV.summary || "",

      // Map experience
      experience: (parsedCV.experience || []).map(exp => ({
        company: exp.company || "Unknown Company",
        role: exp.jobTitle || "Unknown Role",
        dates: exp.duration || "Present",
        description: exp.duties || ""
      })),

      // Map education
      education: (parsedCV.education || []).map(edu => ({
        institution: edu.school || "Unknown Institution",
        degree: edu.degree || "Degree",
        dates: edu.dates || "Present",
        fieldOfStudy: edu.fieldOfStudy || ""
      })),

      // Store skills
      skills: parsedCV.skills || []
    };

    // Save to the database
    const newResume = new Resume(newResumeData);
    await newResume.save();

    return newResume;
  } catch (error) {
    console.error("Error creating resume from CV:", error);
    throw error;
  }
}

module.exports = {
  createResumeFromCV
};
```

---

### File: `frontend/index.html`

**Purpose & Role:** Source component handling frontend logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .html modular architectural patterns
- Encapsulates domain-specific behavior within frontend scope
- Provides maintainable, decoupled functionality for upstream consumers

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### File: `frontend/src/index.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
@import "tailwindcss";

/* 
  Custom styles for smooth scrolling and scrollbar 
*/
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Fix text color in inputs and textareas globally to prevent white-on-white issues */
.rb-page input, .rb-page textarea {
  color: #1f2937 !important;
}

/* 
  Print Media Queries for PDF Export 
  This ensures only the actual Resume preview is saved.
*/
@media print {
  body {
    background-color: white !important;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Hide the top header */
  header {
    display: none !important;
  }

  /* Make the main Grid become a normal block without padding */
  main {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Hide the left column (Forms) */
  main > div:first-child {
    display: none !important;
  }

  /* Expand the right column to fill the page, removing sticky behaviour */
  main > div:last-child {
    display: block !important;
    position: static !important;
    height: auto !important;
    overflow: visible !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
  }

  /* Ensure the A4 page layout naturally fills the print document */
  @page {
    size: A4;
    margin: 0;
  }
}
```

---

### File: `frontend/src/main.jsx`

**Purpose & Role:** Source component handling src logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within src scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### File: `frontend/src/assets/assets.js`

**Purpose & Role:** Source component handling assets logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within assets scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import dummy_profile from './dummy_profile.png'

export const dummyResumeData = [
    {
        // ----------------------------------------------------- Resume 1 ------------------------------------------------------
        personal_info: {
            full_name: "Alex Smith",
            email: "alex@example.com",
            phone: "0 123456789",
            location: "NY, USA",
            linkedin: "https://www.linkedin.com",
            website: "https://www.example.com",
            profession: "Full Stack Developer",
            image: dummy_profile
        },
        _id: "68d2a31a1c4dd38875bb037e",
        userId: "68c180acdf1775dfd02c6d87",
        title: "Alex's Resume",
        public: true,
        professional_summary: "Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools. ",
        skills: ["JavaScript", "React JS", "Full Stack Development", "Git", "GitHub", "NextJS", "Express", "NodeJS", "TypeScript"],
        experience: [
            {
                company: "Example Technologies.",
                position: "Senior Full Stack Developer",
                start_date: "2023-06",
                end_date: "Present",
                description: "Architected, developed, and deployed innovative full-stack applications at Example Technologies.\ncreating robust back-end systems and intuitive front- end interfaces to deliver meaningful digital experiences ",
                is_current: true,
                _id: "68d2a31a1c4dd38875bb037f"
            },
            {
                company: "Example Technologies.",
                position: "Full Stack Developer",
                start_date: "2019-08",
                end_date: "2023-05",
                description: "Engineered and deployed scalable full-stack web applications for Example Technologies, translating complex requirements into robust front-end interfaces and efficient back-end services.",
                is_current: false,
                _id: "68d4f7abc8f0d46dc8a8b114"
            }
        ],
        education: [
            {
                institution: "Example Institute of Technology",
                degree: "B.TECH",
                field: "CSE",
                graduation_date: "2023-05",
                gpa: "8.7",
                _id: "68d2a31a1c4dd38875bb0380"
            },
            {
                institution: "Example Public School",
                degree: "HIGHER SECONDARY",
                field: "PCM",
                graduation_date: "2019-03",
                gpa: "",
                _id: "68d2a31a1c4dd38875bb0381"
            },
            {
                institution: "Example Academy",
                degree: "SECONDARY SCHOOL",
                field: "",
                graduation_date: "2017-03",
                gpa: "",
                _id: "68d2a31a1c4dd38875bb0382"
            }
        ],
        template: "minimal-image",
        accent_color: "#14B8A6",
        project: [
            {
                name: "Team Task Management System",
                type: "Web Application (Productivity Tool)",
                description: "TaskTrackr is a collaborative task management system designed for teams to create, assign, track, and manage tasks in real time. ",
                _id: "68d4f882c8f0d46dc8a8b139"
            },
            {
                name: "EduHub - Online Learning Platform",
                type: "Web Application (EdTech Platform)",
                description: "EduHub is an online learning platform where instructors can create courses with video lessons, quizzes, and downloadable resources.",
                _id: "68d4f89dc8f0d46dc8a8b147"
            }
        ],
        updatedAt: "2025-09-23T13:39:38.395Z",
        createdAt: "2025-09-23T13:39:38.395Z"
    },
    {
        // ----------------------------------------------------- Resume 2 ------------------------------------------------------
        personal_info: {
            full_name: "Jordan Lee",
            email: "jordan.lee@example.com",
            phone: "0 987654321",
            location: "San Francisco, CA, USA",
            linkedin: "https://www.linkedin.com/in/jordanlee",
            website: "https://www.jordanlee.dev",
            profession: "Frontend Engineer",
            image: dummy_profile
        },
        _id: "78e3b42c2d5ff49286cc148f",
        userId: "78d2e0bdcf2886efg03e7e98",
        title: "Jordan's Resume",
        public: true,
        professional_summary: "Creative and detail-oriented Frontend Engineer with 5+ years of experience crafting responsive, user-centric web applications using React, Vue, and modern CSS frameworks.",
        skills: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "SASS", "Tailwind CSS", "Figma", "Web Accessibility", "REST APIs"],
        experience: [
            {
                company: "TechSpark Inc.",
                position: "Lead Frontend Engineer",
                start_date: "2022-02",
                end_date: "Present",
                description: "Leading a team of frontend developers to build accessible and scalable user interfaces. Collaborated with UX teams to implement design systems and improve frontend performance.",
                is_current: true,
                _id: "78e3b42c2d5ff49286cc1490"
            },
            {
                company: "PixelForge Labs",
                position: "Frontend Developer",
                start_date: "2018-09",
                end_date: "2022-01",
                description: "Developed reusable UI components using React and Vue.js. Worked closely with backend teams to integrate REST APIs and optimize SPA performance.",
                is_current: false,
                _id: "78e3b42c2d5ff49286cc1491"
            }
        ],
        education: [
            {
                institution: "University of Digital Arts",
                degree: "B.Sc.",
                field: "Computer Science",
                graduation_date: "2018-06",
                gpa: "3.8",
                _id: "78e3b42c2d5ff49286cc1492"
            },
            {
                institution: "Lincoln High School",
                degree: "High School Diploma",
                field: "Science",
                graduation_date: "2014-05",
                gpa: "",
                _id: "78e3b42c2d5ff49286cc1493"
            }
        ],
        template: "minimal-image",
        accent_color: "#6366F1",
        project: [
            {
                name: "FitTrack - Fitness Dashboard",
                type: "Web Application (Health & Fitness)",
                description: "FitTrack is a fitness analytics dashboard that allows users to log workouts, track progress, and visualize performance through interactive charts.",
                _id: "78e3b42c2d5ff49286cc1494"
            },
            {
                name: "ShopEase - E-commerce UI Kit",
                type: "Frontend UI Kit",
                description: "ShopEase is a modular e-commerce frontend template with ready-to-use components for product listing, cart management, and responsive navigation.",
                _id: "78e3b42c2d5ff49286cc1495"
            }
        ],
        updatedAt: "2025-09-25T15:10:21.184Z",
        createdAt: "2025-09-25T15:10:21.184Z"
    },
    {
        // ----------------------------------------------------- Resume 3 ------------------------------------------------------
        personal_info: {
            full_name: "Riley Morgan",
            email: "riley.morgan@example.com",
            phone: "0 1122334455",
            location: "Austin, TX, USA",
            linkedin: "https://www.linkedin.com/in/rileymorgan",
            website: "https://www.rileym.dev",
            profession: "Backend Developer",
            image: dummy_profile
        },
        _id: "89f4c53d3e6gg59397dd259g",
        userId: "89e3f1cedg3997fgh14f8f09",
        title: "Riley's Resume",
        public: true,
        professional_summary: "Dedicated Backend Developer with 7+ years of experience building secure, high-performance APIs and microservices using Node.js, Python, and PostgreSQL. Passionate about scalability, automation, and clean architecture.",
        skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "CI/CD", "Redis", "GraphQL", "AWS"],
        experience: [
            {
                company: "DataNest Solutions",
                position: "Senior Backend Engineer",
                start_date: "2021-03",
                end_date: "Present",
                description: "Developed distributed microservices using Node.js and Docker. Implemented API rate limiting, authentication, and background job processing using Redis and Bull.",
                is_current: true,
                _id: "89f4c53d3e6gg59397dd259h"
            },
            {
                company: "CloudCore Systems",
                position: "Backend Developer",
                start_date: "2016-07",
                end_date: "2021-02",
                description: "Maintained and scaled backend systems built on Python and PostgreSQL. Automated deployments with GitLab CI/CD and improved API response time by 35%.",
                is_current: false,
                _id: "89f4c53d3e6gg59397dd259i"
            }
        ],
        education: [
            {
                institution: "Texas Institute of Technology",
                degree: "B.E.",
                field: "Information Technology",
                graduation_date: "2016-05",
                gpa: "3.9",
                _id: "89f4c53d3e6gg59397dd259j"
            },
            {
                institution: "Central High School",
                degree: "High School Diploma",
                field: "Science",
                graduation_date: "2012-04",
                gpa: "",
                _id: "89f4c53d3e6gg59397dd259k"
            }
        ],
        template: "minimal-image",
        accent_color: "#F59E0B",
        project: [
            {
                name: "Invoicr - Invoice Management System",
                type: "Web Application (FinTech)",
                description: "Invoicr is a secure web platform that allows freelancers and small businesses to generate, track, and automate professional invoices. Built with Node.js, MongoDB, and Stripe integration.",
                _id: "89f4c53d3e6gg59397dd259l"
            },
            {
                name: "API Monitor Dashboard",
                type: "DevOps Tool",
                description: "A real-time API monitoring dashboard for microservices. Tracks latency, uptime, and error rates using Prometheus and Grafana.",
                _id: "89f4c53d3e6gg59397dd259m"
            }
        ],
        updatedAt: "2025-09-25T15:26:49.652Z",
        createdAt: "2025-09-25T15:26:49.652Z"
    }
]
```

---

### File: `frontend/src/features/auth/auth.context.jsx`

**Purpose & Role:** Source component handling auth logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within auth scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api.services.js";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getMe();
        setUser(response.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### File: `frontend/src/features/auth/auth.form.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
@import "tailwindcss";


.form-container {
  @apply bg-black text-white p-4 rounded-md shadow-md;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 100%;

  h1 {
    @apply text-center mb-4;
  }

  form {
    @apply flex flex-col gap-1;

    .input-group {
      @apply flex flex-col gap-0.5;

      label {
        @apply font-bold;
      }

      input {
        @apply p-2 rounded-md border border-gray-300;
      }
    }
  }
}


main {
  @apply flex justify-center items-center h-screen;
}

a{
  @apply text-blue-500;
  text-decoration: none;
  cursor: pointer;
}

a:hover{
  @apply text-blue-600;
  text-decoration: underline;
}

p{
  @apply text-center mt-4;
}
```

---

### File: `frontend/src/features/auth/components/Protected.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

export const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default Protected;
```

---

### File: `frontend/src/features/auth/hooks/useAuth.js`

**Purpose & Role:** Source component handling hooks logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within hooks scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register ,logout} from "../services/auth.api.services.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const {user,loading,setUser,setLoading}=context;
  
  const handleLogin=async(email,password)=>{
     setLoading(true);
     try{
         const response=await login(email,password);
         setUser(response.user);
     }catch(error){
         console.log(error);
         throw error;
     }finally{
         setLoading(false);
     }
  }

  const handleRegister = async(username,email,password)=>{
     setLoading(true);
     try{
         const response=await register(username,email,password);
         setUser(response.user);
     }catch(error){
         console.log(error);
         throw error;
     }finally{
         setLoading(false);
     }
  }

  const handleLogout=async()=>{
     setLoading(true);
     try{
         await logout();
         setUser(null);
     }catch(error){
         console.log(error);
         throw error;
     } finally {
         setLoading(false);
     }
  }

  return {
     handleLogin,
     handleRegister,
     handleLogout,
     setLoading,
     setUser,
     user,
     loading
  }
};
```

---

### File: `frontend/src/features/auth/pages/Dashboard.jsx`

**Purpose & Role:** Interactive analytics dashboard for resume performance & scores.

**Key Concepts & Design Highlights:**
- Visual data charts rendering ATS metrics
- Optimistic UI updates for quick user responsiveness
- Responsive grid layout with modern glassmorphism aesthetic

```jsx
import React from "react";

const Dashboard = () => {
  return <div>Dashboard</div>;
};

export default Dashboard;
```

---

### File: `frontend/src/features/auth/pages/Layout.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";

const Layout = () => {
  return <div>Layout</div>;
};

export default Layout;
```

---

### File: `frontend/src/features/auth/pages/Login.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import "../auth.form.css";
import "../../../style/button.css";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      navigate("/");
    } catch (err) {
      console.log("Login failed", err);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="form-container">
        <h1 className="form-title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit} className="btn-primary" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
```

---

### File: `frontend/src/features/auth/pages/Preview.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";

const Preview = () => {
  return <div>Preview</div>;
};

export default Preview;
```

---

### File: `frontend/src/features/auth/pages/Register.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import "../auth.form.css";
import "../../../style/button.css";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      navigate("/");
    } catch (err) {
      console.log("Registration failed", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="form-container">
        <h1 className="form-title">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit} className="btn-primary" type="submit">
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
```

---

### File: `frontend/src/features/auth/pages/ResumeBuilder.jsx`

**Purpose & Role:** Multi-step interactive resume builder with real-time live preview.

**Key Concepts & Design Highlights:**
- Controlled form input state management
- Debounced live preview synchronization
- PDF export triggers and validation checks

```jsx
import React from "react";

const ResumeBuilder = () => {
  return <div>ResumeBuilder</div>;
};

export default ResumeBuilder;
```

---

### File: `frontend/src/features/interview/interview.context.jsx`

**Purpose & Role:** Source component handling interview logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within interview scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import { createContext, useState } from "react";

const InterviewContext = createContext();
export default InterviewContext;

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState([]);

  const [reports, setReports] = useState([]);
  return (
    <InterviewContext.Provider
      value={{ loading, setLoading, report, setReport, reports, setReports }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
```

---

### File: `frontend/src/features/interview/hooks/useInterview.js`

**Purpose & Role:** Source component handling hooks logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .js modular architectural patterns
- Encapsulates domain-specific behavior within hooks scope
- Provides maintainable, decoupled functionality for upstream consumers

```javascript
import { useState, useContext } from "react";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports, getResumePdf as apiGetResumePdf } from "../services/interview.api";
import InterviewContext from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    
    if(!context){
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    // Fetch an interview report by its ID
    const getReportById = async (id) => {
        setLoading(true);
        try {
            const data = await getInterviewReportById(id);
            setReport(data);
        }
        catch (err) {
            console.error("Failed to get report by ID:", err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };

    // Generate a new interview report and set the state
    const generateReport = async ({ jobDescription, resumeFile, selfDescription }) => {
        setLoading(true);
      
        try {
            // Map resumeFile into the resume property the API expects
            const data = await generateInterviewReport({
                jobDescription, 
                resume: resumeFile, 
                selfDescription
            });
            
            if (data && data.interviewReport) {
                setReport(data.interviewReport);
                return data.interviewReport;
            }
        } catch (err) {
            console.error("Failed to generate report:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {
       setLoading(true);
       try {
           const data = await getAllInterviewReports();
           setReports(data);
       }
       catch (err) {
           console.error("Failed to get reports:", err);
           throw err;
       }
       finally {
           setLoading(false);
       }
    };

    const getResumePdf = async (id) => {
        try {
            const blob = await apiGetResumePdf(id);
            
            // Create a temporary link element and trigger a download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${id}.pdf`);
            
            // Append to body, click, and clean up
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (err) {
            console.error("Failed to download resume:", err);
        }
    };

    return {
        report,
        reports,
        loading,
        getReportById,
        generateReport,
        getReports,
        getResumePdf
    };
};
```

---

### File: `frontend/src/features/interview/pages/AnalyzePage.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState, useRef } from "react";
import "../../../style/Home.css";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

// This page holds the Resume Analyzer feature:
// User uploads a PDF (or writes a self description) + job description → AI generates interview plan
const AnalyzePage = () => {
  const { loading, generateReport, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setErrorMsg(""); // clear error on new file
    }
  };

  const handleGenerateReport = async () => {
    try {
      setErrorMsg("");
      const selectedFile = resumeInputRef.current?.files[0];

      if (!selectedFile && !selfDescription.trim()) {
        setErrorMsg(
          "Please either upload a resume OR provide a self description!",
        );
        return;
      }

      if (!jobDescription.trim()) {
        setErrorMsg("Please provide a Target Job Description!");
        return;
      }

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: selectedFile,
      });

      navigate(`/interview/${data._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate report.",
      );
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your interview strategy...</h1>
      </main>
    );
  }

  return (
    <div className="home">
      {/* HERO */}
      <header className="hero">
        {/* Back button to go back to landing */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#94a3b8",
            padding: "8px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "13px",
            marginBottom: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.14)")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.08)")
          }
        >
          ← Back to Home
        </button>

        <h1>
          Resume <span>Analyzer</span>
        </h1>
        <p>
          Upload your resume and paste the job description. Our AI generates
          interview questions, skill gap analysis, and a study roadmap
          instantly.
        </p>

        {errorMsg && (
          <div
            style={{
              background: "rgba(239,68,68,0.2)",
              color: "#fca5a5",
              padding: "10px 20px",
              borderRadius: "8px",
              marginTop: "20px",
              border: "1px solid rgba(239,68,68,0.4)",
              display: "inline-block",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}
      </header>

      {/* MAIN CARD */}
      <div className="card">
        {/* LEFT */}
        <div className="panel">
          <h2>Target Job Description</h2>
          <textarea
            placeholder="Paste job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            maxLength={5000}
          />
          <div className="char">{jobDescription.length} / 5000</div>
        </div>

        {/* RIGHT */}
        <div className="panel">
          <h2>Your Profile</h2>

          {/* UPLOAD */}
          <label className="upload">
            <input
              type="file"
              hidden
              ref={resumeInputRef}
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            <div className={`upload-box ${resumeFile ? "has-file" : ""}`}>
              {resumeFile ? (
                <>
                  <p className="file-name">{resumeFile.name}</p>
                  <span>Click to change file</span>
                </>
              ) : (
                <>
                  <p>Upload Resume</p>
                  <span>PDF or DOCX (Max 5MB)</span>
                </>
              )}
            </div>
          </label>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* SELF DESCRIPTION */}
          <textarea
            placeholder="Write a short self description..."
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="generate-wrapper">
        <button className="generate-btn" onClick={handleGenerateReport}>
          Generate Interview Plan
        </button>
      </div>

      {/* RECENT REPORTS */}
      {reports.length > 0 && (
        <section className="reports">
          <h2>Recent Reports</h2>
          <div className="report-grid">
            {reports.map((report) => (
              <div
                key={report._id}
                className="report"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Role"}</h3>
                <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                <span
                  className={`score ${
                    report.matchScore >= 80
                      ? "high"
                      : report.matchScore >= 60
                        ? "mid"
                        : "low"
                  }`}
                >
                  {report.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Help</a>
      </footer>
    </div>
  );
};

export default AnalyzePage;
```

---

### File: `frontend/src/features/interview/pages/Home.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/interview/pages/interview.jsx`

**Purpose & Role:** Source component handling pages logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within pages scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState, useEffect } from "react";
import "../../../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <span
          className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">
              Intention
            </span>
            <p>{item.intention}</p>
          </div>
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">
              Model Answer
            </span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>
    <ul className="roadmap-day__tasks">
      {day.tasks.map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
        ? "score--mid"
        : "score--low";

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* ── Left Nav ── */}
        <nav className="interview-nav">
          <div className="nav-content">
            <p className="interview-nav__label">Sections</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="button primary-button"
          >
            <svg
              height={"0.8rem"}
              style={{ marginRight: "0.8rem" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
            </svg>
            Download Resume
          </button>
        </nav>

        <div className="interview-divider" />

        {/* ── Center Content ── */}
        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span className="content-header__count">
                  {report.technicalQuestions.length} questions
                </span>
              </div>
              <div className="q-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>
                <span className="content-header__count">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>
              <div className="q-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span className="content-header__count">
                  {report.preparationPlan.length}-day plan
                </span>
              </div>
              <div className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider" />

        {/* ── Right Sidebar ── */}
        <aside className="interview-sidebar">
          {/* Match Score */}
          <div className="match-score">
            <p className="match-score__label">Match Score</p>
            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">{report.matchScore}</span>
              <span className="match-score__pct">%</span>
            </div>
            <p className="match-score__sub">Strong match for this role</p>
          </div>

          <div className="sidebar-divider" />

          {/* Skill Gaps */}
          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>
            <div className="skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
```

---

### File: `frontend/src/features/resume/components/ColorPicker.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  { hex: "#2563eb", name: "Blue" },
  { hex: "#16a34a", name: "Green" },
  { hex: "#db2777", name: "Pink" },
  { hex: "#9333ea", name: "Purple" },
  { hex: "#ea580c", name: "Orange" },
  { hex: "#dc2626", name: "Red" },
  { hex: "#475569", name: "Slate" },
  { hex: "#0ea5e9", name: "Sky" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#ca8a04", name: "Gold" },
  { hex: "#111827", name: "Graphite" },
  { hex: "#7c3aed", name: "Violet" },
];

const FONT_OPTIONS = [
  { value: "'Inter', sans-serif", label: "Inter", preview: "Aa" },
  { value: "'Roboto', sans-serif", label: "Roboto", preview: "Aa" },
  { value: "Georgia, serif", label: "Georgia", preview: "Aa" },
  { value: "'Playfair Display', serif", label: "Playfair", preview: "Aa" },
];

const ColorPicker = ({
  selectedColor,
  onChange,
  selectedFont,
  onFontChange,
  selectedAlignment = "left",
  onAlignmentChange,
  selectedSpacing = "medium",
  onSpacingChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Color row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#64748b",
            marginRight: "2px",
          }}
        >
          Color:
        </span>
        {PRESET_COLORS.map(({ hex }) => (
          <button
            key={hex}
            onClick={() => onChange(hex)}
            title={hex}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: hex,
              border:
                selectedColor === hex
                  ? "2px solid #1e293b"
                  : "2px solid transparent",
              boxShadow:
                selectedColor === hex ? "0 0 0 2px white inset" : "none",
              cursor: "pointer",
              transition: "transform 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {selectedColor === hex && <Check size={10} color="white" />}
          </button>
        ))}
        {/* Custom color input */}
        <div
          style={{
            position: "relative",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              inset: "-6px",
              width: "36px",
              height: "36px",
              cursor: "pointer",
            }}
            title="Custom color"
          />
        </div>
      </div>

      {/* Font row */}
      {onFontChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Font:
          </span>
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFontChange(f.value)}
              title={f.label}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontFamily: f.value,
                fontWeight: "600",
                border:
                  selectedFont === f.value
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedFont === f.value ? "#eff6ff" : "white",
                color: selectedFont === f.value ? "#2563eb" : "#4b5563",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Alignment row */}
      {onAlignmentChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Align:
          </span>
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => onAlignmentChange(align)}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "capitalize",
                border:
                  selectedAlignment === align
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedAlignment === align ? "#eff6ff" : "white",
                color: selectedAlignment === align ? "#2563eb" : "#4b5563",
                cursor: "pointer",
              }}
            >
              {align}
            </button>
          ))}
        </div>
      )}

      {/* Spacing row */}
      {onSpacingChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Spacing:
          </span>
          {["small", "medium", "large"].map((spacing) => (
            <button
              key={spacing}
              onClick={() => onSpacingChange(spacing)}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "capitalize",
                border:
                  selectedSpacing === spacing
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedSpacing === spacing ? "#eff6ff" : "white",
                color: selectedSpacing === spacing ? "#2563eb" : "#4b5563",
                cursor: "pointer",
              }}
            >
              {spacing}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
```

---

### File: `frontend/src/features/resume/components/CustomSectionForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check } from "lucide-react";

const SUGGESTED_TITLES = [
  "Internships",
  "Projects",
  "Awards",
  "Certifications",
  "Languages",
  "Publications",
];

const CustomSectionForm = ({ sections, onChange }) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingTitleId, setEditingTitleId] = useState(null);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      items: [],
    };
    onChange([...sections, newSection]);
    setNewSectionTitle("");
  };

  const handleRemoveSection = (sectionId) => {
    onChange(sections.filter((s) => s.id !== sectionId));
  };

  const handleTitleChange = (sectionId, newTitle) => {
    onChange(
      sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s)),
    );
  };

  const handleAddItem = (sectionId) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items: [
              ...s.items,
              {
                title: "",
                subtitle: "",
                dates: "",
                description: "",
                link: "",
                imageUrl: "",
              },
            ],
          };
        }
        return s;
      }),
    );
  };

  const handleRemoveItem = (sectionId, itemIndex) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          const newItems = [...s.items];
          newItems.splice(itemIndex, 1);
          return { ...s, items: newItems };
        }
        return s;
      }),
    );
  };

  const handleItemChange = (sectionId, itemIndex, field, value) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          const newItems = [...s.items];
          newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
          return { ...s, items: newItems };
        }
        return s;
      }),
    );
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Custom Sections</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add any sections missing from your resume (Internships, Awards,
          Projects, etc).
        </p>
      </div>

      {/* Suggested & Add Section Header */}
      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TITLES.map((title) => (
            <button
              key={title}
              onClick={() => setNewSectionTitle(title)}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              + {title}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g. Internships"
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          />
          <button
            onClick={handleAddSection}
            disabled={!newSectionTitle.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <Plus size={16} className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Render Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Section Header */}
          <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-2">
              {editingTitleId === section.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleTitleChange(section.id, e.target.value)
                    }
                    className="px-2 py-1 text-sm font-bold bg-white border border-gray-300 rounded focus:outline-none"
                    autoFocus
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setEditingTitleId(null)
                    }
                  />
                  <button
                    onClick={() => setEditingTitleId(null)}
                    className="text-green-600 p-1"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <button
                    onClick={() => setEditingTitleId(section.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => handleRemoveSection(section.id)}
              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors"
              title="Delete Entire Section"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Items */}
          <div className="p-4 space-y-4 bg-white">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-3 relative"
              >
                <button
                  onClick={() => handleRemoveItem(section.id, idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title (e.g. Project Name)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "title",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subtitle / Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "subtitle",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dates (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.dates}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "dates",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Link URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "link",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.imageUrl}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "imageUrl",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://image..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(
                        section.id,
                        idx,
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Describe your achievements..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => handleAddItem(section.id)}
              className="w-full py-2 bg-gray-50 border border-dashed border-gray-300 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors flex justify-center items-center"
            >
              <Plus size={16} className="mr-1" /> Add entry to {section.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomSectionForm;
```

---

### File: `frontend/src/features/resume/components/EducationForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Plus, Trash2 } from "lucide-react";

const EducationForm = ({ educationList, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...educationList,
      { institution: "", degree: "", fieldOfStudy: "", dates: "" },
    ]);
  };

  const handleRemove = (index) => {
    const newList = [...educationList];
    newList.splice(index, 1);
    onChange(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...educationList];
    newList[index] = { ...newList[index], [field]: value };
    onChange(newList);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <button
          onClick={handleAdd}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg outline-none hover:bg-blue-100 transition-colors font-medium border border-blue-200"
        >
          <Plus size={16} className="mr-1" /> Add Education
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-700">
              Education {index + 1}
            </h3>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="University of California"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  handleChange(index, "fieldOfStudy", e.target.value)
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Computer Science"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates
              </label>
              <input
                type="text"
                value={edu.dates}
                onChange={(e) => handleChange(index, "dates", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="2018 - 2022"
              />
            </div>
          </div>
        </div>
      ))}

      {educationList.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No education added yet.
        </div>
      )}
    </div>
  );
};

export default EducationForm;
```

---

### File: `frontend/src/features/resume/components/ExperienceForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState } from "react";
import { enhanceExperience } from "../services/resume.api";
import { Sparkles, Loader2, Plus, Trash2 } from "lucide-react";

const ExperienceForm = ({ experienceList, onChange }) => {
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const handleAdd = () => {
    onChange([
      ...experienceList,
      { company: "", role: "", dates: "", description: "" },
    ]);
  };

  const handleRemove = (index) => {
    const newList = [...experienceList];
    newList.splice(index, 1);
    onChange(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...experienceList];
    newList[index] = { ...newList[index], [field]: value };
    onChange(newList);
  };

  const handleEnhance = async (index) => {
    const exp = experienceList[index];
    if (!exp.description || !exp.role || !exp.company) return;

    setEnhancingIndex(index);
    try {
      const improvedText = await enhanceExperience(
        exp.description,
        exp.role,
        exp.company,
      );
      handleChange(index, "description", improvedText);
    } catch (error) {
      console.error("Failed to enhance experience", error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg outline-none hover:bg-blue-100 transition-colors font-medium border border-blue-200"
        >
          <Plus size={16} className="mr-1" /> Add Experience
        </button>
      </div>

      {experienceList.map((exp, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-700">
              Experience {index + 1}
            </h3>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Software Engineer"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates (Duration)
              </label>
              <input
                type="text"
                value={exp.dates}
                onChange={(e) => handleChange(index, "dates", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Jan 2020 - Present"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <button
                onClick={() => handleEnhance(index)}
                disabled={
                  enhancingIndex === index ||
                  !exp.description ||
                  !exp.role ||
                  !exp.company
                }
                className="flex items-center text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {enhancingIndex === index ? (
                  <Loader2 className="animate-spin mr-1" size={14} />
                ) : (
                  <Sparkles className="mr-1" size={14} />
                )}
                {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Write a rough draft of your responsibilities, then use AI to
              create bullet points.
            </p>
            <textarea
              rows="4"
              value={exp.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
              placeholder="I built scalable microservices and led a team of 3 developers..."
            />
          </div>
        </div>
      ))}

      {experienceList.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No experience added yet.
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
```

---

### File: `frontend/src/features/resume/components/PersonalInfoForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState } from "react";
import { uploadProfileImage } from "../services/resume.api";
import { Loader2, UploadCloud } from "lucide-react";

const PersonalInfoForm = ({ data, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);

  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file, removeBg);
      if (result.success) {
        onChange({ ...data, imageUrl: result.url });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={data.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="+1 234 567 890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="text"
            name="linkedIn"
            value={data.linkedIn || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Profile
          </label>
          <input
            type="text"
            name="github"
            value={data.github || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="github.com/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio / Website
          </label>
          <input
            type="text"
            name="portfolio"
            value={data.portfolio || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div className="mt-6 border-t pt-6 border-gray-100">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <UploadCloud size={24} />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="removeBg"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="removeBg" className="text-sm text-gray-600">
                Remove Background (AI)
              </label>
            </div>
            {isUploading && (
              <p className="text-sm text-blue-600 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} /> Uploading
                image...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
```

---

### File: `frontend/src/features/resume/components/ProfessionalSummaryForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState } from "react";
import { enhanceSummary } from "../services/resume.api";
import { Sparkles, Loader2 } from "lucide-react";

const ProfessionalSummaryForm = ({ summary, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!summary || summary.trim().length < 10) return;

    setIsEnhancing(true);
    try {
      const improvedText = await enhanceSummary(summary);
      onChange(improvedText);
    } catch (error) {
      console.error("Failed to enhance summary", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Professional Summary
        </h2>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !summary}
          className="flex items-center text-sm px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {isEnhancing ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : (
            <Sparkles className="mr-2" size={16} />
          )}
          {isEnhancing ? "Enhancing..." : "Enhance with AI"}
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Write a short draft of your professional summary, then click the AI
        button to polish it.
      </p>

      <textarea
        rows="5"
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
        placeholder="E.g., I am a software engineer with 5 years experience in building web apps..."
      />
    </div>
  );
};

export default ProfessionalSummaryForm;
```

---

### File: `frontend/src/features/resume/components/ResumePreview.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useRef, useState, useEffect } from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CorporateTemplate from "./templates/CorporateTemplate";
import SimpleTemplate from "./templates/SimpleTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import { Download, Share2, Check } from "lucide-react";
import html2pdf from "html2pdf.js";

/**
 * ResumePreview — receives template as a prop from ResumeBuilder (parent controls it)
 */
const ResumePreviewWrapper = ({ data, template }) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const printRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scale the A4 resume to fit the preview panel width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // The preview container width
        const containerWidth = containerRef.current.offsetWidth;
        // A4 width in pixels (794px) plus some padding to look nice
        const targetWidth = 794 + 64;

        if (containerWidth < targetWidth) {
          setScale(containerWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleDownloadPdf = () => {
    const element =
      document.getElementById("hidden-resume-pdf-content") ||
      document.getElementById("resume-pdf-content");
    const opt = {
      margin: 0,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/view/${data.userId || "shared"}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "executive":
        return <ExecutiveTemplate data={data} />;
      case "professional":
        return <ProfessionalTemplate data={data} />;
      case "corporate":
        return <CorporateTemplate data={data} />;
      case "simple":
        return <SimpleTemplate data={data} />;
      case "elegant":
        return <ElegantTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative print:overflow-visible">
      {/* Top bar */}
      <div className="bg-white border text-black border-gray-200 rounded-xl p-4 mb-4 flex justify-between items-center shadow-sm shrink-0 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            Live Preview
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            ● Live
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-green-600 mr-2" />
            ) : (
              <Share2 size={16} className="text-blue-500 mr-2" />
            )}
            {copied ? "Copied!" : "Share Link"}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* A4 Resume paper container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto custom-scrollbar flex justify-center items-start pt-4 bg-gray-100/50 rounded-lg print:bg-transparent print:pt-0 print:overflow-visible"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            height: scale < 1 ? 1123 * scale : "auto",
            marginBottom: scale < 1 ? 40 : 40, // Add bottom padding for scroll
          }}
          className="transition-transform duration-200 ease-out print:transform-none! print:h-auto! print:m-0! print:w-full!"
        >
          <div
            id="resume-pdf-content"
            ref={printRef}
            className="bg-white shadow-xl shrink-0 overflow-hidden print:shadow-none print:w-full"
            style={{
              width: "794px",
              minHeight: "1123px",
              fontFamily: data.fontFamily || undefined,
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Hidden Unscaled Copy strictly for PDF generator */}
      <div
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        className="print:hidden"
      >
        <div
          id="hidden-resume-pdf-content"
          className="bg-white shrink-0 overflow-hidden"
          style={{
            width: "794px",
            minHeight: "1123px",
            fontFamily: data.fontFamily || undefined,
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewWrapper;
```

---

### File: `frontend/src/features/resume/components/SkillsForm.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const SkillsForm = ({ skills, onChange }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      onChange([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>

      <form onSubmit={handleAddSkill} className="flex space-x-2">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a skill (e.g. React.js)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
        <button
          type="submit"
          disabled={!skillInput.trim()}
          className="flex items-center text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          <Plus size={16} className="mr-1" /> Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-sm font-medium"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 text-blue-400 hover:text-blue-800 transition-colors outline-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
```

---

### File: `frontend/src/features/resume/components/TemplatePicker.jsx`

**Purpose & Role:** Source component handling components logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within components scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";

/**
 * TemplatePicker — visual card grid for choosing a template
 */

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Sleek two-column with colored header",
    emoji: "🎯",
    color: "#2563eb",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout",
    emoji: "📄",
    color: "#16a34a",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean typographic black & white",
    emoji: "⬜",
    color: "#111827",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant sidebar with bold color",
    emoji: "🎨",
    color: "#7c3aed",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional two-column layout",
    emoji: "💼",
    color: "#0f172a",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Structured single-column standard",
    emoji: "📝",
    color: "#0284c7",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Name left, details right layout",
    emoji: "🏢",
    color: "#334155",
  },
  {
    id: "simple",
    name: "Simple",
    description: "Clean minimalist typography",
    emoji: "🧾",
    color: "#1f2937",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Centered headers, sophisticated",
    emoji: "🏛️",
    color: "#9f1239",
  },
];

const TemplatePicker = ({ selectedTemplate, onChange }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f1f5f9",
      }}
    >
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "6px",
        }}
      >
        🖼️ Choose Template
      </h2>
      <p
        style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "16px" }}
      >
        Pick a layout — preview updates live on the right.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              style={{
                border: isSelected
                  ? `2px solid ${tpl.color}`
                  : "2px solid #e2e8f0",
                borderRadius: "12px",
                padding: "14px 12px",
                background: isSelected ? tpl.color + "10" : "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
                outline: "none",
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: tpl.color,
                    color: "white",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  ✓
                </span>
              )}
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                {tpl.emoji}
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  color: isSelected ? tpl.color : "#1e293b",
                  marginBottom: "3px",
                }}
              >
                {tpl.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  lineHeight: "1.4",
                }}
              >
                {tpl.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
```

---

### File: `frontend/src/features/resume/components/templates/ClassicTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

// Helper to ensure URLs are valid
const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const cleanUrlText = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

const ClassicTemplate = ({ data }) => {
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

  const fontStyle = { fontFamily: fontFamily || "Georgia, serif" };

  const getAlignmentStyle = (align) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const getSpacingClass = (space) => {
    if (space === "small") return "space-y-3";
    if (space === "large") return "space-y-7";
    return "space-y-5"; // medium default
  };

  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* Header */}
      <header
        className={`mb-6 text-center ${alignment === "left" ? "!text-left" : alignment === "right" ? "!text-right" : ""}`}
      >
        <h1 className="text-4xl font-bold uppercase tracking-widest text-black mb-3">
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          className={`flex items-center flex-wrap gap-4 text-sm text-gray-700 ${alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start"}`}
        >
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Mail size={14} className="mr-1" /> {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone size={14} className="mr-1" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <a
              href={formatUrl(personalInfo.linkedIn)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Linkedin size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.linkedIn)}
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={formatUrl(personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Github size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.github)}
            </a>
          )}
          {personalInfo?.portfolio && (
            <a
              href={formatUrl(personalInfo.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:underline hover:text-blue-600 transition-colors"
            >
              <Globe size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.portfolio)}
            </a>
          )}
        </div>
      </header>

      <div className="border-b border-black mb-6"></div>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-black">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {professionalSummary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px] text-black">
                    {exp.role}
                  </h3>
                  <span className="text-[13px] font-medium text-gray-700">
                    {exp.dates}
                  </span>
                </div>
                <div className="text-[14px] italic text-gray-800 mb-2">
                  {exp.company}
                </div>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 text-[13.5px] text-gray-800 space-y-1.5 leading-relaxed">
                    {exp.description.split("\n").map((point, i) => {
                      const cleanPoint = point.replace(/^[-*]\s*/, "").trim();
                      return cleanPoint ? (
                        <li key={i} className="pl-1">
                          {cleanPoint}
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className={getSectionMargin()}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-black">
                    {edu.institution}
                  </h3>
                  <div className="text-[14px] text-gray-800">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[13px] font-medium text-gray-700">
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
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-gray-300 pb-1">
              {section.title}
            </h2>
            <div className={itemSpacing}>
              {section.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  {item.imageUrl && (
                    <div className="shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded shadow-sm border"
                      />
                    </div>
                  )}
                  <div className="grow">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[15px] text-black flex items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] text-gray-500 hover:text-black hover:underline transition-colors tracking-normal flex items-center"
                          >
                            <Globe size={11} className="mr-0.5 opacity-70" />{" "}
                            {cleanUrlText(item.link)}
                          </a>
                        )}
                      </h3>
                      <span className="text-[13px] font-medium text-gray-700">
                        {item.dates}
                      </span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14px] italic text-gray-800 mb-2">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[13.5px] text-gray-800 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
                      >
                        {item.description.split("\n").map((point, i) => {
                          const cleanPoint = point
                            .replace(/^[-*]\s*/, "")
                            .trim();
                          return cleanPoint ? (
                            <li key={i} className="pl-1">
                              {cleanPoint}
                            </li>
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
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-black border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="text-[14px] text-gray-800 leading-relaxed font-medium">
            {skills.join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
```

---

### File: `frontend/src/features/resume/components/templates/CorporateTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

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

const CorporateTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    fontFamily,
    themeColor,
    alignment = "left",
    spacing = "medium",
  } = data;

  const fontStyle = { fontFamily: fontFamily || "Times New Roman, serif" };
  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* corporate header: name on left, details on right if left aligned */}
      <header
        className={`flex ${alignment === "left" ? "justify-between" : alignment === "center" ? "flex-col items-center" : "flex-row-reverse justify-between"} items-center border-b-2 pb-4 ${getSectionMargin()}`}
        style={{ borderColor: themeColor }}
      >
        <h1
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
          style={{ color: themeColor }}
        >
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          className={`flex flex-col text-sm text-gray-700 font-medium ${alignment === "left" ? "items-end" : alignment === "center" ? "items-center mt-3" : "items-start"}`}
        >
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.linkedIn && (
            <span>{cleanUrlText(personalInfo.linkedIn)}</span>
          )}
          {personalInfo?.github && (
            <span>{cleanUrlText(personalInfo.github)}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <p className="text-[14.5px] leading-relaxed text-gray-800 italic">
            "{professionalSummary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Experience
          </h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {exp.role}
                  </h3>
                  <span className="text-[13px] text-gray-600">{exp.dates}</span>
                </div>
                <div className="text-[14px] text-gray-800 font-semibold mb-2">
                  {exp.company}
                </div>
                {exp.description && (
                  <ul
                    className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
          <h2
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Education
          </h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {edu.institution}
                  </h3>
                  <div className="text-[14px] text-gray-800">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[13px] text-gray-600">{edu.dates}</span>
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
              className="text-md font-bold uppercase tracking-widest text-gray-900 mb-4 pb-1 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
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
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] text-blue-600 hover:underline"
                          >
                            [Link]
                          </a>
                        )}
                      </h3>
                      <span className="text-[13px] text-gray-600">
                        {item.dates}
                      </span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14px] text-gray-800 font-semibold mb-2">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
            className="text-md font-bold uppercase tracking-widest text-gray-900 mb-3 pb-1 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            Skills
          </h2>
          <p className="text-[14px] text-gray-800 font-medium leading-relaxed">
            {skills.join(", ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default CorporateTemplate;
```

---

### File: `frontend/src/features/resume/components/templates/CreativeTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/resume/components/templates/ElegantTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/resume/components/templates/ExecutiveTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/resume/components/templates/MinimalTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/resume/components/templates/ModernTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

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
        className="px-10 py-8 text-white flex flex-col md:flex-row md:items-center md:justify-between"
        style={{ backgroundColor: themeColor || "#2563EB" }}
      >
        <div className="flex items-center space-x-6">
          {personalInfo?.imageUrl && (
            <img
              src={personalInfo.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-sm"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {personalInfo?.name || "Your Name"}
            </h1>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col space-y-2 text-sm text-white/90 text-right">
          {personalInfo?.email && (
            <span className="flex items-center justify-end">
              {personalInfo.email} <Mail size={14} className="ml-2" />
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center justify-end">
              {personalInfo.phone} <Phone size={14} className="ml-2" />
            </span>
          )}
          {personalInfo?.linkedIn && (
            <span className="flex items-center justify-end">
              {personalInfo.linkedIn} <Linkedin size={14} className="ml-2" />
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center justify-end">
              {personalInfo.github} <Github size={14} className="ml-2" />
            </span>
          )}
          {personalInfo?.portfolio && (
            <span className="flex items-center justify-end">
              {personalInfo.portfolio} <Globe size={14} className="ml-2" />
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
                {professionalSummary}
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
                              {cleanPoint}
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
                                {cleanPoint}
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
```

---

### File: `frontend/src/features/resume/components/templates/ProfessionalTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
import React from "react";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

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

const ProfessionalTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
    fontFamily,
    themeColor,
    alignment = "left",
    spacing = "medium",
  } = data;

  const fontStyle = { fontFamily: fontFamily || "Arial, sans-serif" };
  const getSectionMargin = () =>
    spacing === "small" ? "mb-4" : spacing === "large" ? "mb-8" : "mb-6";
  const itemSpacing = getSpacingClass(spacing);

  return (
    <div
      className={`bg-white w-full h-full p-12 text-gray-900 flex flex-col ${getAlignmentStyle(alignment)}`}
      style={fontStyle}
    >
      {/* Header */}
      <header className={getSectionMargin()}>
        <h1
          className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2"
          style={{ color: themeColor }}
        >
          {personalInfo?.name || "Your Name"}
        </h1>
        <div
          className={`flex flex-wrap gap-4 text-sm text-gray-600 font-medium ${alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start"}`}
        >
          {personalInfo?.email && (
            <span className="flex items-center">
              <Mail size={14} className="mr-1" /> {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone size={14} className="mr-1" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <span className="flex items-center">
              <Linkedin size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.linkedIn)}
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center">
              <Github size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.github)}
            </span>
          )}
          {personalInfo?.portfolio && (
            <span className="flex items-center">
              <Globe size={14} className="mr-1" />{" "}
              {cleanUrlText(personalInfo.portfolio)}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {professionalSummary && (
        <section className={getSectionMargin()}>
          <h2
            className="text-lg font-bold uppercase tracking-wider mb-2 border-b-2"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {professionalSummary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className={getSectionMargin()}>
          <h2
            className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            Experience
          </h2>
          <div className={itemSpacing}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {exp.role}
                  </h3>
                  <span className="text-[13px] font-semibold text-gray-600">
                    {exp.dates}
                  </span>
                </div>
                <div className="text-[14px] text-gray-800 font-medium mb-1.5">
                  {exp.company}
                </div>
                {exp.description && (
                  <ul
                    className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
          <h2
            className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            Education
          </h2>
          <div className={itemSpacing}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[15px] text-gray-900">
                    {edu.institution}
                  </h3>
                  <div className="text-[14px] text-gray-800">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
                <span className="text-[13px] font-semibold text-gray-600">
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
              className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
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
                        className="w-16 h-16 object-cover rounded shadow-sm border"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[15px] text-gray-900 flex flex-wrap items-center gap-2">
                        {item.title}
                        {item.link && (
                          <a
                            href={formatUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-normal text-[12px] text-blue-600 hover:underline flex items-center"
                          >
                            <Globe size={11} className="mr-0.5" /> Link
                          </a>
                        )}
                      </h3>
                      <span className="text-[13px] font-semibold text-gray-600">
                        {item.dates}
                      </span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[14px] text-gray-800 font-medium mb-1.5">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <ul
                        className={`list-disc list-outside ml-4 text-[13.5px] text-gray-700 leading-relaxed ${alignment === "center" ? "list-inside ml-0" : ""}`}
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
            className="text-lg font-bold uppercase tracking-wider mb-2 border-b-2"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            Skills
          </h2>
          <div className="text-[14px] text-gray-800 font-medium flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 px-2 py-1 rounded text-gray-900"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
```

---

### File: `frontend/src/features/resume/components/templates/SimpleTemplate.jsx`

**Purpose & Role:** Source component handling templates logic in the system.

**Key Concepts & Design Highlights:**
- Implements standard .jsx modular architectural patterns
- Encapsulates domain-specific behavior within templates scope
- Provides maintainable, decoupled functionality for upstream consumers

```jsx
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
```

---

### File: `frontend/src/features/resume/pages/ResumeBuilder.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
/* =============================================
   ResumeBuilder.css
   Styles for the Resume Builder page
   ============================================= */

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;700&display=swap");

/* ---- Page wrapper ---- */
.rb-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif;
}

/* ---- Header ---- */
.rb-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}

.rb-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.rb-back-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: background 0.15s, color 0.15s;
}
.rb-back-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.rb-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rb-brand-icon {
  font-size: 1.1rem;
  color: #7c3aed;
}
.rb-brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
}

.rb-header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.rb-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.rb-download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}
.rb-download-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ---- Main Two-Column ---- */
.rb-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 32px;
  box-sizing: border-box;
}

/* ---- Left column (scrollable) ---- */
.rb-left-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
.rb-left-col::-webkit-scrollbar {
  width: 6px;
}
.rb-left-col::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 99px;
}

.rb-left-intro {
  margin-bottom: 4px;
}
.rb-left-intro h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}
.rb-left-intro p {
  font-size: 0.9rem;
  color: #94a3b8;
}

.rb-bottom-spacer {
  height: 60px;
}

/* ---- Right column (sticky preview) ---- */
.rb-right-col {
  position: sticky;
  top: 80px;
  height: calc(100vh - 104px);
  overflow-y: auto;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

/* ---- Print styles — only show resume ---- */
@media print {
  .rb-header,
  .rb-left-col,
  .rb-back-btn,
  .rb-download-btn {
    display: none !important;
  }

  .rb-page,
  .rb-main,
  .rb-right-col {
    all: unset;
    display: block !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .print:hidden {
    display: none !important;
  }
}

/* ---- Responsive ---- */
@media (max-width: 1024px) {
  .rb-main {
    grid-template-columns: 1fr;
    padding: 20px 20px;
  }

  .rb-right-col {
    display: none;
  }

  .rb-left-col {
    max-height: none;
    overflow-y: visible;
  }

  .rb-header-center {
    display: none;
  }
}
```

---

### File: `frontend/src/features/resume/pages/ResumeBuilder.jsx`

**Purpose & Role:** Multi-step interactive resume builder with real-time live preview.

**Key Concepts & Design Highlights:**
- Controlled form input state management
- Debounced live preview synchronization
- PDF export triggers and validation checks

```jsx
import React, { useState } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import CustomSectionForm from "../components/CustomSectionForm";
import ResumePreview from "../components/ResumePreview";
import ColorPicker from "../components/ColorPicker";
import TemplatePicker from "../components/TemplatePicker";
import { Download, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import html2pdf from "html2pdf.js";
import "./ResumeBuilder.css";

const ResumeBuilder = () => {
  const navigate = useNavigate();

  // Master state for the resume
  const [resumeData, setResumeData] = useState({
    title: "My AI Resume",
    themeColor: "#2563eb",
    fontFamily: "'Inter', sans-serif",
    alignment: "left",
    spacing: "medium",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      imageUrl: "",
    },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  });

  // Template is controlled here (not in ResumePreview)
  const [template, setTemplate] = useState("modern");

  // Helpers to update slices
  const updatePersonalInfo = (data) =>
    setResumeData((prev) => ({ ...prev, personalInfo: data }));
  const updateSummary = (text) =>
    setResumeData((prev) => ({ ...prev, professionalSummary: text }));
  const updateExperience = (list) =>
    setResumeData((prev) => ({ ...prev, experience: list }));
  const updateEducation = (list) =>
    setResumeData((prev) => ({ ...prev, education: list }));
  const updateSkills = (list) =>
    setResumeData((prev) => ({ ...prev, skills: list }));
  const updateCustomSections = (list) =>
    setResumeData((prev) => ({ ...prev, customSections: list }));
  const updateThemeColor = (color) =>
    setResumeData((prev) => ({ ...prev, themeColor: color }));
  const updateFont = (font) =>
    setResumeData((prev) => ({ ...prev, fontFamily: font }));
  const updateAlignment = (align) =>
    setResumeData((prev) => ({ ...prev, alignment: align }));
  const updateSpacing = (space) =>
    setResumeData((prev) => ({ ...prev, spacing: space }));

  const handleDownload = () => {
    const element =
      document.getElementById("hidden-resume-pdf-content") ||
      document.getElementById("resume-pdf-content");
    if (!element) return;
    const opt = {
      margin: 0,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="rb-page">
      {/* ---- Sticky Top Navbar ---- */}
      <header className="rb-header">
        <div className="rb-header-left">
          <button className="rb-back-btn" onClick={() => navigate("/")}>
            <ChevronLeft size={18} />
          </button>
          <div className="rb-brand">
            <span className="rb-brand-icon">✦</span>
            <span className="rb-brand-name">Resume Builder</span>
          </div>
        </div>

        <div className="rb-header-center">
          <ColorPicker
            selectedColor={resumeData.themeColor}
            onChange={updateThemeColor}
            selectedFont={resumeData.fontFamily}
            onFontChange={updateFont}
            selectedAlignment={resumeData.alignment}
            onAlignmentChange={updateAlignment}
            selectedSpacing={resumeData.spacing}
            onSpacingChange={updateSpacing}
          />
        </div>

        <div className="rb-header-right">
          <button className="rb-download-btn" onClick={handleDownload}>
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </header>

      {/* ---- Main Two-Column Layout ---- */}
      <main className="rb-main">
        {/* Left: Form area (scrollable) */}
        <div className="rb-left-col">
          <div className="rb-left-intro">
            <h2>Let's build your resume</h2>
            <p>
              Fill in your details below. Use the ✨ AI buttons to enhance your
              content.
            </p>
          </div>

          {/* Template picker */}
          <TemplatePicker selectedTemplate={template} onChange={setTemplate} />

          {/* Form sections */}
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={updatePersonalInfo}
          />
          <ProfessionalSummaryForm
            summary={resumeData.professionalSummary}
            onChange={updateSummary}
          />
          <ExperienceForm
            experienceList={resumeData.experience}
            onChange={updateExperience}
          />
          <EducationForm
            educationList={resumeData.education}
            onChange={updateEducation}
          />
          <SkillsForm skills={resumeData.skills} onChange={updateSkills} />

          <CustomSectionForm
            sections={resumeData.customSections}
            onChange={updateCustomSections}
          />

          <div className="rb-bottom-spacer" />
        </div>

        {/* Right: Live preview (sticky) */}
        <div className="rb-right-col">
          <ResumePreview data={resumeData} template={template} />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
```

---

### File: `frontend/src/style/Home.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Outfit', Inter, system-ui, sans-serif;
}

body {
  background: #09090e;
  color: #fff;
  overflow-x: hidden;
}

/* BACKGROUND GLOWS */
.home {
  position: relative;
  min-height: 100vh;
  padding-bottom: 50px;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.15), transparent 25%);
}

/* HERO */
.hero {
  text-align: center;
  padding: 80px 20px 40px;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero h1 {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 15px;
  letter-spacing: -1px;
}

.hero span {
  background: linear-gradient(135deg, #6366f1, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.hero p {
  opacity: 0.85;
  max-width: 650px;
  margin: auto;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 300;
}

/* CARD - GLASSMORPHISM */
.card {
  margin: 20px auto 50px;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  animation: fadeInUp 1s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .card {
    grid-template-columns: 1fr;
    padding: 30px;
    gap: 30px;
  }
}

/* PANEL */
.panel {
  display: flex;
  flex-direction: column;
}

.panel h2 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #f1f5f9;
}

.panel textarea {
  width: 100%;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  resize: none;
  border-radius: 16px;
  padding: 18px;
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

.panel textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), inset 0 2px 4px rgba(0,0,0,0.2);
}

.panel textarea::placeholder {
  color: rgba(255,255,255,0.4);
}

/* CHARACTER COUNT */
.char {
  text-align: right;
  font-size: 13px;
  margin-top: -30px; /* Bring it inside textarea vertically */
  margin-right: 15px; 
  opacity: 0.6;
  font-weight: 500;
  pointer-events: none;
}

/* UPLOAD */
.upload {
  display: block;
  cursor: pointer;
  margin-top: 15px;
}

.upload-box {
  background: rgba(15, 23, 42, 0.4);
  padding: 35px 20px;
  border-radius: 16px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-box:hover {
  border-color: #ec4899;
  background: rgba(236, 72, 153, 0.05);
  transform: translateY(-2px);
}

.upload-box.has-file {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
  border-style: solid;
}

.upload-box p {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.upload-box .file-name {
  color: #22c55e;
  word-break: break-all;
}

.upload-box span {
  font-size: 13px;
  opacity: 0.6;
}

/* DIVIDER */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.divider span {
  background: rgba(15, 23, 42, 0.4);
  padding: 5px 15px;
  margin: 0 15px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* BUTTON */
.generate-wrapper {
  text-align: center;
  margin-top: 20px;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.generate-btn {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  border: none;
  padding: 16px 42px;
  font-size: 17px;
  border-radius: 50px;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255,255,255,0.2);
}

.generate-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 20px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}

.generate-btn:active {
  transform: translateY(1px);
}

/* REPORTS */
.reports {
  max-width: 1100px;
  margin: 80px auto 40px;
  padding: 0 20px;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.reports h2 {
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 700;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
}

.report {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.report::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.report:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  border-color: rgba(255,255,255,0.15);
}

.report:hover::before {
  opacity: 1;
}

.report h3 {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
}

.report p {
  font-size: 14px;
  opacity: 0.6;
  font-weight: 400;
}

/* SCORE */
.score {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.score.high {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.score.mid {
  background: rgba(234, 179, 8, 0.15);
  color: #fde047;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.score.low {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 60px 20px 30px;
  opacity: 0.6;
  font-size: 16px;
}

.footer a {
  margin: 0 20px;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* LOADING */
.loading-screen {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  background: #09090e;
  color: #fff;
}

.loading-screen h1 {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
```

---

### File: `frontend/src/style/LandingHome.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
/* =============================================
   LandingHome.css — Full redesign
   ============================================= */

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

/* ---- Root / Page ---- */
.landing-home {
  min-height: 100vh;
  background: #060614;
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* ---- Animated blobs ---- */
.blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.18;
  animation: blobFloat 10s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}
.blob-1 {
  width: 600px;
  height: 600px;
  background: #7c3aed;
  top: -150px;
  left: -200px;
  animation-delay: 0s;
}
.blob-2 {
  width: 500px;
  height: 500px;
  background: #2563eb;
  bottom: 0;
  right: -150px;
  animation-delay: 3s;
}
.blob-3 {
  width: 300px;
  height: 300px;
  background: #db2777;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}
@keyframes blobFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-40px) scale(1.05);
  }
}

/* All sections sit above blobs */
.landing-home > *:not(.blob) {
  position: relative;
  z-index: 1;
}

/* ---- Navbar ---- */
.landing-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  background: rgba(6, 6, 20, 0.6);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff;
}
.nav-logo {
  font-size: 1.4rem;
  color: #a78bfa;
}
.nav-title {
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}
.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #e2e8f0;
}
.nav-cta {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}
.nav-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ---- Hero ---- */
.landing-hero {
  text-align: center;
  padding: 90px 40px 60px;
  max-width: 900px;
  margin: 0 auto;
}
.landing-badge {
  display: inline-block;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #c4b5fd;
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 28px;
  animation: badgePop 0.6s ease;
}
@keyframes badgePop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.landing-hero h1 {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 900;
  line-height: 1.15;
  color: #f8fafc;
  margin-bottom: 22px;
  letter-spacing: -0.02em;
  animation: heroSlideUp 0.7s ease;
}
@keyframes heroSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.highlight-purple {
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.highlight-blue {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

/* ---- Stats strip ---- */
.stats-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px 32px;
  max-width: 500px;
  margin: 0 auto;
  animation: heroSlideUp 0.9s ease;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
}
.stat-num {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 2px;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
}

/* ---- Cards ---- */
.landing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 28px;
  max-width: 1080px;
  margin: 60px auto;
  padding: 0 40px;
}

.feature-card {
  position: relative;
  background: rgba(15, 15, 35, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 36px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(12px);
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.card-analyzer:hover {
  border-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 20px 60px rgba(124, 58, 237, 0.2);
}
.card-builder:hover {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.2);
}

/* Card glow blob inside */
.card-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
  top: -50px;
  right: -50px;
  pointer-events: none;
  transition: opacity 0.3s;
}
.feature-card:hover .card-glow {
  opacity: 0.3;
}
.glow-purple {
  background: #7c3aed;
}
.glow-blue {
  background: #2563eb;
}

/* Icon wrapper */
.card-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}
.icon-wrap-purple {
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
}
.icon-wrap-blue {
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.3);
}
.card-icon {
  font-size: 1.7rem;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 12px;
}
.card-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 22px;
}
.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
}
.check {
  font-size: 0.75rem;
}
.check-purple {
  color: #a78bfa;
}
.check-blue {
  color: #60a5fa;
}

.card-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  padding: 13px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  width: 100%;
  justify-content: center;
}
.card-cta:hover {
  transform: scale(1.02);
  opacity: 0.92;
}
.cta-purple {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
}
.cta-blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}
.arrow {
  font-size: 1.1rem;
  transition: transform 0.2s;
}
.card-cta:hover .arrow {
  transform: translateX(4px);
}

/* ---- How it works ---- */
.how-it-works {
  max-width: 1080px;
  margin: 20px auto 80px;
  padding: 0 40px;
  text-align: center;
}
.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 10px;
}
.section-sub {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 50px;
}
.steps-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.step-card {
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 36px 28px;
  flex: 1;
  min-width: 220px;
  max-width: 280px;
  transition: border-color 0.3s, transform 0.3s;
}
.step-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-4px);
}
.step-num {
  font-size: 0.75rem;
  font-weight: 800;
  color: #7c3aed;
  letter-spacing: 0.1em;
  margin-bottom: 14px;
}
.step-icon {
  font-size: 2rem;
  margin-bottom: 14px;
}
.step-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 10px;
}
.step-card p {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.65;
}
.step-connector {
  font-size: 1.6rem;
  color: #334155;
  padding: 0 4px;
  flex-shrink: 0;
}

/* ---- Footer ---- */
.landing-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 32px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-brand {
  font-weight: 800;
  color: #a78bfa;
  font-size: 1rem;
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: #64748b;
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #e2e8f0;
}
.footer-copy {
  color: #334155;
  font-size: 0.8rem;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .landing-nav {
    padding: 16px 24px;
  }
  .nav-links a {
    display: none;
  }
  .landing-hero {
    padding: 60px 24px 40px;
  }
  .landing-cards {
    padding: 0 24px;
    gap: 20px;
  }
  .how-it-works {
    padding: 0 24px;
  }
  .step-connector {
    display: none;
  }
  .steps-grid {
    flex-direction: column;
    align-items: center;
  }
  .step-card {
    max-width: 100%;
    width: 100%;
  }
  .landing-footer {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }
  .stats-strip {
    padding: 14px 16px;
  }
  .stat-item {
    padding: 0 12px;
  }
}
```

---

### File: `frontend/src/style/button.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
@import "tailwindcss";


.btn-primary {
  @apply bg-red-500 text-white px-4 py-2 rounded-2xl w-full cursor-pointer transition-all duration-200 ease-in-out;
}

.btn-primary:hover {
  @apply bg-red-600;
}

.btn-primary:active {
  @apply bg-[#e37312];
}
```

---

### File: `frontend/src/style/interview.css`

**Purpose & Role:** Visual styling and design tokens specification.

**Key Concepts & Design Highlights:**
- Theme definitions & responsive layout variables

```css
/* MAIN 3 COLUMN GRID */

.interview-layout {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  gap: 25px;
}


/* LEFT SIDEBAR */

.interview-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


/* NAV BUTTONS */

.nav-btn {
  background: transparent;
  border: 1px solid #334155;
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.nav-btn:hover {
  background: #020617;
}

.nav-btn.active {
  border-color: #ff2f92;
  color: #ff2f92;
}


/* MAIN CONTENT */

.interview-main {
  min-height: 400px;
}


/* RIGHT PANEL */

.interview-right {
  display: flex;
  flex-direction: column;
}


/* SKILL TAGS */

.skill-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  border: 1px solid #334155;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #9ca3af;
  background: #020617;
}
```

---

