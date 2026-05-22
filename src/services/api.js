import axios from 'axios';

const api = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot reach server. Start backend on port 5000 (npm run dev in server folder).'
        : error.message);
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }
};

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password, role) => api.post('/api/auth/login', { email, password, role }),
  register: (formData) =>
    api.post('/api/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  registerShop: (body) => api.post('/api/auth/register-shop', body),
  me: () => api.get('/api/auth/me'),
  apply: (formData) =>
    api.post('/api/auth/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  users: () => api.get('/api/auth/users'),
  deleteUser: (id) => api.delete(`/api/auth/user/${id}`),
  updateCardType: (id, rationCardType) => api.put(`/api/auth/update-card/${id}`, { rationCardType }),
  getRationCard: (cardNumber) => api.get(`/api/auth/ration-card/${cardNumber}`),
};

// ─── Admin ──────────────────────────────────────────────────────────────────
export const adminApi = {
  applications: (params) => api.get('/api/admin/applications', { params }),
  stats: () => api.get('/api/admin/stats'),
  approve: (id, body) => api.put(`/api/admin/applications/${id}/approve`, body),
  reject: (id, body) => api.put(`/api/admin/applications/${id}/reject`, body),
  schemaList: () => api.get('/api/admin/schema'),
  schemaUpdate: (cardType, body) => api.put(`/api/admin/schema/${cardType}`, body),
  shopOwners: () => api.get('/api/admin/shop-owners'),
  approveShopOwner: (id) => api.put(`/api/admin/shop-owners/${id}/approve`),
  rejectShopOwner: (id, body) => api.put(`/api/admin/shop-owners/${id}/reject`, body),
  shops: () => api.get('/api/admin/shops'),
  duplicates: () => api.get('/api/admin/duplicates'),
  distributionReport: (params) => api.get('/api/admin/reports/distribution', { params }),
  complaints: () => api.get('/api/admin/complaints'),
  complaintUpdate: (id, body) => api.put(`/api/admin/complaints/${id}`, body),
};

// ─── Shop owner ─────────────────────────────────────────────────────────────
export const shopApi = {
  me: () => api.get('/api/shop/me'),
  updateStock: (body) => api.put('/api/shop/stock', body),
  verify: (body) => api.post('/api/shop/verify', body),
  distribute: (body) => api.post('/api/shop/distribute', body),
  transactions: (params) => api.get('/api/shop/transactions', { params }),
  complaints: () => api.get('/api/shop/complaints'),
  replyComplaint: (id, shopReply) => api.put(`/api/shop/complaints/${id}/reply`, { shopReply }),
};

// ─── Citizen user portal ────────────────────────────────────────────────────
export const userPortalApi = {
  quota: () => api.get('/api/user/quota'),
  generateOtp: () => api.post('/api/user/otp'),
  transactions: () => api.get('/api/user/transactions'),
  complaints: () => api.get('/api/user/complaints'),
  createComplaint: (body) => api.post('/api/user/complaints', body),
  shops: () => api.get('/api/user/shops'),
};

export const healthCheck = () => api.get('/api/health');

export default api;
