import { createBrowserRouter } from "react-router";
import Home from "./features/interview/pages/Home";
import AnalyzePage from "./features/interview/pages/AnalyzePage";
import Interview from "./features/interview/pages/interview";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./features/auth/pages/Dashboard";
import { Protected } from "./features/auth/auth.context";
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
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
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
