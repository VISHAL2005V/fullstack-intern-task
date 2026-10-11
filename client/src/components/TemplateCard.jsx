import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

const TemplateCard = ({ template, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();
  const [imageSrc, setImageSrc] = useState(template.thumbnail_url || DEFAULT_IMAGE);
  const [isToggling, setIsToggling] = useState(false);

  const favorited = isFavorite(template._id);

  const handleCardClick = () => {
    navigate(`/templates/${template._id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // CRITICAL: Prevent navigating to template details
    if (isToggling) return;

    setIsToggling(true);
    try {
      const res = await toggleFavorite(template._id);
      if (res?.requiresAuth) {
        navigate('/login', { state: { from: { pathname: `/templates/${template._id}` } } });
      } else if (onFavoriteToggle) {
        onFavoriteToggle(template._id, !favorited);
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 cursor-pointer overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1.5"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={template.name}
          onError={() => setImageSrc(DEFAULT_IMAGE)}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/50">
            {template.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isToggling}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md ${
            favorited
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105 shadow-rose-200'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              favorited ? 'fill-current scale-110' : ''
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-md">
            View Details <ArrowRight className="w-3 h-3 text-indigo-600" />
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {template.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{template.rating ? template.rating.toFixed(1) : '4.9'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {template.description}
          </p>
        </div>

        {/* Footer info: tags & price */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Responsive Layout</span>
          </div>

          <span className="font-extrabold text-sm text-slate-900">
            {template.price === 0 ? 'Free' : `₹${template.price || 29}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
