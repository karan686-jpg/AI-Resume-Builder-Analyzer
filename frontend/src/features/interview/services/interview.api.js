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