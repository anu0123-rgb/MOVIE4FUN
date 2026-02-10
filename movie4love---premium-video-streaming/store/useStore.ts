
import { useState, useEffect } from 'react';
import { Video } from '../types';

const STORAGE_KEY = 'm4l_videos_v1';
const ADMIN_SESSION_KEY = 'm4l_admin_session';

// Sample initial data
const INITIAL_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Cinematic Mountain Heights',
    description: 'Breathtaking 4K footage of the Swiss Alps at sunrise.',
    thumbnailUrl: 'https://picsum.photos/seed/mountain/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '9:56',
    category: 'Nature',
    tags: ['nature', '4k', 'cinematic'],
    uploadDate: new Date().toISOString(),
    isDownloadable: true,
    qualityOptions: ['720p', '1080p'],
    views: 1240
  },
  {
    id: '2',
    title: 'The Future of Motion Design',
    description: 'Exploring how AI is changing the landscape of digital animation.',
    thumbnailUrl: 'https://picsum.photos/seed/design/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '10:53',
    category: 'Technology',
    tags: ['tech', 'design', 'future'],
    uploadDate: new Date().toISOString(),
    isDownloadable: false,
    qualityOptions: ['480p', '720p'],
    views: 850
  }
];

export const useStore = () => {
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, [videos]);

  const addVideo = (video: Video) => {
    setVideos(prev => [video, ...prev]);
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const updateVideo = (updatedVideo: Video) => {
    setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
  };

  const loginAdmin = (password: string) => {
    // In a real app, this would be a proper backend check
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return {
    videos,
    isAdmin,
    addVideo,
    deleteVideo,
    updateVideo,
    loginAdmin,
    logoutAdmin
  };
};
