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