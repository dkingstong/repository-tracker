'use client'

import { useState, useEffect } from 'react'
import { Search, X, ArrowDown, ArrowUp, Trash, Filter } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { cn } from '@/lib/utils'
import { useDebounce } from '../hooks/use-debounce'

// Generic filter option interface for any entity type
export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  type: 'search' | 'boolean';
  placeholder?: string;
}

// Generic sort option interface for any entity type
export interface SortOption<T extends string = string> {
  id: T;
  label: string;
}

// Generic filter state - keys match FilterOption ids
export interface FilterState {
  [key: string]: string | boolean | undefined;
}

// Generic sort state with direction
export interface SortState<T extends string = string> {
  field: T;
  direction: 'ASC' | 'DESC';
}

// Props for the EntityFilters component
interface EntityFiltersProps<F extends string = string, S extends string = string> {
  title?: string;
  filterOptions: FilterOption<F>[];
  sortOptions: SortOption<S>[];
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  sort: SortState<S>;
  setSort: (sort: SortState<S>) => void;
}

export default function EntityFilters<F extends string = string, S extends string = string>({
  title = 'Filter & Sort',
  filterOptions,
  sortOptions,
  filter,
  setFilter,
  sort,
  setSort
}: EntityFiltersProps<F, S>) {
  // Local search term values to handle debounce
  const [localSearchValues, setLocalSearchValues] = useState<Record<string, string>>({});
  
  // Update filter with debounced search values
  const debouncedSearchValues = useDebounce(localSearchValues, 300);
  
  useEffect(() => {
    const newFilter = { ...filter };
    
    // Apply all debounced search values to the filter
    Object.entries(debouncedSearchValues).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        newFilter[key] = value;
      } else {
        delete newFilter[key];
      }
    });
    
    setFilter(newFilter);
  }, [debouncedSearchValues, setFilter]);
  
  // Initialize local search values from filter
  useEffect(() => {
    const searchInitValues: Record<string, string> = {};
    
    filterOptions.forEach(option => {
      if (option.type === 'search' && filter[option.id]) {
        searchInitValues[option.id] = filter[option.id] as string;
      }
    });
    
    setLocalSearchValues(searchInitValues);
  }, []);
  
  // Handle search input change
  const handleSearchChange = (id: string, value: string) => {
    setLocalSearchValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle boolean filter toggle
  const handleBooleanToggle = (id: string, value: boolean) => {
    const newFilter = { ...filter };
    
    if (value) {
      newFilter[id] = true;
    } else {
      delete newFilter[id];
    }
    
    setFilter(newFilter);
  };
  
  // Handle sort field change
  const handleSortFieldChange = (field: S) => {
    setSort({ ...sort, field });
  };
  
  // Handle sort direction toggle
  const handleSortDirectionToggle = () => {
    setSort({
      ...sort,
      direction: sort.direction === 'ASC' ? 'DESC' : 'ASC'
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilter({});
    setLocalSearchValues({});
  };
  
  // Check if any filters are active
  const hasActiveFilters = Object.keys(filter).length > 0;
  
  // Count active filters
  const activeFilterCount = Object.keys(filter).length;

  return (
    <div className="w-full bg-card rounded-lg border p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full sm:w-auto text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-3.5 w-3.5 mr-1.5" />
            Clear filters
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs font-normal"
            >
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
      
      <div className="space-y-5">
        {/* Search filters & Boolean filters combined */}
        <div className="space-y-4">
          {filterOptions.filter(option => option.type === 'search' || option.type === 'boolean').length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-muted-foreground">Filters</span>
                <div className="ml-3 h-px flex-1 bg-border/30"></div>
              </div>
              
              <div className="flex flex-col gap-4 sm:gap-3">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {/* Search filters */}
                  {filterOptions.filter(option => option.type === 'search').length > 0 && (
                    <div className="flex-grow relative w-full">
                      {filterOptions
                        .filter(option => option.type === 'search')
                        .map(option => (
                          <div key={option.id} className="w-full relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              type="text"
                              placeholder={option.placeholder || `Search by ${option.label.toLowerCase()}...`}
                              value={localSearchValues[option.id] || ''}
                              onChange={(e) => handleSearchChange(option.id, e.target.value)}
                              className={cn(
                                "pl-10 transition-all focus-visible:ring-primary/70 h-10",
                                filter[option.id] ? "pr-10 border-primary/50" : ""
                              )}
                            />
                            {filter[option.id] && (
                              <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
                                onClick={() => {
                                  handleSearchChange(option.id, '');
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Boolean filters */}
                  {filterOptions.filter(option => option.type === 'boolean').length > 0 && (
                    <div className="flex items-center sm:self-start">
                      <div className="relative">
                        <Select
                          value={undefined}
                          onValueChange={(value) => {
                            // This is now handled by the toggle switches directly
                          }}
                        >
                          <SelectTrigger className="w-10 h-10 p-0 flex items-center justify-center [&>svg:last-child]:hidden">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions
                              .filter(option => option.type === 'boolean')
                              .map(option => (
                                <div 
                                  key={option.id}
                                  className="flex items-center justify-between px-2 py-1.5 cursor-default hover:bg-accent hover:text-accent-foreground"
                                  onClick={(e) => {
                                    // Prevent dropdown from closing when clicking the item
                                    e.stopPropagation();
                                    // Toggle the filter state
                                    handleBooleanToggle(option.id, !filter[option.id]);
                                  }}
                                >
                                  <span className="text-sm">{option.label}</span>
                                  <Switch
                                    checked={!!filter[option.id]}
                                    onCheckedChange={(checked) => {
                                      handleBooleanToggle(option.id, checked);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sort controls in separate div */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-background/50 rounded-md border">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                  <div className="flex flex-wrap gap-2 w-full">
                    <div className="flex-grow sm:flex-grow-0">
                      <Select
                        value={sort.field}
                        onValueChange={(value) => handleSortFieldChange(value as S)}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSortDirectionToggle}
                        className="h-9 w-9 shrink-0"
                      >
                        {sort.direction === 'ASC' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {sort.direction === 'ASC' ? 'Ascending' : 'Descending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Active filters display */}
          {hasActiveFilters && (
            <div>
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-muted-foreground">Active filters</span>
                <div className="ml-3 h-px flex-1 bg-border/30"></div>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-background/50 rounded-md border">
                {Object.entries(filter).map(([key, value]) => {
                  // Find the matching filter option to get its label
                  const option = filterOptions.find(opt => opt.id === key);
                  if (!option) return null;
                  
                  let displayValue: string;
                  if (option.type === 'boolean') {
                    displayValue = option.label;
                  } else {
                    displayValue = `${option.label}: ${value}`;
                  }
                  
                  return (
                    <Badge 
                      key={key}
                      variant="secondary"
                      className="gap-1 text-xs"
                    >
                      {displayValue}
                      <button 
                        onClick={() => {
                          if (option.type === 'search') {
                            handleSearchChange(key, '');
                          } else if (option.type === 'boolean') {
                            handleBooleanToggle(key, false);
                          }
                        }}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 