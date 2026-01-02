import { Card } from "@/components/ui/card";
import { FinancialData, IPOData, Company } from "@/types/retail";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

interface FinancialChartProps {
  data: FinancialData[];
  companyIds: string[];
  companies: Company[];
  ipoData: IPOData[];
}

export const FinancialChart = ({ data, companyIds, companies, ipoData }: FinancialChartProps) => {
  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  if (data.length === 0) {
    return (
      <Card className="p-12 text-center shadow-soft">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">
          Нет финансовых данных для отображения
        </p>
      </Card>
    );
  }

  // Group data by year for chart
  const chartData = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.year === item.year);
    if (existing) {
      existing[`revenue_${item.companyId}`] = item.revenue;
      existing[`stores_${item.companyId}`] = item.storeCount;
    } else {
      acc.push({
        year: item.year,
        [`revenue_${item.companyId}`]: item.revenue,
        [`stores_${item.companyId}`]: item.storeCount,
      });
    }
    return acc;
  }, [] as any[]);

  chartData.sort((a, b) => a.year - b.year);

  // Get IPO years for filtered companies with full details
  const ipoMarkers = ipoData
    .filter((ipo) => companyIds.includes(ipo.companyId))
    .map((ipo) => {
      const company = getCompanyById(ipo.companyId);
      const year = new Date(ipo.date).getFullYear();
      return {
        year,
        companyId: ipo.companyId,
        companyName: company?.name || ipo.companyId,
        color: company?.color || "hsl(var(--primary))",
        ipoData: ipo,
      };
    });

  // Custom tooltip for IPO information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const year = label || payload[0]?.payload?.year;
    const ipoInfo = ipoMarkers.find((m) => m.year === year);

    // Filter out entries with undefined/null values
    const validEntries = payload.filter((entry: any) => entry.value !== undefined && entry.value !== null);

    if (validEntries.length === 0) return null;

    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-md">
        <div className="font-bold text-foreground mb-2">{year} год</div>
        <div className="space-y-2">
          {validEntries.map((entry: any, index: number) => {
            const isRevenue = entry.dataKey?.includes("revenue");
            const isStores = entry.dataKey?.includes("stores");
            const unit = isRevenue ? "млрд ₽" : isStores ? "магазинов" : "";
            
            return (
              <div key={index}>
                <span style={{ color: entry.color }} className="font-semibold">
                  {entry.name}:
                </span>{" "}
                <span className="text-foreground">
                  {typeof entry.value === 'number' ? entry.value.toLocaleString('ru-RU') : entry.value} {unit}
                </span>
              </div>
            );
          })}
          
          {ipoInfo && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="font-bold text-lg mb-2" style={{ color: ipoInfo.color }}>
                📈 IPO {ipoInfo.companyName}
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><span className="font-semibold">Дата:</span> {new Date(ipoInfo.ipoData.date).toLocaleDateString("ru-RU")}</div>
                <div><span className="font-semibold">Оценка:</span> {ipoInfo.ipoData.valuation}</div>
                <div><span className="font-semibold">Привлечено:</span> {ipoInfo.ipoData.raised}</div>
                <div><span className="font-semibold">Биржа:</span> {ipoInfo.ipoData.exchange}</div>
                <div><span className="font-semibold">Тикер:</span> {ipoInfo.ipoData.ticker}</div>
                <div><span className="font-semibold">Цена:</span> {ipoInfo.ipoData.price}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Финансовые показатели</h2>
      </div>

      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold mb-6 text-foreground">Выручка по годам</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${value} млрд ₽`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {companyIds.map((companyId, idx) => {
              const company = getCompanyById(companyId);
              return (
                <Line
                  key={companyId}
                  type="monotone"
                  dataKey={`revenue_${companyId}`}
                  stroke={company?.color || `hsl(var(--chart-${(idx % 5) + 1}))`}
                  strokeWidth={2}
                  name={`Выручка ${company?.name || companyId}`}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
            {ipoMarkers.map((marker, idx) => (
              <ReferenceLine
                key={`ipo-${marker.companyId}-${idx}`}
                x={marker.year}
                stroke={marker.color}
                strokeDasharray="5 5"
                strokeWidth={3}
                label={{
                  value: "IPO",
                  position: "top",
                  fill: marker.color,
                  fontSize: 16,
                  fontWeight: 700,
                  offset: 5,
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold mb-6 text-foreground">
          Количество магазинов
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${value} магазинов`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {companyIds.map((companyId, idx) => {
              const company = getCompanyById(companyId);
              return (
                <Line
                  key={companyId}
                  type="monotone"
                  dataKey={`stores_${companyId}`}
                  stroke={company?.color || `hsl(var(--chart-${(idx % 5) + 1}))`}
                  strokeWidth={2}
                  name={`Магазины ${company?.name || companyId}`}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
            {ipoMarkers.map((marker, idx) => (
              <ReferenceLine
                key={`ipo-stores-${marker.companyId}-${idx}`}
                x={marker.year}
                stroke={marker.color}
                strokeDasharray="5 5"
                strokeWidth={3}
                label={{
                  value: "IPO",
                  position: "top",
                  fill: marker.color,
                  fontSize: 16,
                  fontWeight: 700,
                  offset: 5,
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
