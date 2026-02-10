
import React, { useState } from 'react';
import { Video, VideoQuality } from '../types';
import { Plus, Trash2, Edit3, Sparkles, Loader2, Save, X, Eye, Film } from 'lucide-react';
import { m4lAI } from '../services/movie4loveAI';

interface AdminDashboardProps {
  videos: Video[];
  onAdd: (v: Video) => void;
  onUpdate: (v: Video) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ videos, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    duration: '0:00',
    category: 'General',
    tags: [],
    isDownloadable: true,
    qualityOptions: ['720p', '1080p']
  });

  const handleAISuggest = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const suggestion = await m4lAI.suggestMetadata(prompt);
      setFormData(prev => ({
        ...prev,
        title: suggestion.title,
        description: suggestion.description,
        tags: suggestion.tags,
        category: suggestion.category
      }));
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title || 'Untitled',
      description: formData.description || '',
      thumbnailUrl: formData.thumbnailUrl || `https://picsum.photos/seed/${Math.random()}/800/450`,
      videoUrl: formData.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: formData.duration || '0:00',
      category: formData.category || 'General',
      tags: formData.tags || [],
      uploadDate: new Date().toISOString(),
      isDownloadable: !!formData.isDownloadable,
      qualityOptions: formData.qualityOptions || ['720p'],
      views: 0
    };
    onAdd(newVideo);
    setIsAdding(false);
    setFormData({});
    setPrompt('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-zinc-500">Manage your library and optimize content with Movie4Love AI.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all shadow-lg hover:shadow-red-500/20"
          >
            <Plus size={20} />
            Upload New Video
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Film className="text-red-500" />
              New Video Details
            </h2>
            <button onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI Generator Section */}
            <div className="space-y-6">
              <div className="p-6 bg-red-600/5 rounded-2xl border border-red-600/10">
                <label className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 block">Movie4Love AI Content Assist</label>
                <p className="text-zinc-400 text-sm mb-4">Describe your video and let the AI generate optimized metadata for you.</p>
                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A travel vlog about exploring hidden waterfalls in Bali with 4K drone shots..."
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none h-32"
                  />
                  <button 
                    onClick={handleAISuggest}
                    disabled={isGenerating || !prompt}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-sm font-bold transition-colors"
                  >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Generate
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Video URL</span>
                  <input 
                    type="text" 
                    value={formData.videoUrl || ''} 
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Thumbnail URL</span>
                  <input 
                    type="text" 
                    value={formData.thumbnailUrl || ''} 
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors"
                  />
                </label>
              </div>
            </div>

            {/* Manual Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="col-span-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title</span>
                  <input 
                    type="text" 
                    value={formData.title || ''} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </label>
                <label className="col-span-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</span>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors h-32 resize-none"
                    required
                  />
                </label>
                <label>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</span>
                  <input 
                    type="text" 
                    value={formData.category || ''} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors"
                  />
                </label>
                <label>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration</span>
                  <input 
                    type="text" 
                    value={formData.duration || ''} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="0:00"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mt-1 outline-none focus:border-red-600 transition-colors"
                  />
                </label>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isDownloadable}
                    onChange={e => setFormData({...formData, isDownloadable: e.target.checked})}
                    className="w-5 h-5 accent-red-600"
                  />
                  <span className="text-sm font-medium">Allow Download</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors"
              >
                <Save size={20} />
                Publish Video
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold">Recent Uploads</h3>
          <span className="text-xs text-zinc-500">{videos.length} videos total</span>
        </div>
        <div className="divide-y divide-white/5">
          {videos.map(video => (
            <div key={video.id} className="p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
              <img src={video.thumbnailUrl} className="w-32 aspect-video object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{video.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.category}</span>
                  <span>•</span>
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(video.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
