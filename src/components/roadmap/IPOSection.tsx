import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IPOData, IPOType, Company } from "@/types/retail";
import { TrendingUp, DollarSign, BarChart3, FileText, Building2, Tag, Calendar } from "lucide-react";
import { ErrorReportButton } from "./ErrorReportButton";

const getIPOTypeLabel = (type: IPOType) => {
  return type === 'ipo' ? 'IPO' : 'SPO';
};

const getIPOTypeColor = (type: IPOType) => {
  return type === 'ipo' 
    ? 'bg-emerald-500 text-white' 
    : 'bg-amber-500 text-white';
};

interface IPOSectionProps {
  ipoData: IPOData[];
  companies: Company[];
}

export const IPOSection = ({ ipoData, companies }: IPOSectionProps) => {
  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  if (ipoData.length === 0) {
    return (
      <Card className="p-12 text-center shadow-soft">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">
          Нет данных об IPO/SPO для выбранных компаний
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">IPO и SPO</h2>
      </div>

      <div className="grid gap-6">
        {ipoData.map((ipo, index) => {
          const company = getCompanyById(ipo.companyId);
          return (
            <Card
              key={`${ipo.companyId}-${index}`}
              className="p-6 shadow-medium hover:shadow-large transition-all duration-300"
            >
              {/* Header with badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className="text-sm font-semibold px-3 py-1"
                    style={{
                      backgroundColor: company?.color || "#666",
                      color: "white",
                    }}
                  >
                    {company?.name}
                  </Badge>
                  <Badge
                    className={`text-sm font-semibold px-3 py-1 ${getIPOTypeColor(ipo.type)}`}
                  >
                    {getIPOTypeLabel(ipo.type)}
                  </Badge>
                </div>
                <ErrorReportButton
                  entityType="ipo"
                  entityId={`${ipo.companyId}-${ipo.type}-${ipo.date}`}
                  entityTitle={`${getIPOTypeLabel(ipo.type)} ${company?.name || ''} (${new Date(ipo.date).getFullYear()})`}
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {getIPOTypeLabel(ipo.type)} {ipo.exchange.includes('LSE') ? 'GDR (Лондон)' : `(${ipo.exchange})`}
              </h3>

              {/* Short description */}
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {ipo.marketPosition.split('.')[0]}.
              </p>

              {/* Details section */}
              <div className="bg-muted/50 rounded-xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Детали {getIPOTypeLabel(ipo.type)}</h4>
                </div>

                <div className="space-y-3">
                  {ipo.valuation !== '-' && (
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground min-w-[100px]">Оценка:</span>
                      <span className="text-sm font-semibold text-foreground">{ipo.valuation}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground min-w-[100px]">Привлечено:</span>
                    <span className="text-sm font-semibold text-foreground">{ipo.raised}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground min-w-[100px]">Выручка:</span>
                    <span className="text-sm font-semibold text-foreground">{ipo.revenue}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground min-w-[100px]">Акции:</span>
                    <span className="text-sm font-semibold text-foreground">{ipo.shares}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground min-w-[100px]">Биржа:</span>
                    <span className="text-sm font-semibold text-foreground">{ipo.exchange}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground min-w-[100px]">Тикер:</span>
                    <span className="text-sm font-semibold text-foreground">{ipo.ticker}</span>
                  </div>

                  {ipo.price !== '-' && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground min-w-[100px]">Цена:</span>
                      <span className="text-sm font-semibold text-foreground">{ipo.price}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prospectus section */}
              {ipo.marketPosition && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Проспект:</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    {ipo.marketPosition}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-muted-foreground pt-4 border-t">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(ipo.date).toLocaleDateString("ru-RU", { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
