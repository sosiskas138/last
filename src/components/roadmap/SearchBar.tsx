import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Поиск событий, компаний, категорий..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-12 border-border/50 focus-visible:ring-primary shadow-soft"
      />
    </div>
  );
};
