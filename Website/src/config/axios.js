import axios from "axios";
import { refreshAccessTokenAPI } from "../features/Auth/api/auth.api.js";

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
    inMemoryAccessToken = token;
};

export const getAccessToken = () => {
    return inMemoryAccessToken;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cho phép tự động gửi và nhận HttpOnly Cookie (RefreshToken)
});

// Attach auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor để xử lý 401 và tự động gọi refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Nếu lỗi 401 (Unauthorized) và chưa từng thử retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đã thử retry
            
            // Đừng cố refresh token nếu đang gọi API login hoặc chính API refresh
            if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            try {
                // Gọi API refresh token (Cookie sẽ tự động được gửi đi nhờ withCredentials)
                const refreshData = await refreshAccessTokenAPI();
                const newAccessToken = refreshData?.data?.accessToken || refreshData?.accessToken;
                
                if (newAccessToken) {
                    setAccessToken(newAccessToken);
                    // Gắn token mới vào request bị lỗi ban đầu và gọi lại
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh thất bại (ví dụ: cookie hết hạn, không hợp lệ), clear thông tin
                setAccessToken(null);
                localStorage.clear(); // Xóa các config khác nếu có
                window.location.href = '/login'; // Chuyển về trang đăng nhập
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;