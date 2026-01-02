export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

import { getClientApiUrl, getPublicApiUrl } from '@/lib/api-config';

class ApiService {
  private authToken: string | null = null;

  constructor() {
    this.authToken = localStorage.getItem('admin_token');
  }

  private normalizeBaseUrl(url: string): string {
    return url.trim().replace(/\/+$/, '');
  }

  getBaseUrl(): string {
    // Проверяем localStorage для пользовательской настройки (для админки)
    const storedUrl = localStorage.getItem('api_url');
    if (storedUrl) {
      return this.normalizeBaseUrl(storedUrl);
    }
    
    // Используем конфигурацию из api-config
    return getClientApiUrl();
  }

  getPublicBaseUrl(): string {
    return getPublicApiUrl();
  }

  setBaseUrl(url: string) {
    localStorage.setItem('api_url', this.normalizeBaseUrl(url));
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  getAuthToken(): string | null {
    // Always re-read from localStorage to ensure we have the latest token
    if (!this.authToken) {
      this.authToken = localStorage.getItem('admin_token');
    }
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return !!this.authToken && !!this.getBaseUrl();
  }

  isConfigured(): boolean {
    return !!this.getBaseUrl();
  }

  private getHeaders(requireAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Always get fresh token from storage
    const token = this.getAuthToken();
    if (requireAuth && token) {
      headers['Authorization'] = `Basic ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const rawText = await response.text();

    let data: any = null;
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        // Often means PHP returned an HTML error page (warnings, 404, redirects, etc.)
        throw new ApiError(
          'Сервер вернул некорректный ответ (ожидался JSON). Проверьте URL /api и работу PHP-скрипта.',
          response.status,
          rawText.slice(0, 300)
        );
      }
    }

    if (!response.ok || (data && data.error)) {
      const errorMessage = this.getErrorMessage(response.status, data?.error);
      throw new ApiError(errorMessage, response.status, data?.error || rawText);
    }

    return data as T;
  }

  private getErrorMessage(status: number, serverError?: string): string {
    switch (status) {
      case 401:
        return 'Ошибка авторизации. Войдите заново в админ-панель.';
      case 403:
        return 'Доступ запрещён. У вас нет прав для этого действия.';
      case 404:
        return 'Запись не найдена. Возможно, она была удалена.';
      case 500:
        return 'Ошибка сервера. Попробуйте позже или обратитесь к администратору.';
      default:
        if (serverError) {
          if (serverError.includes('Duplicate')) {
            return 'Запись с таким ID уже существует.';
          }
          if (serverError.includes('foreign key')) {
            return 'Невозможно удалить: есть связанные записи.';
          }
          return `Ошибка: ${serverError}`;
        }
        return 'Произошла неизвестная ошибка. Попробуйте ещё раз.';
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) {
      console.error('API URL not configured');
      return false;
    }

    try {
      const response = await fetch(`${baseUrl}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        this.setAuthToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout() {
    this.setAuthToken(null);
  }

  // Companies
  async getCompanies() {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const response = await fetch(`${baseUrl}/companies.php`);
    return this.handleResponse(response);
  }

  async getCompany(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/companies.php?id=${id}`);
    return this.handleResponse(response);
  }

  async createCompany(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/companies.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateCompany(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/companies.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteCompany(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/companies.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Events
  async getEvents(companyId?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = companyId 
      ? `${baseUrl}/events.php?company_id=${companyId}`
      : `${baseUrl}/events.php`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createEvent(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/events.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateEvent(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/events.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteEvent(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/events.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Founders
  async getFounders(companyId?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = companyId 
      ? `${baseUrl}/founders.php?company_id=${companyId}`
      : `${baseUrl}/founders.php`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createFounder(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/founders.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateFounder(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/founders.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteFounder(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/founders.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // IPO/SPO
  async getIPO(companyId?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = companyId 
      ? `${baseUrl}/ipo.php?company_id=${companyId}`
      : `${baseUrl}/ipo.php`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createIPO(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ipo.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateIPO(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ipo.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteIPO(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ipo.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Financials
  async getFinancials(companyId?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = companyId 
      ? `${baseUrl}/financials.php?company_id=${companyId}`
      : `${baseUrl}/financials.php`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createFinancial(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/financials.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateFinancial(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/financials.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteFinancial(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/financials.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // M&A Events
  async getMA(buyer?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = buyer 
      ? `${baseUrl}/ma.php?buyer=${encodeURIComponent(buyer)}`
      : `${baseUrl}/ma.php`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createMA(data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ma.php`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateMA(id: string, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ma.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteMA(id: string) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/ma.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Error Reports
  async getErrorReports(status?: string) {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return [];
    const url = status 
      ? `${baseUrl}/error_reports.php?status=${status}`
      : `${baseUrl}/error_reports.php`;
    const response = await fetch(url, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async createErrorReport(data: Record<string, unknown>) {
    // Use public API URL for user error reports (doesn't require auth)
    const baseUrl = this.getPublicBaseUrl();
    const response = await fetch(`${baseUrl}/error_reports.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateErrorReport(id: number, data: Record<string, unknown>) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/error_reports.php?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteErrorReport(id: number) {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/error_reports.php?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiService();
