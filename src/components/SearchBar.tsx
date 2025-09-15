import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'page' | 'content';
  url: string;
  price?: number;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showRecentSearches?: boolean;
}

const staticPages: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'NextCare Global Services - Healthcare consulting worldwide',
    type: 'page',
    url: '/'
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Learn about our healthcare consulting expertise',
    type: 'page',
    url: '/about'
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Get in touch with our healthcare experts',
    type: 'page',
    url: '/contact'
  },
  {
    id: 'book',
    title: 'Book Appointment',
    description: 'Schedule a consultation with our experts',
    type: 'page',
    url: '/book-appointment'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'View your appointments and account information',
    type: 'page',
    url: '/dashboard'
  }
];

export const SearchBar = ({ 
  className = "", 
  placeholder = "Search services, pages, or content...",
  showRecentSearches = true 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Search services
      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

      const serviceResults: SearchResult[] = (services || []).map(service => ({
        id: service.id,
        title: service.name,
        description: service.description || '',
        type: 'service' as const,
        url: `/services?highlight=${service.id}`,
        price: service.price
      }));

      // Search static pages
      const pageResults = staticPages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults([...serviceResults, ...pageResults]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(query);
    navigate(result.url);
    setIsOpen(false);
    setQuery("");
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    setIsOpen(true);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, partIndex) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={`highlight-${partIndex}-${part}`} className="bg-yellow-200 text-yellow-900">{part}</mark> : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 animate-fade-in">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {!query && showRecentSearches && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Recent Searches
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs h-auto p-1"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full justify-start text-left h-auto p-2"
                    >
                      <TrendingUp className="mr-2 h-3 w-3" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <Button
                        key={result.id}
                        variant="ghost"
                        onClick={() => handleResultClick(result)}
                        className="w-full justify-start text-left h-auto p-3 mb-1"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {highlightMatch(result.title, query)}
                            </span>
                            <div className="flex items-center gap-2">
                              {result.price !== undefined && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  ${result.price}
                                </span>
                              )}
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded capitalize">
                                {result.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {highlightMatch(result.description, query)}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};