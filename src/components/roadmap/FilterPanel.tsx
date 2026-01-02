import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { categoryGroups } from "@/data/categories";
import { Company, FilterState, IPOType } from "@/types/retail";
import { Filter, Store, Truck, TrendingUp, Sparkles, UserCheck, BarChart3 } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  companies: Company[];
}

export const FilterPanel = ({ filters, onFilterChange, companies }: FilterPanelProps) => {
  const toggleCompany = (companyId: string) => {
    const newCompanies = filters.companies.includes(companyId)
      ? filters.companies.filter((id) => id !== companyId)
      : [...filters.companies, companyId];
    onFilterChange({ ...filters, companies: newCompanies });
  };

  const toggleCategory = (categoryId: any) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const toggleFounderStatus = (status: 'active' | 'inactive') => {
    const newStatuses = filters.founderStatus.includes(status)
      ? filters.founderStatus.filter((s) => s !== status)
      : [...filters.founderStatus, status];
    onFilterChange({ ...filters, founderStatus: newStatuses });
  };

  const toggleIPOType = (type: IPOType) => {
    const newTypes = filters.ipoTypes.includes(type)
      ? filters.ipoTypes.filter((t) => t !== type)
      : [...filters.ipoTypes, type];
    onFilterChange({ ...filters, ipoTypes: newTypes });
  };

  const selectAllCompanies = () => {
    const allCompanyIds = companies.map((c) => c.id);
    onFilterChange({ ...filters, companies: allCompanyIds });
  };

  const deselectAllCompanies = () => {
    onFilterChange({ ...filters, companies: [] });
  };

  const getGroupIcon = (groupId: string) => {
    switch (groupId) {
      case "format":
        return <Store className="h-4 w-4" />;
      case "online":
        return <Truck className="h-4 w-4" />;
      case "market":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getGroupGradient = (groupId: string) => {
    switch (groupId) {
      case "format":
        return "from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10";
      case "online":
        return "from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10";
      case "market":
        return "from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10";
      default:
        return "from-muted/50 to-muted/20";
    }
  };

  return (
    <Card className="h-full shadow-large border-border/50 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/20">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-glow">
            <Filter className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Фильтры
          </h2>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6 pr-4">
            {/* Companies Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-foreground">Компании и сети</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAllCompanies}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    Все
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deselectAllCompanies}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Сбросить
                  </Button>
                </div>
              </div>
              {companies
                .filter((c) => !c.parentCompany)
                .map((company) => (
                  <div key={company.id} className="space-y-2">
                    <div className="group flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:shadow-soft cursor-pointer">
                      <Checkbox
                        id={company.id}
                        checked={filters.companies.includes(company.id)}
                        onCheckedChange={() => toggleCompany(company.id)}
                        className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary data-[state=checked]:to-primary-glow"
                      />
                      <Label
                        htmlFor={company.id}
                        className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors duration-300"
                      >
                        {company.name}
                      </Label>
                    </div>
                    {companies
                      .filter((c) => c.parentCompany === company.id)
                      .map((child) => (
                        <div key={child.id} className="group flex items-center space-x-3 ml-6 p-2 rounded-lg transition-all duration-300 hover:bg-muted/50 cursor-pointer">
                          <Checkbox
                            id={child.id}
                            checked={filters.companies.includes(child.id)}
                            onCheckedChange={() => toggleCompany(child.id)}
                            className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-secondary data-[state=checked]:to-secondary/80"
                          />
                          <Label
                            htmlFor={child.id}
                            className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                          >
                            {child.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                ))}
            </div>

            <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* IPO/SPO Type Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10 transition-all duration-300 border border-emerald-500/20">
                <div className="p-1.5 rounded bg-background/80">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-foreground text-sm">Тип размещения</h3>
              </div>
              <div className="space-y-1">
                <div className="group flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-muted hover:to-transparent hover:shadow-soft hover:translate-x-1 cursor-pointer">
                  <Checkbox
                    id="ipo-type"
                    checked={filters.ipoTypes.includes('ipo')}
                    onCheckedChange={() => toggleIPOType('ipo')}
                    className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-emerald-500 data-[state=checked]:to-emerald-600 transition-transform duration-300 group-hover:scale-110"
                  />
                  <Label
                    htmlFor="ipo-type"
                    className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1"
                  >
                    IPO (первичное)
                  </Label>
                </div>
                <div className="group flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-muted hover:to-transparent hover:shadow-soft hover:translate-x-1 cursor-pointer">
                  <Checkbox
                    id="spo-type"
                    checked={filters.ipoTypes.includes('spo')}
                    onCheckedChange={() => toggleIPOType('spo')}
                    className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-amber-500 data-[state=checked]:to-amber-600 transition-transform duration-300 group-hover:scale-110"
                  />
                  <Label
                    htmlFor="spo-type"
                    className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1"
                  >
                    SPO (вторичное)
                  </Label>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Founder Status Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 transition-all duration-300 border border-green-500/20">
                <div className="p-1.5 rounded bg-background/80">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-bold text-foreground text-sm">Статус основателей</h3>
              </div>
              <div className="space-y-1">
                <div className="group flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-muted hover:to-transparent hover:shadow-soft hover:translate-x-1 cursor-pointer">
                  <Checkbox
                    id="founder-active"
                    checked={filters.founderStatus.includes('active')}
                    onCheckedChange={() => toggleFounderStatus('active')}
                    className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-green-600 transition-transform duration-300 group-hover:scale-110"
                  />
                  <Label
                    htmlFor="founder-active"
                    className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1"
                  >
                    Активен
                  </Label>
                </div>
                <div className="group flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-muted hover:to-transparent hover:shadow-soft hover:translate-x-1 cursor-pointer">
                  <Checkbox
                    id="founder-inactive"
                    checked={filters.founderStatus.includes('inactive')}
                    onCheckedChange={() => toggleFounderStatus('inactive')}
                    className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-gray-400 data-[state=checked]:to-gray-500 transition-transform duration-300 group-hover:scale-110"
                  />
                  <Label
                    htmlFor="founder-inactive"
                    className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1"
                  >
                    Не активен
                  </Label>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Category Groups */}
            {categoryGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className={`flex items-center gap-2 mb-3 p-3 rounded-lg bg-gradient-to-r ${getGroupGradient(group.id)} transition-all duration-300 border border-border/50`}>
                  <div className="p-1.5 rounded bg-background/80">
                    {getGroupIcon(group.id)}
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{group.name}</h3>
                </div>
                <div className="space-y-1">
                  {group.categories.map((category) => (
                    <div
                      key={category.id}
                      className="group flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-muted hover:to-transparent hover:shadow-soft hover:translate-x-1 cursor-pointer"
                    >
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-accent data-[state=checked]:to-accent/80 transition-transform duration-300 group-hover:scale-110"
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
