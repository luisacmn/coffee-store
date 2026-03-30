import { useState } from 'react';
import type { ProductCategory, ProductFilters } from '@/features/products/types';
import { Search, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'beans', label: 'Whole Beans' },
  { value: 'ground', label: 'Ground' },
  { value: 'capsules', label: 'Capsules' },
];

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    onChange({ ...filters, search: value || undefined });
  };

  const handleCategory = (cat: ProductCategory | undefined) => {
    onChange({ ...filters, category: filters.category === cat ? undefined : cat });
  };

  const handleIntensity = (level: number | undefined) => {
    onChange({ ...filters, intensity: filters.intensity === level ? undefined : level });
  };

  const hasActiveFilters = filters.category || filters.intensity || filters.search;

  return (
    <aside className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search coffees..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.category === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Intensity
        </h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleIntensity(level)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                filters.intensity === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearch('');
            onChange({});
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear filters
        </button>
      )}
    </aside>
  );
}
