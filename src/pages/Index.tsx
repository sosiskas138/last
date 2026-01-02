import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterPanel } from "@/components/roadmap/FilterPanel";
import { SearchBar } from "@/components/roadmap/SearchBar";
import { Timeline } from "@/components/roadmap/Timeline";
import { IPOSection } from "@/components/roadmap/IPOSection";
import { FinancialChart } from "@/components/roadmap/FinancialChart";
import { CompanyCard } from "@/components/roadmap/CompanyCard";
import { FoundersSection } from "@/components/roadmap/FoundersSection";
import { SEOHead } from "@/components/seo/SEOHead";
import { FilterState, FinancialData } from "@/types/retail";
import { useApiData } from "@/hooks/useApiData";
import { Store, Building2, TrendingUp, Filter, BarChart3, Users, UserCog, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    categories: [],
    eventTypes: [],
    founderStatus: [],
    ipoTypes: [],
  });

  // Load data from API (or static files as fallback)
  const { 
    companies, 
    events: allEvents, 
    founders: allFounders, 
    ipoData: allIPO, 
    financials: allFinancials, 
    isLoading, 
    isApiConfigured 
  } = useApiData();

  // Filter events based on search and filters
  const events = allEvents.filter((event) => {
    if (filters.companies.length > 0 && !filters.companies.includes(event.companyId)) {
      return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Filter IPO data
  const ipoData = allIPO.filter((ipo) => {
    if (filters.companies.length > 0 && !filters.companies.includes(ipo.companyId)) {
      return false;
    }
    if (filters.ipoTypes.length > 0 && !filters.ipoTypes.includes(ipo.type)) {
      return false;
    }
    return true;
  });

  // Filter financial data
  const financialData = allFinancials.filter((fin) => {
    if (filters.companies.length > 0) {
      return filters.companies.includes(fin.companyId);
    }
    return true;
  });

  // Filter founders data
  const foundersData = allFounders.filter((founder) => {
    if (filters.companies.length > 0 && !filters.companies.includes(founder.companyId)) {
      return false;
    }
    if (filters.founderStatus.length > 0 && !filters.founderStatus.includes(founder.status)) {
      return false;
    }
    return true;
  });

  const yearsOfHistory = allEvents.length > 0 
    ? Math.max(...allEvents.map(e => new Date(e.date).getFullYear())) - Math.min(...allEvents.map(e => new Date(e.date).getFullYear()))
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary shadow-large">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Дорожная карта российского ритейла
                  </h1>
                  <p className="text-lg text-white/90 mt-1">
                    История развития крупнейших розничных сетей России
                  </p>
                </div>
              </div>
              <Link to="/admin/login">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Админ
                </Button>
              </Link>
            </div>

            {/* Data Source Indicator */}
            {isApiConfigured && (
              <div className="mb-4 text-white/70 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Данные загружены из базы данных
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-1">
                    {allEvents.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Всего событий
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="text-4xl font-bold text-secondary mb-1">
                    {companies.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Розничных сетей
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-4xl font-bold text-accent mb-1">
                    {yearsOfHistory}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Лет истории
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center mb-3">
                    <Filter className="h-6 w-6" style={{ color: "hsl(var(--chart-4))" }} />
                  </div>
                  <div className="text-4xl font-bold mb-1" style={{ color: "hsl(var(--chart-4))" }}>
                    {events.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Отображено
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FilterPanel 
                  filters={filters} 
                  onFilterChange={setFilters} 
                  companies={companies}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="animate-fade-in">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="timeline" className="space-y-6 animate-slide-up">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    События
                  </TabsTrigger>
                  <TabsTrigger
                    value="ipo"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    IPO/SPO
                  </TabsTrigger>
                  <TabsTrigger
                    value="financials"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Финансы
                  </TabsTrigger>
                  <TabsTrigger
                    value="founders"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Основатели
                  </TabsTrigger>
                  <TabsTrigger
                    value="companies"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Компании
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-6">
                  <Timeline events={events} companies={companies} />
                </TabsContent>

                <TabsContent value="ipo" className="space-y-6">
                  <IPOSection ipoData={ipoData} companies={companies} />
                </TabsContent>

                <TabsContent value="financials" className="space-y-6">
                  <FinancialChart
                    data={financialData}
                    companyIds={filters.companies.length > 0 ? filters.companies : companies.map(c => c.id)}
                    companies={companies}
                    ipoData={ipoData}
                  />
                </TabsContent>

                <TabsContent value="founders" className="space-y-6">
                  <FoundersSection founders={foundersData} companies={companies} />
                </TabsContent>

                <TabsContent value="companies" className="space-y-6">
                  <div className="grid gap-6">
                    {companies
                      .filter((c) => !c.parentCompany)
                      .map((company) => {
                        const subsidiaries = companies.filter((c) => c.parentCompany === company.id);
                        return (
                          <div key={company.id} className="space-y-3">
                            <CompanyCard company={company} />
                            {subsidiaries.length > 0 && (
                              <div className="ml-8 space-y-3 border-l-2 border-muted pl-4">
                                {subsidiaries.map((sub) => (
                                  <CompanyCard key={sub.id} company={sub} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
