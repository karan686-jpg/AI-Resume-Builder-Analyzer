import { createContext, useContext, useState, useCallback } from "react";
import {
  generateInterviewReport as apiGenerateReport,
  getInterviewReportById as apiGetReportById,
} from "../../services/apiClient";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const withLoading = useCallback(async (action) => {
    setLoading(true);
    try {
      return await action();
    } finally {
      setLoading(false);
    }
  }, []);

  const getReportById = useCallback(async (id) => {
    return withLoading(async () => {
      const data = await apiGetReportById(id);
      setReport(data);
      return data;
    });
  }, [withLoading]);

  const generateReport = useCallback(async ({ jobDescription, resumeFile, selfDescription }) => {
    return withLoading(async () => {
      const data = await apiGenerateReport({
        jobDescription,
        resume: resumeFile,
        selfDescription,
      });
      if (data?.interviewReport) {
        setReport(data.interviewReport);
        return data.interviewReport;
      }
      return null;
    });
  }, [withLoading]);

  return (
    <InterviewContext.Provider
      value={{
        report,
        loading,
        getReportById,
        generateReport,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};


export default InterviewContext;
