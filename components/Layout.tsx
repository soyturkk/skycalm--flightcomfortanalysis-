import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-calm-700 font-semibold' : 'text-slate-500 hover:text-calm-600 transition-colors';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                 <div className="bg-calm-100 p-2 rounded-full group-hover:bg-calm-200 transition-colors">
                    <svg className="w-6 h-6 text-calm-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                 </div>
                 <span className="text-xl font-medium tracking-tight text-slate-800">Sky<span className="text-calm-500">Calm</span></span>
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className={isActive('/')}>Ana Sayfa</Link>
              <Link to="/guide" className={isActive('/guide')}>Uçak Rehberi</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} SkyCalm Analiz.</p>
          <p>Yapay zeka destekli tahminlerdir. Kesin uçuş operasyon verisi yerine geçmez.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
