
import React, { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import AdminDashboard from './pages/AdminDashboard';
import { useStore } from './store/useStore';
import { Video } from './types';
import { Lock, ShieldAlert } from 'lucide-react';

type Page = 'home' | 'watch' | 'admin' | 'admin-login';

const App: React.FC = () => {
  const { videos, isAdmin, addVideo, updateVideo, deleteVideo, loginAdmin, logoutAdmin } = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setCurrentPage('watch');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminPassword)) {
      setCurrentPage('admin');
      setAdminPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage videos={videos} onVideoClick={handleVideoSelect} />;
      case 'watch':
        return selectedVideo ? (
          <WatchPage 
            video={selectedVideo} 
            onRelatedClick={handleVideoSelect} 
            allVideos={videos} 
          />
        ) : <HomePage videos={videos} onVideoClick={handleVideoSelect} />;
      case 'admin-login':
        return (
          <div className="max-w-md mx-auto mt-24 px-6 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-zinc-500 mb-8">Enter the secret key to manage Movie4Love.</p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password"
                placeholder="Admin Key"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full bg-zinc-900 border ${loginError ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-4 text-center focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
              />
              {loginError && <p className="text-red-500 text-sm">Access Denied. Incorrect key.</p>}
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20"
              >
                Authenticate
              </button>
            </form>
            <p className="mt-8 text-xs text-zinc-600 uppercase tracking-widest font-bold">
              Protected by Movie4Love Security
            </p>
          </div>
        );
      case 'admin':
        if (!isAdmin) {
          setCurrentPage('admin-login');
          return null;
        }
        return (
          <AdminDashboard 
            videos={videos} 
            onAdd={addVideo} 
            onUpdate={updateVideo} 
            onDelete={deleteVideo} 
          />
        );
      default:
        return <HomePage videos={videos} onVideoClick={handleVideoSelect} />;
    }
  };

  return (
    <Layout 
      isAdmin={isAdmin}
      onLogout={() => { logoutAdmin(); setCurrentPage('home'); }}
      onAdminClick={() => setCurrentPage(isAdmin ? 'admin' : 'admin-login')}
      onHomeClick={() => setCurrentPage('home')}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
