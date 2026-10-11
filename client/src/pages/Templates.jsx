import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { templateService } from '../services/templateService';
import TemplateCard from '../components/TemplateCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Templates = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query values from URL
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'newest';

  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync state with URL params
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {};
      if (searchParam.trim()) params.search = searchParam.trim();
      if (categoryParam && categoryParam !== 'All') params.category = categoryParam;
      if (sortParam) params.sort = sortParam;

      const res = await templateService.getTemplates(params);
      if (res.success && Array.isArray(res.data)) {
        setTemplates(res.data);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
      setErrorMessage(
        err.response?.data?.message || 'Unable to connect to server. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchParam, categoryParam, sortParam]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Update URL params
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || (key === 'sort' && value === 'newest')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (val) => {
    setSearchQuery(val);
    updateQueryParam('search', val);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const isFiltered = !!searchParam || (categoryParam && categoryParam !== 'All') || sortParam !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Website Templates
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
          Browse our hand-crafted, production-ready website templates. Filter by category, search by keywords, and save your favorites.
        </p>
      </div>

      {/* Search and Category Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-8 space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              updateQueryParam('search', val);
            }}
            onClear={() => handleSearchSubmit('')}
          />

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 uppercase">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortParam}
              onChange={(e) => updateQueryParam('sort', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <CategoryFilter
            selectedCategory={categoryParam}
            onSelectCategory={(cat) => updateQueryParam('category', cat)}
          />

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{templates.length}</strong> {templates.length === 1 ? 'template' : 'templates'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content State */}
      {isLoading ? (
        <LoadingSpinner message="Fetching templates from TemplateHub..." size="lg" />
      ) : errorMessage ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-xl mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-900 mb-1">Failed to load templates</h3>
          <p className="text-sm text-rose-700 mb-4">{errorMessage}</p>
          <button
            onClick={fetchTemplates}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          title="No templates match your criteria"
          description="We couldn't find any templates matching your search filters. Try clearing your filters or searching with different keywords."
          actionText="Clear All Filters"
          onActionClick={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <TemplateCard key={tpl._id} template={tpl} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
