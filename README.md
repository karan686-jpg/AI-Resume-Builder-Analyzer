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
