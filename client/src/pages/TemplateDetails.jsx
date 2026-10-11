import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';
import { templateService } from '../services/templateService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();

  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setErrorStatus(null);
      try {
        const res = await templateService.getTemplateById(id);
        if (res.success && res.data) {
          setTemplate(res.data);
          setImageSrc(res.data.thumbnail_url || DEFAULT_IMAGE);
        } else {
          setErrorStatus('not_found');
        }
      } catch (err) {
        console.error('Failed to load template:', err);
        setErrorStatus(err.response?.status === 404 ? 'not_found' : 'server_error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const favorited = template ? isFavorite(template._id) : false;

  const handleFavoriteClick = async () => {
    if (!template || isToggling) return;
    setIsToggling(true);
    try {
      const res = await toggleFavorite(template._id);
      if (res?.requiresAuth) {
        navigate('/login', { state: { from: { pathname: `/templates/${template._id}` } } });
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Template link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading template details..." size="lg" />
      </div>
    );
  }

  if (errorStatus === 'not_found') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Template Not Found"
          description="The template you requested does not exist or may have been removed."
          actionText="Back to Templates"
          actionLink="/templates"
        />
      </div>
    );
  }

  if (errorStatus === 'server_error' || !template) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Error Loading Template"
          description="There was a server issue retrieving the template. Please verify your connection."
          actionText="Return to Catalog"
          actionLink="/templates"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/templates"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Templates</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Thumbnail & Visual Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg bg-white">
            <div className="aspect-[16/10] w-full relative bg-slate-100 overflow-hidden">
              <img
                src={imageSrc}
                alt={template.name}
                onError={() => setImageSrc(DEFAULT_IMAGE)}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified MERN Compatible Clean Architecture
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Key Features Breakdown */}
          {template.features && template.features.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Included Key Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {template.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Template Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                {template.category}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{template.rating ? template.rating.toFixed(1) : '4.9'} / 5.0</span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {template.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {template.price === 0 ? 'Free' : `₹${template.price || 29}`}
                </span>
                <span className="text-xs text-slate-400 font-medium">One-time commercial license</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-5">
              {template.description}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleFavoriteClick}
                disabled={isToggling}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm ${
                  favorited
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-current text-rose-500' : ''}`} />
                <span>{favorited ? 'In Your Favorites' : 'Add to Favorites'}</span>
              </button>

              <Link
                to={`/templates/${template._id}/demo`}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Live Interactive Demo</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Metadata specs */}
            <div className="pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-400">Architecture</span>
                <span className="font-semibold text-slate-800">React 18 + Tailwind CSS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-400">Database Ready</span>
                <span className="font-semibold text-slate-800">MongoDB Atlas Compatible</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-400">Published Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(template.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetails;
