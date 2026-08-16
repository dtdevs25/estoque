// Typed API client — all requests go through here

const BASE = '/api';

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Erro ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ---- Auth ----
export const auth = {
  login: (email: string, password: string) =>
    req<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => req<any>('/auth/logout', { method: 'POST' }),
  me: () => req<any>('/auth/me'),
  forgotPassword: (email: string) =>
    req<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    req<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

// ---- Users ----
export const users = {
  list: () => req<any[]>('/users'),
  create: (data: any) => req<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => req<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => req<any>(`/users/${id}`, { method: 'DELETE' }),
  resendPassword: (id: string) => req<any>(`/users/${id}/resend-password`, { method: 'POST' }),
};

// ---- Locations ----
export const locations = {
  list: () => req<any[]>('/locations'),
  create: (data: any) => req<any>('/locations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => req<any>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => req<any>(`/locations/${id}`, { method: 'DELETE' }),
};

// ---- Items ----
export const items = {
  list: () => req<any[]>('/items'),
  create: (data: any) => req<any>('/items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => req<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => req<any>(`/items/${id}`, { method: 'DELETE' }),
};

// ---- Kits ----
export const kits = {
  list: () => req<any[]>('/kits'),
  create: (data: any) => req<any>('/kits', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => req<any>(`/kits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => req<any>(`/kits/${id}`, { method: 'DELETE' }),
};

// ---- Movements ----
export const movements = {
  list: (params?: { locationId?: string; itemId?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.locationId) qs.set('locationId', params.locationId);
    if (params?.itemId) qs.set('itemId', params.itemId);
    if (params?.limit) qs.set('limit', String(params.limit));
    return req<any[]>(`/movements?${qs}`);
  },
  entry: (data: any) => req<any>('/movements/entry', { method: 'POST', body: JSON.stringify(data) }),
  exit: (data: any) => req<any>('/movements/exit', { method: 'POST', body: JSON.stringify(data) }),
  batch: (data: any) => req<any>('/movements/batch', { method: 'POST', body: JSON.stringify(data) }),
  adjust: (data: any) => req<any>('/movements/adjust', { method: 'POST', body: JSON.stringify(data) }),
  transfer: (data: any) => req<any>('/movements/transfer', { method: 'POST', body: JSON.stringify(data) }),
  deliverKit: (data: any) => req<any>('/movements/deliver-kit', { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Upload ----
export const upload = {
  itemImage: async (file: File, itemType?: string): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    if (itemType) form.append('itemType', itemType);
    const res = await fetch(`${BASE}/upload/item`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    if (!res.ok) throw new Error('Erro ao fazer upload.');
    const data = await res.json();
    return data.url;
  },
  userPhoto: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/upload/user-photo`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    if (!res.ok) throw new Error('Erro ao fazer upload.');
    const data = await res.json();
    return data.url;
  },
};
