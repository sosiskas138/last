export interface Company {
  id: string;
  name: string;
  parentCompany?: string;
  logo?: string;
  color: string;
  status: 'active' | 'inactive' | 'acquired';
  acquiredBy?: string;
  acquiredYear?: number;
  storyUrl?: string;
}

export interface Owner {
  id: string;
  name: string;
  companies: string[];
  status: 'active' | 'inactive';
}

export type IPOType = 'ipo' | 'spo';

export interface IPOData {
  companyId: string;
  type: IPOType;
  date: string;
  valuation: string;
  raised: string;
  revenue: string;
  shares: string;
  exchange: string;
  ticker: string;
  price: string;
  prospectus?: string;
  marketPosition: string;
}

export interface MAEvent {
  id: string;
  date: string;
  buyer: string;
  target: string;
  value?: string;
  description: string;
}

export interface FinancialData {
  companyId: string;
  year: number;
  quarter?: number;
  revenue: number;
  profit?: number;
  margin?: number;
  storeCount: number;
}

export type EventCategory = 
  | 'format_and_refits'
  | 'assortment_development'
  | 'brand_and_loyalty'
  | 'online_and_delivery'
  | 'digital_technologies'
  | 'warehouse_logistics'
  | 'expansion'
  | 'new_regions'
  | 'competition'
  | 'consolidation'
  | 'debt_financing'
  | 'equity_ipo'
  | 'strategy'
  | 'macroeconomics';

export interface RoadmapEvent {
  id: string;
  companyId: string;
  date: string;
  title: string;
  description: string;
  category: EventCategory;
  subcategory?: string;
}

export interface Founder {
  id: string;
  companyId: string;
  name: string;
  role: string;
  period: string;
  status: 'active' | 'inactive';
  ownership?: string;
  background?: string;
  keyContributions?: string[];
  currentActivity?: string;
}

export type FilterType = 'company' | 'category' | 'event';

export interface FilterState {
  companies: string[];
  categories: EventCategory[];
  eventTypes: string[];
  founderStatus: ('active' | 'inactive')[];
  ipoTypes: IPOType[];
  dateRange?: {
    start: string;
    end: string;
  };
}
