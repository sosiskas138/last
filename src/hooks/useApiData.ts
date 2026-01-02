import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Company, RoadmapEvent, Founder, IPOData, FinancialData, MAEvent } from '@/types/retail';

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

export interface ApiDataState {
  companies: Company[];
  events: RoadmapEvent[];
  founders: Founder[];
  ipoData: IPOData[];
  financials: FinancialData[];
  maEvents: MAEvent[];
  isLoading: boolean;
  error: string | null;
  isApiConfigured: boolean;
  refetch: () => void;
}

export const useApiData = (): ApiDataState => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [events, setEvents] = useState<RoadmapEvent[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [ipoData, setIpoData] = useState<IPOData[]>([]);
  const [financials, setFinancials] = useState<FinancialData[]>([]);
  const [maEvents, setMaEvents] = useState<MAEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  const loadData = async () => {
    const baseUrl = api.getBaseUrl();
    
    if (!baseUrl) {
      // No API configured, load static data as fallback
      setIsApiConfigured(false);
      try {
        const staticData = await import('@/data');
        const staticCompanies = await import('@/data/companies');
        setCompanies(staticCompanies.companies);
        setEvents(staticData.allEvents);
        setFounders(staticData.allFounders);
        setIpoData(staticData.allIPO);
        setFinancials(staticData.allFinancials);
        setMaEvents(staticData.allMA || []);
      } catch (e) {
        setError('Не удалось загрузить данные');
      }
      setIsLoading(false);
      return;
    }

    setIsApiConfigured(true);
    setIsLoading(true);
    setError(null);

    // Load each endpoint separately for better error handling
    try {
      const companiesData = await api.getCompanies();
      setCompanies(
        Array.isArray(companiesData) 
          ? companiesData.map(transformCompany) 
          : []
      );
    } catch (e) {
      console.error('Failed to load companies from API:', e);
    }

    try {
      const eventsData = await api.getEvents();
      setEvents(
        Array.isArray(eventsData) 
          ? eventsData.map(transformEvent) 
          : []
      );
    } catch (e) {
      console.error('Failed to load events from API:', e);
    }

    try {
      const foundersData = await api.getFounders();
      setFounders(
        Array.isArray(foundersData) 
          ? foundersData.map(transformFounder) 
          : []
      );
    } catch (e) {
      console.error('Failed to load founders from API:', e);
    }

    try {
      const ipoApiData = await api.getIPO();
      setIpoData(
        Array.isArray(ipoApiData) 
          ? ipoApiData.map(transformIPO) 
          : []
      );
    } catch (e) {
      console.error('Failed to load IPO from API:', e);
      // Fallback to static IPO data
      try {
        const staticData = await import('@/data');
        setIpoData(staticData.allIPO || []);
      } catch {}
    }

    try {
      const financialsData = await api.getFinancials();
      setFinancials(
        Array.isArray(financialsData) 
          ? financialsData.map(transformFinancial) 
          : []
      );
    } catch (e) {
      console.error('Failed to load financials from API:', e);
      // Fallback to static financials data
      try {
        const staticData = await import('@/data');
        setFinancials(staticData.allFinancials || []);
      } catch {}
    }

    try {
      const maData = await api.getMA();
      setMaEvents(
        Array.isArray(maData) 
          ? maData.map(transformMA) 
          : []
      );
    } catch (e) {
      console.error('Failed to load M&A from API:', e);
      // Fallback to static M&A data
      try {
        const staticData = await import('@/data');
        setMaEvents(staticData.allMA || []);
      } catch {}
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    companies,
    events,
    founders,
    ipoData,
    financials,
    maEvents,
    isLoading,
    error,
    isApiConfigured,
    refetch: loadData,
  };
};

// Helper to get company by ID
export const getCompanyById = (companies: Company[], id: string): Company | undefined => {
  return companies.find((c) => c.id === id);
};

// Helper to get company color
export const getCompanyColor = (companies: Company[], id: string): string => {
  const company = getCompanyById(companies, id);
  return company?.color || '#666';
};
