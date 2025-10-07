// frontend/src/lib/api.ts
// ورژن ۱.۰
// ایجاد یک کلاینت Axios مرکزی برای ارسال درخواست‌های احراز هویت شده

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// این بخش به صورت خودکار قبل از هر درخواست اجرا می‌شود
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        // توکن را به هدر درخواست اضافه می‌کند
        config.headers = { ...(config.headers || {}), Authorization: `Token ${token}` };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;