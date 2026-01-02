import { Company, RoadmapEvent, Founder, IPOData, FinancialData, MAEvent } from '@/types/retail';
import { getServerApiUrl } from './api-config';

// Transform API data to match frontend types
const transformCompany = (data: any): Company => ({
  id: data.id,
  name: data.name,
  parentCompany: data.parent_company || undefined,
  logo: data.logo || undefined,
  color: data.color,
  status: data.status as 'active' | 'inactive' | 'acquired',
  acquiredBy: data.acquired_by || undefined,
  acquiredYear: data.acquired_year ? Number(data.acquired_year) : undefined,
  storyUrl: data.story_url || undefined,
});

const transformEvent = (data: any): RoadmapEvent => ({
  id: data.id,
  companyId: data.company_id,
  date: data.date,
  title: data.title,
  description: data.description || '',
  category: data.category,
  subcategory: data.subcategory || undefined,
});

const transformFounder = (data: any): Founder => ({
  id: data.id,
  companyId: data.company_id,
  name: data.name,
  role: data.role || '',
  period: data.period || '',
  status: data.status as 'active' | 'inactive',
  ownership: data.ownership || undefined,
  background: data.background || undefined,
  keyContributions: data.key_contributions || [],
  currentActivity: data.current_activity || undefined,
});

const transformIPO = (data: any): IPOData => ({
  companyId: data.company_id,
  type: data.type as 'ipo' | 'spo',
  date: data.date,
  valuation: data.valuation || '',
  raised: data.raised || '',
  revenue: data.revenue || '',
  shares: data.shares || '',
  exchange: data.exchange || '',
  ticker: data.ticker || '',
  price: data.price || '',
  prospectus: data.prospectus || undefined,
  marketPosition: data.market_position || '',
});

const transformFinancial = (data: any): FinancialData => ({
  companyId: data.company_id,
  year: Number(data.year),
  quarter: data.quarter ? Number(data.quarter) : undefined,
  revenue: Number(data.revenue) || 0,
  profit: data.profit ? Number(data.profit) : undefined,
  margin: data.margin ? Number(data.margin) : undefined,
  storeCount: Number(data.store_count) || 0,
});

const transformMA = (data: any): MAEvent => ({
  id: data.id,
  date: data.date,
  buyer: data.buyer,
  target: data.target,
  value: data.value || undefined,
  description: data.description || '',
});

export interface ServerApiData {
  companies: Company[];
  events: RoadmapEvent[];
  founders: Founder[];
  ipoData: IPOData[];
  financials: FinancialData[];
  maEvents: MAEvent[];
  isApiConfigured: boolean;
}

// Fetch data from API endpoint
async function fetchFromApi<T>(url: string): Promise<T> {
  try {
    // URL should already be absolute from getAbsoluteUrl
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data for SSR
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
}

// Load static data as fallback
async function loadStaticData(): Promise<ServerApiData> {
  try {
    const staticData = await import('@/data');
    const staticCompanies = await import('@/data/companies');
    
    return {
      companies: staticCompanies.companies,
      events: staticData.allEvents,
      founders: staticData.allFounders,
      ipoData: staticData.allIPO,
      financials: staticData.allFinancials,
      maEvents: staticData.allMA || [],
      isApiConfigured: false,
    };
  } catch (error) {
    console.error('Failed to load static data:', error);
    return {
      companies: [],
      events: [],
      founders: [],
      ipoData: [],
      financials: [],
      maEvents: [],
      isApiConfigured: false,
    };
  }
}

// Helper to construct absolute URL for server-side fetch
function getAbsoluteUrl(path: string): string {
  // If path is already absolute, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Try to get host from environment variables first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const cleanHost = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanHost}${cleanPath}`;
  }
  
  // Try Vercel URL
  if (process.env.VERCEL_URL) {
    const cleanHost = `https://${process.env.VERCEL_URL}`;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanHost}${cleanPath}`;
  }
  
  // Fallback to localhost for development
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://localhost:3000${cleanPath}`;
}

// Main function to fetch all data from API or fallback to static data
export async function fetchApiData(): Promise<ServerApiData> {
  const baseUrl = getServerApiUrl();
  
  // Try to fetch from API first
  try {
    let apiBaseUrl: string;
    
    // If baseUrl is already absolute (starts with http), use it directly
    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
      apiBaseUrl = baseUrl;
    } else if (baseUrl && baseUrl !== '/api') {
      // Custom relative path configured
      apiBaseUrl = getAbsoluteUrl(baseUrl);
    } else {
      // Use default /api path, construct absolute URL
      // For server-side, we'll use environment variables or fallback to localhost
      apiBaseUrl = getAbsoluteUrl('/api');
    }
    
    // Try to fetch all data from API
    const [companiesData, eventsData, foundersData, ipoData, financialsData, maData] = await Promise.all([
      fetchFromApi<any[]>(`${apiBaseUrl}/companies.php`).catch(() => []),
      fetchFromApi<any[]>(`${apiBaseUrl}/events.php`).catch(() => []),
      fetchFromApi<any[]>(`${apiBaseUrl}/founders.php`).catch(() => []),
      fetchFromApi<any[]>(`${apiBaseUrl}/ipo.php`).catch(() => []),
      fetchFromApi<any[]>(`${apiBaseUrl}/financials.php`).catch(() => []),
      fetchFromApi<any[]>(`${apiBaseUrl}/ma.php`).catch(() => []),
    ]);
    
    // If we got companies data (even if empty array), API is configured
    if (Array.isArray(companiesData)) {
      return {
        companies: companiesData.map(transformCompany),
        events: Array.isArray(eventsData) ? eventsData.map(transformEvent) : [],
        founders: Array.isArray(foundersData) ? foundersData.map(transformFounder) : [],
        ipoData: Array.isArray(ipoData) ? ipoData.map(transformIPO) : [],
        financials: Array.isArray(financialsData) ? financialsData.map(transformFinancial) : [],
        maEvents: Array.isArray(maData) ? maData.map(transformMA) : [],
        isApiConfigured: true,
      };
    }
  } catch (error) {
    // API not available, will fallback to static data
    console.log('API not available, using static data:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Fallback to static data
  return loadStaticData();
}

