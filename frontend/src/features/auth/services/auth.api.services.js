import apiClient from "../../../services/apiClient";

export async function register(username, email, password) {
  try {
    const response = await apiClient.post("/auth/register", {
      username,
      email,
      password,
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
    const response = await apiClient.post("/auth/login", {
      email,
      password,
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
    const response = await apiClient.get("/auth/logout");
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
    const response = await apiClient.get("/auth/get-me");
    return response.data;
  } catch (error) {
    console.error("GetMe Error:", error);
    throw error;
  }
}
