
import React from 'react';
import { Video } from '../types';
import { Play } from 'lucide-react';

interface HomePageProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

const HomePage: React.FC<HomePageProps> = ({ videos, onVideoClick }) => {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden mb-12 h-[500px] group cursor-pointer" onClick={() => videos[0] && onVideoClick(videos[0])}>
        <img 
          src={videos[0]?.thumbnailUrl || "https://picsum.photos/seed/hero/1600/900"} 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-600 text-xs font-bold uppercase rounded-full tracking-widest">Featured</span>
            <span className="text-zinc-400 text-sm">Newly added</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-none">
            {videos[0]?.title || "Discover Modern Cinema"}
          </h1>
          <p className="text-lg text-zinc-300 mb-8 line-clamp-2">
            {videos[0]?.description || "Curated collection of high-quality visuals for your next inspiration."}
          </p>
          <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors">
            <Play size={24} fill="black" />
            Watch Now
          </button>
        </div>
      </section>

      {/* Grid */}
      <h2 className="text-2xl font-bold mb-8">Trending Now</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(video => (
          <div 
            key={video.id} 
            className="group cursor-pointer"
            onClick={() => onVideoClick(video)}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-900 shadow-lg">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                  <Play size={20} fill="white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-bold">
                {video.duration}
              </div>
            </div>
            <h3 className="font-bold text-zinc-100 group-hover:text-red-500 transition-colors line-clamp-1">{video.title}</h3>
            <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
