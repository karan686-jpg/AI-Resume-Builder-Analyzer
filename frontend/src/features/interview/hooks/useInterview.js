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
