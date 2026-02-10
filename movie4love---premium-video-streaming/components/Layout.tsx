
import React from 'react';
import { Film, User, LogOut, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  onLogout?: () => void;
  onAdminClick?: () => void;
  onHomeClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin, onLogout, onAdminClick, onHomeClick }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Film size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">MOVIE<span className="text-red-600">4</span>LOVE</span>
        </div>

        <nav className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <button 
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Admin Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={onAdminClick}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <User size={20} />
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black border-t border-white/5 p-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-bold tracking-tighter">MOVIE<span className="text-red-600">4</span>LOVE</div>
            <p className="text-zinc-500 text-sm">Experience cinema like never before.</p>
          </div>
          <div className="flex gap-8 text-zinc-500 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">API</a>
          </div>
          <div className="text-zinc-600 text-xs">
            Powered by Movie4Love AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
