
import React, { useEffect } from 'react';
import { Video } from '../types';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import { Download, Share2, Heart, MessageSquare } from 'lucide-react';

interface WatchPageProps {
  video: Video;
  onRelatedClick: (video: Video) => void;
  allVideos: Video[];
}

const WatchPage: React.FC<WatchPageProps> = ({ video, onRelatedClick, allVideos }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [video]);

  const related = allVideos.filter(v => v.id !== video.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <CustomVideoPlayer 
          src={video.videoUrl} 
          title={video.title} 
          isDownloadable={video.isDownloadable}
          qualities={video.qualityOptions}
        />

        <div className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">{video.title}</h1>
              <div className="flex items-center gap-4 text-zinc-500 text-sm">
                <span>{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>Uploaded {new Date(video.uploadDate).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">{video.category}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition-colors">
                <Heart size={18} /> Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition-colors">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-red-500" />
              Description
            </h3>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
            <div className="flex gap-2 mt-6">
              {video.tags.map(tag => (
                <span key={tag} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Up Next */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold flex items-center justify-between">
          Up Next
          <span className="text-xs text-zinc-500 font-normal">Autoplay ON</span>
        </h2>
        {related.length > 0 ? (
          related.map(item => (
            <div 
              key={item.id}
              onClick={() => onRelatedClick(item)}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="relative w-40 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                <img src={item.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-[8px] font-bold">
                  {item.duration}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{item.views.toLocaleString()} views</p>
                <div className="mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500">
            No related videos found
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
