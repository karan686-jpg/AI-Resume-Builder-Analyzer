import { useContext, useCallback } from "react";
import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    getResumePdf as apiGetResumePdf,
} from "../services/interview.api";
import InterviewContext from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    // Clean helper to manage loading state around async actions
    const withLoading = useCallback(async (action) => {
        setLoading(true);
        try {
            return await action();
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    // Fetch an interview report by its ID
    const getReportById = useCallback(async (id) => {
        return withLoading(async () => {
            const data = await getInterviewReportById(id);
            setReport(data);
            return data;
        });
    }, [withLoading, setReport]);

    // Generate a new interview report and store in context
    const generateReport = useCallback(async ({ jobDescription, resumeFile, selfDescription }) => {
        return withLoading(async () => {
            const data = await generateInterviewReport({
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
    }, [withLoading, setReport]);

    // Fetch all previously generated interview reports for current user
    const getReports = useCallback(async () => {
        return withLoading(async () => {
            const data = await getAllInterviewReports();
            setReports(data);
            return data;
        });
    }, [withLoading, setReports]);

    // Download resume PDF as a blob stream
    const getResumePdf = useCallback(async (id) => {
        try {
            const blob = await apiGetResumePdf(id);
            const fileBlob = blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
            const url = window.URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${id}.pdf`);

            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download resume:", err);
        }
    }, []);

    return {
        report,
        reports,
        loading,
        getReportById,
        generateReport,
        getReports,
        getResumePdf,
    };
};
