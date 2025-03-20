import axios from 'axios';

// Tạo API instance với axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api' || 'http://localhost:3001/api',
});

// Interceptor để thêm token vào header khi có yêu cầu
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chỉ hoạt động ở client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers['x-admin-token'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra nếu là lỗi 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Nếu ở client-side, xóa token và chuyển về trang login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        // Chuyển hướng nếu không ở trang login
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);