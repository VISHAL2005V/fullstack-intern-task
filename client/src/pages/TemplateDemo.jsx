import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Laptop,
  Tablet,
  Smartphone,
  Heart,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Layers,
  CheckCircle2,
  Calendar,
  Star,
  Plus,
  Minus,
  X,
  CreditCard,
  Send,
} from 'lucide-react';
import { templateService } from '../services/templateService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TemplateDemo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();

  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState('all');

  // Interactive Demo States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [clapCount, setClapCount] = useState(42);
  const [reservation, setReservation] = useState({ date: '', time: '19:00', guests: '2' });

  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        const res = await templateService.getTemplateById(id);
        if (res.success && res.data) {
          setTemplate(res.data);
        }
      } catch (err) {
        console.error('Failed to load demo template:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const favorited = template ? isFavorite(template._id) : false;

  const handleFavoriteClick = async () => {
    if (!template) return;
    const res = await toggleFavorite(template._id);
    if (res?.requiresAuth) {
      navigate('/login', { state: { from: { pathname: `/templates/${template._id}/demo` } } });
    }
  };

  const addToCartDemo = (productName, price) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === productName);
      if (existing) {
        return prev.map((item) =>
          item.name === productName ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name: productName, price, qty: 1 }];
    });
    toast.success(`Added "${productName}" to demo cart!`, { id: 'demo-cart' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Preparing interactive live template demo..." size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Template Demo Not Found</h2>
        <Link
          to="/templates"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const containerWidthClass = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[deviceView];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Notice Banner: Demo Purpose Only */}
      <div className="bg-gradient-to-r from-amber-600 via-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-sm text-center">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          DEMO PURPOSE ONLY — This live interactive sandbox is for evaluation and preview purposes only.
        </span>
      </div>

      {/* Top Preview Control Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to={`/templates/${template._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Details</span>
          </Link>

          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {template.category}
            </span>
            <h1 className="text-sm font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">
              {template.name}
            </h1>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              deviceView === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Laptop className="w-4 h-4" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              deviceView === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              deviceView === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white">
            {template.price === 0 ? 'Free' : `₹${template.price || 29}`}
          </span>

          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl transition-all ${
              favorited
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-rose-400'
            }`}
            title={favorited ? 'In Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-950">
        <div
          className={`${containerWidthClass} bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 transition-all duration-300 flex flex-col min-h-[750px]`}
        >
          {/* Simulated Browser Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-[11px] text-slate-500 font-mono truncate">
              https://demo.templatehub.local/{template.category.toLowerCase().replace(/\s+/g, '-')}/preview
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Demo Purpose Only
            </span>
          </div>

          {/* Interactive Dynamic Template Content Based on Category */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Category: Portfolio */}
            {template.category === 'Portfolio' && (
              <div className="p-8 sm:p-12 space-y-12">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    Senior UI/UX Designer & Frontend Developer
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 leading-tight">
                    Crafting Clean Digital Products & High-Performance Web Apps
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Specialized in modern SaaS systems, design tokens, and reactive customer experiences. Available for freelance architecture and product design contracts.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toast.success('Demo contact inquiry triggered!')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
                    >
                      Book Free Discovery Call
                    </button>
                    <button
                      onClick={() => toast.success('Resume downloaded (Demo simulation)!')}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                    >
                      Download Resume PDF
                    </button>
                  </div>
                </div>

                {/* Portfolio Works Grid */}
                <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Featured Projects</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: 'Fintech Mobile Banking App', tag: 'iOS & Android', stats: '2.4M Users' },
                      { title: 'Cloud Automation Dashboard', tag: 'Next.js & Tailwind', stats: '99.9% Uptime' },
                      { title: 'AI Marketing Copy Studio', tag: 'SaaS Platform', stats: '$1.2M ARR' },
                      { title: 'E-commerce Brand Identity', tag: 'Shopify Plus', stats: '4.9 Star Rating' },
                    ].map((proj, i) => (
                      <div
                        key={i}
                        onClick={() => toast.success(`Viewing details for ${proj.title} (Demo)`)}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 cursor-pointer transition-all hover:-translate-y-1"
                      >
                        <div className="aspect-video bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-xl mb-4 flex items-center justify-center text-indigo-500 font-bold text-sm">
                          {proj.title} Mockup Preview
                        </div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {proj.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{proj.stats}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Category: SaaS Dashboard */}
            {template.category === 'SaaS Dashboard' && (
              <div className="p-6 sm:p-10 space-y-8 bg-slate-50/50 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Analytics Overview</h2>
                    <p className="text-xs text-slate-500">Live system performance and revenue metrics</p>
                  </div>
                  <button
                    onClick={() => toast.success('Demo analytics report exported as CSV!')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm"
                  >
                    Export Real-time CSV
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Monthly Recurring Revenue</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">₹4,82,500</div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Active Subscribers</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">1,284</div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5" /> +12 new today
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Server Response Time</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">42 ms</div>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-2">
                      <Sparkles className="w-3.5 h-3.5" /> Optimal health (99.98%)
                    </span>
                  </div>
                </div>

                {/* Recent Activities Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Recent Customer Transactions</h3>
                    <span className="text-xs text-slate-400">Showing last 4 transactions</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Plan</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: 'Sarah Jenkins', email: 'sarah@stripe.com', plan: 'Enterprise', amount: '₹14,999', status: 'Completed' },
                          { name: 'Arjun Mehta', email: 'arjun@techpulse.in', plan: 'Pro Business', amount: '₹4,999', status: 'Completed' },
                          { name: 'Elena Rostova', email: 'elena@berlin.io', plan: 'Starter', amount: '₹1,999', status: 'Completed' },
                          { name: 'Marcus Chen', email: 'marcus@startup.co', plan: 'Pro Business', amount: '₹4,999', status: 'Pending' },
                        ].map((tx, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{tx.name}</div>
                              <div className="text-slate-400 text-[11px]">{tx.email}</div>
                            </td>
                            <td className="p-3.5 font-medium">{tx.plan}</td>
                            <td className="p-3.5 font-bold text-slate-900">{tx.amount}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  tx.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Category: E-commerce */}
            {template.category === 'E-commerce' && (
              <div className="p-8 space-y-8 flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Modern Storefront Catalog</h2>
                    <p className="text-xs text-slate-500">Premium apparel & accessories collection</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: 'Minimalist Merino Wool Sweater', price: 3499, tag: 'Bestseller' },
                    { name: 'Water-resistant City Backpack', price: 4999, tag: 'New Arrival' },
                    { name: 'Analog Minimalist Watch', price: 7999, tag: 'Limited Edition' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                      <div className="aspect-square bg-slate-100 rounded-xl mb-3 flex items-center justify-center font-bold text-slate-400 text-xs">
                        {item.name} Image
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                          {item.tag}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1 mb-1">{item.name}</h4>
                        <div className="font-extrabold text-slate-900 text-base mb-3">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => addToCartDemo(item.name, item.price)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Drawer Modal */}
                {isCartOpen && (
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
                      <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <h3 className="font-bold text-slate-900 text-lg">Your Demo Cart</h3>
                          <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="py-4 space-y-3 overflow-y-auto max-h-[60vh]">
                          {cart.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8">Your cart is currently empty</p>
                          ) : (
                            cart.map((c, i) => (
                              <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                                <div>
                                  <div className="font-bold text-slate-800">{c.name}</div>
                                  <div className="text-slate-400">Qty: {c.qty} × ₹{c.price.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="font-bold text-slate-900">₹{(c.qty * c.price).toLocaleString('en-IN')}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                          <span>Total</span>
                          <span>₹{cart.reduce((sum, item) => sum + item.qty * item.price, 0).toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={() => {
                            toast.success('Simulated demo checkout order placed successfully!');
                            setCart([]);
                            setIsCartOpen(false);
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
                        >
                          Checkout (Demo Simulation)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other categories (Landing Page, Blog, Restaurant, Education, Agency) fallback interactive views */}
            {['Landing Page', 'Blog', 'Restaurant', 'Education', 'Agency', 'Other'].includes(template.category) && (
              <div className="p-8 sm:p-12 space-y-10 flex-1">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    {template.category} Template Blueprint
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
                    {template.name}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Interactive Demo Module */}
                <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 max-w-xl mx-auto text-center space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Interactive Component Sandbox</h3>
                  <p className="text-xs text-slate-600">
                    Test live template interactions: click actions, toggle responsive views, or trigger simulated flows.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setClapCount((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:border-indigo-300"
                    >
                      👏 Like / Upvote ({clapCount})
                    </button>

                    <button
                      onClick={() => toast.success('Demo interactive action executed successfully!')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700"
                    >
                      Trigger Primary Action
                    </button>
                  </div>
                </div>

                {/* Features Checklist */}
                {template.features && template.features.length > 0 && (
                  <div className="border-t border-slate-100 pt-8 max-w-2xl mx-auto">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Live Template Capabilities:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {template.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDemo;
