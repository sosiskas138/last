import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/retail";
import { Building2, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { ErrorReportButton } from "./ErrorReportButton";
import Link from "next/link";

interface CompanyCardProps {
  company: Company;
  storeCount?: number;
}

export const CompanyCard = ({ company, storeCount }: CompanyCardProps) => {
  return (
    <Card className="p-6 shadow-medium hover:shadow-large transition-all duration-300 border-l-4" style={{ borderLeftColor: company.color }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${company.color}20` }}
          >
            <Building2 className="h-6 w-6" style={{ color: company.color }} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{company.name}</h3>
            {company.parentCompany && (
              <p className="text-sm text-muted-foreground">
                Сеть компании {company.parentCompany}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={company.status === "active" ? "default" : company.status === "acquired" ? "outline" : "secondary"}
            className="gap-1"
          >
            {company.status === "active" ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {company.status === "active" ? "Активна" : company.status === "acquired" ? `Поглощена (${company.acquiredYear})` : "Неактивна"}
          </Badge>
          <ErrorReportButton
            entityType="company"
            entityId={company.id}
            entityTitle={company.name}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        {storeCount ? (
          <div className="text-sm text-muted-foreground">
            Количество магазинов: <span className="font-semibold text-foreground">{storeCount}</span>
          </div>
        ) : (
          <div />
        )}
        {company.storyUrl && (
          <Link href={company.storyUrl}>
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              История компании
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};
