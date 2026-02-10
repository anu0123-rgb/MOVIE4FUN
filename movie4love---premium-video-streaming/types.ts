
export type VideoQuality = '360p' | '480p' | '720p' | '1080p';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
  tags: string[];
  uploadDate: string;
  isDownloadable: boolean;
  qualityOptions: VideoQuality[];
  views: number;
}

export interface AppState {
  videos: Video[];
  isAdmin: boolean;
}

export interface AISuggestion {
  title: string;
  description: string;
  tags: string[];
  category: string;
}
