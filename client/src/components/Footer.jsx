import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Heart, Github, Globe, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Template<span className="text-indigo-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curated marketplace of modern, responsive web application templates. Accelerate your SaaS product launches.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fullstack MERN Architecture with JWT Auth</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-white transition-colors">
                  All Templates
                </Link>
              </li>
              <li>
                <Link to="/templates?category=SaaS%20Dashboard" className="hover:text-white transition-colors">
                  SaaS Dashboards
                </Link>
              </li>
              <li>
                <Link to="/templates?category=E-commerce" className="hover:text-white transition-colors">
                  E-Commerce Kits
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">
                  Personal Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/templates?category=Portfolio" className="hover:text-white transition-colors">
                  Portfolio & Creative
                </Link>
              </li>
              <li>
                <Link to="/templates?category=Landing%20Page" className="hover:text-white transition-colors">
                  Landing Pages
                </Link>
              </li>
              <li>
                <Link to="/templates?category=Agency" className="hover:text-white transition-colors">
                  Agency & Corporate
                </Link>
              </li>
              <li>
                <Link to="/templates?category=Education" className="hover:text-white transition-colors">
                  Education & LMS
                </Link>
              </li>
              <li>
                <Link to="/templates?category=Restaurant" className="hover:text-white transition-colors">
                  Food & Hospitality
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Author Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Engineering Specs
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>React 18 + Vite + Tailwind CSS</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Node.js, Express & MongoDB Atlas</span>
              </p>
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                  Lead Developer
                </span>
                <span className="font-semibold text-white">Vishal RS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TemplateHub. Built by Vishal RS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
