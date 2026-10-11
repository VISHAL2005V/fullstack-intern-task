import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Code2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { templateService } from '../services/templateService';
import TemplateCard from '../components/TemplateCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_CARDS = [
  { name: 'Portfolio', icon: Sparkles, count: '10+ Layouts', desc: 'Personal branding & creative showcases' },
  { name: 'SaaS Dashboard', icon: TrendingUp, count: '15+ Views', desc: 'Analytics, data tables & admin charts' },
  { name: 'E-commerce', icon: Layers, count: '12+ Storefronts', desc: 'High-converting product storefronts' },
  { name: 'Landing Page', icon: Zap, count: '20+ Templates', desc: 'Launch pages, mobile app promotions' },
  { name: 'Agency', icon: Shield, count: '8+ Themes', desc: 'Consulting, digital & studio agencies' },
  { name: 'Blog', icon: Code2, count: '14+ Layouts', desc: 'Clean editorial journals & newsletters' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const res = await templateService.getTemplates({ sort: 'rating' });
        if (res.success && Array.isArray(res.data)) {
          setFeaturedTemplates(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured templates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/templates');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Over 50+ Curated SaaS & Web App Templates</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Find the Perfect Template for Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Next Big Idea
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Explore ready-to-use website templates for portfolios, businesses, dashboards, and more.
          </p>

          {/* Search bar in Hero */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-xl mx-auto relative flex items-center mb-10 shadow-lg rounded-2xl bg-white p-1.5 border border-slate-200"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g., 'Portfolio', 'Dashboard')..."
              className="w-full px-3 py-2.5 bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all duration-200"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Templates</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all duration-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Templates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Hand-picked
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Templates
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top trending architectural blueprints chosen for stellar design and UX.
            </p>
          </div>
          <Link
            to="/templates"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 group shrink-0"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading featured templates..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Categorized Library
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Browse by Category
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Target your industry specific needs with clean, pre-structured web frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/templates?category=${encodeURIComponent(cat.name)}`)}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose TemplateHub Section */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Enterprise Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Why Choose TemplateHub?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Everything you need to go from idea to production-ready web application in days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Production-Ready Code
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Handcrafted responsive layouts with semantic HTML, modern Tailwind CSS, and zero technical debt.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Personal Favorites Curation
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bookmark and manage your shortlisted templates with real-time MongoDB database persistence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Instant Component Modularity
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every template comes with decoupled navigation bars, cards, headers, and footer components.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to Launch Your Next Project?
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base mb-8 leading-relaxed">
              Join TemplateHub today to curate, bookmark, and deploy world-class templates in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/templates"
                className="px-6 py-3 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-sm border border-indigo-500/50 transition-all"
              >
                Browse All Templates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
