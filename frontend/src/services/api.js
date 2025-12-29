import axios from "axios";
import { auth } from "../firebase";

const API_BASE_URL = "http://localhost:5000/api";

// Create two axios instances: one for JSON, one for FormData
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiFormData = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Function to get current token
const getToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      return null;
    }
    const token = await user.getIdToken();
    console.log("Token retrieved, length:", token.length);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Add token interceptor to BOTH instances
const addTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    async (config) => {
      console.log(`Request to: ${config.url}, Method: ${config.method}`);

      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token added to headers");
      } else {
        console.warn("No token available for request");
      }

      console.log("Request headers:", config.headers);
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to debug 401
  instance.interceptors.response.use(
    (response) => {
      console.log(`Response from ${response.config.url}:`, response.status);
      return response;
    },
    (error) => {
      console.error(`Error from ${error.config?.url}:`, {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      if (error.response?.status === 401) {
        console.error("401 Unauthorized! Check:");
        console.error("1. Is token being sent?");
        console.error("2. Is backend Firebase Admin initialized?");
        console.error("3. Are CORS headers correct?");
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both instances
addTokenInterceptor(api);
addTokenInterceptor(apiFormData);

// Auth API
export const authAPI = {
  me: () => api.get("/auth/me"),
};

// History API
export const historyAPI = {
  analyzeImage: (formData) => {
    console.log("Uploading image, formData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    // Use apiFormData for multipart requests
    return apiFormData.post("/history/analyze", formData);
  },

  getHistory: (limit = 10, page = 1) =>
    api.get(`/history?limit=${limit}&page=${page}`),

  getHistoryById: (id) => api.get(`/history/${id}`),

  deleteHistory: (id) => api.delete(`/history/${id}`),

  getStats: () => api.get("/history/stats"),
};

// Test function
export const testBackendConnection = async () => {
  try {
    console.log("Testing backend connection...");

    const token = await getToken();
    if (!token) {
      console.error("No token available");
      return;
    }

    // Test 1: Simple GET to verify token
    const testResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Backend connection test successful:", testResponse.data);
    return testResponse.data;
  } catch (error) {
    console.error("❌ Backend connection test failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export default api;
