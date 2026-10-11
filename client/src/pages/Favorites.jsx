import React, { useState, useEffect } from 'react';
import { Heart, Compass, AlertCircle } from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import TemplateCard from '../components/TemplateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUserFavorites = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await favoriteService.getFavorites();
      if (res.success && Array.isArray(res.data)) {
        // res.data is an array of Favorite documents with populated .template
        setFavoriteItems(res.data);
      } else {
        setFavoriteItems([]);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to fetch personal favorites from server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  // Callback when a template's favorite state is toggled from within this page
  const handleFavoriteToggle = (templateId, isNowFavorited) => {
    if (!isNowFavorited) {
      // Remove item from state if unfavorited
      setFavoriteItems((prev) =>
        prev.filter((item) => (item.template?._id || item.template) !== templateId)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
          <Heart className="w-4 h-4 fill-current" />
          <span>Curated Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My Saved Favorites
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Manage your personal shortlist of web templates. Stored directly to your account.
        </p>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading your favorite templates..." size="lg" />
      ) : errorMessage ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-xl mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-900 mb-1">Unable to load favorites</h3>
          <p className="text-sm text-rose-700 mb-4">{errorMessage}</p>
          <button
            onClick={fetchUserFavorites}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            Retry
          </button>
        </div>
      ) : favoriteItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="You haven't bookmarked any website templates yet. Explore our templates and click the heart icon on any card to save it here."
          actionText="Browse Templates"
          actionLink="/templates"
        />
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">
              You have <strong className="text-slate-900">{favoriteItems.length}</strong> saved {favoriteItems.length === 1 ? 'template' : 'templates'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteItems.map((fav) => {
              const tpl = fav.template;
              if (!tpl) return null;
              return (
                <TemplateCard
                  key={tpl._id || fav._id}
                  template={tpl}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
