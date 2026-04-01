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
