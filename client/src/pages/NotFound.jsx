import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertOctagon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg bg-white p-10 rounded-3xl border border-slate-200/80 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <span className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 mb-2 block">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The page or template you are looking for doesn't exist, has been removed, or has been relocated to another address.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
