import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Founder, Company } from "@/types/retail";
import { User, Briefcase, Calendar, TrendingUp, Building2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ErrorReportButton } from "./ErrorReportButton";

interface FoundersSectionProps {
  founders: Founder[];
  companies: Company[];
}

export const FoundersSection = ({ founders, companies }: FoundersSectionProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (founders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Нет данных об учредителях и акционерах для выбранных фильтров
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {founders.map((founder) => {
        const company = getCompanyById(founder.companyId);
        const isExpanded = expandedIds.has(founder.id);
        
        return (
          <Card
            key={founder.id}
            className="p-6 hover:shadow-large transition-all duration-300 border-l-4 animate-fade-in"
            style={{ borderLeftColor: company?.color || "#666" }}
          >
            {/* Header - Always visible */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div 
                  className="p-3 rounded-lg shadow-soft"
                  style={{ backgroundColor: `${company?.color}15` || "#66666615" }}
                >
                  <User className="h-6 w-6" style={{ color: company?.color || "#666" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {founder.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className="font-semibold"
                      style={{ 
                        borderColor: company?.color || "#666",
                        color: company?.color || "#666"
                      }}
                    >
                      {company?.name}
                    </Badge>
                    <Badge
                      variant={founder.status === 'active' ? 'default' : 'secondary'}
                      className={founder.status === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                      }
                    >
                      {founder.status === 'active' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Активен
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Не активен
                        </>
                      )}
                    </Badge>
                  </div>
                  {/* Brief info - Always visible */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span className="line-clamp-1">{founder.role}</span>
                  </div>
                </div>
              </div>
              <ErrorReportButton
                entityType="founder"
                entityId={founder.id}
                entityTitle={founder.name}
              />
            </div>

            {/* Expand Button */}
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(founder.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Скрыть
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Подробнее
                  </>
                )}
              </Button>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-fade-in">
                {/* Period */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Период активности: {founder.period}</span>
                </div>

                {/* Ownership */}
                {founder.ownership && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                    <div className="flex items-start gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <h4 className="font-semibold text-foreground text-sm">Доля владения</h4>
                    </div>
                    <p className="text-sm text-foreground ml-6">{founder.ownership}</p>
                  </div>
                )}

                {/* Background */}
                {founder.background && (
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <h4 className="font-semibold text-foreground text-sm">Бэкграунд</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6 leading-relaxed">
                      {founder.background}
                    </p>
                  </div>
                )}

                {/* Key Contributions */}
                {founder.keyContributions && founder.keyContributions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Ключевой вклад</h4>
                    <ul className="space-y-1 ml-6">
                      {founder.keyContributions.map((contribution, index) => (
                        <li key={index} className="text-sm text-muted-foreground list-disc">
                          {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Current Activity */}
                {founder.currentActivity && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-foreground text-sm mb-2">Текущая активность</h4>
                    <p className="text-sm text-muted-foreground">{founder.currentActivity}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
