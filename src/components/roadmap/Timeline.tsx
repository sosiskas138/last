import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoadmapEvent, Company } from "@/types/retail";
import { getCategoryName } from "@/data/categories";
import { Calendar, Tag } from "lucide-react";
import { ErrorReportButton } from "./ErrorReportButton";

interface TimelineProps {
  events: RoadmapEvent[];
  companies: Company[];
}

export const Timeline = ({ events, companies }: TimelineProps) => {
  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, RoadmapEvent[]>);

  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {years.length === 0 ? (
        <Card className="p-12 text-center shadow-soft">
          <p className="text-muted-foreground text-lg">
            Нет событий для отображения. Выберите компании и категории в фильтрах.
          </p>
        </Card>
      ) : (
        years.map((year) => (
          <div key={year} className="relative">
            <div className="sticky top-4 z-10 mb-6">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-glow font-bold text-xl">
                <Calendar className="h-5 w-5" />
                {year}
              </div>
            </div>

            <div className="space-y-4 relative pl-8 border-l-4 border-primary/20">
              {eventsByYear[year]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((event, idx) => {
                  const company = getCompanyById(event.companyId);
                  return (
                    <Card
                      key={event.id}
                      className="ml-6 p-6 shadow-medium hover:shadow-large transition-all duration-300 border-l-4 animate-slide-in-right"
                      style={{
                        borderLeftColor: company?.color || "#666",
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className="font-semibold"
                              style={{
                                backgroundColor: company?.color || "#666",
                                color: "white",
                              }}
                            >
                              {company?.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>
                        <ErrorReportButton
                          entityType="event"
                          entityId={event.id}
                          entityTitle={event.title}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {getCategoryName(event.category)}
                        </span>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
