import axios from "axios";

const api = axios.create({
     baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api/auth',
     withCredentials: true,
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
     const token = localStorage.getItem("token");
     if (token) {
          config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
}, (error) => Promise.reject(error));

export async function register(username, email, password) {
     try {
          const response = await api.post('/register', {
               username,
               email,
               password
          });
          if (response.data?.token) {
               localStorage.setItem("token", response.data.token);
          }
          return response.data;
     } catch (error) {
          console.error("Register Error:", error); 
          throw error;
     }
}

export async function login(email, password) {
     try {
          const response = await api.post('/login', {
               email,
               password
          });
          if (response.data?.token) {
               localStorage.setItem("token", response.data.token);
          }
          return response.data;
     } catch (error) {
          console.error("Login Error:", error); 
          throw error;
     }
}

export async function logout() {
     try {
          const response = await api.get('/logout');
          localStorage.removeItem("token");
          return response.data;
     } catch (error) {
          localStorage.removeItem("token");
          console.error("Logout Error:", error); 
          throw error;
     }
}

export async function getMe() {
     try {
          const response = await api.get('/get-me');
          return response.data;
     } catch (error) {
          console.error("GetMe Error:", error); 
          throw error;
     }
}

