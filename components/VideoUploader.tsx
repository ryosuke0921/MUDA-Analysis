import React, { useCallback } from 'react';
import { Upload, X, Film, AlertCircle } from 'lucide-react';
import { VideoFile } from '../types';
import { checkFileSize } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface VideoUploaderProps {
  videos: VideoFile[];
  setVideos: React.Dispatch<React.SetStateAction<VideoFile[]>>;
  disabled: boolean;
  t: typeof TRANSLATIONS['en'];
}

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject("Invalid video");
    };
    video.src = window.URL.createObjectURL(file);
  });
};

const VideoUploader: React.FC<VideoUploaderProps> = ({ videos, setVideos, disabled, t }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: VideoFile[] = [];
      const errorMessages: string[] = [];

      const fileList = Array.from(event.target.files);

      for (const file of fileList) {
        if (!file.type.startsWith('video/')) continue;
        
        // 1. Check File Size (200MB)
        if (!checkFileSize(file)) {
          errorMessages.push(`${file.name}: Exceeds 200MB size limit`);
          continue;
        }

        // 2. Check Duration (10 minutes = 600 seconds)
        try {
          const duration = await getVideoDuration(file);
          if (duration > 600) {
            errorMessages.push(`${file.name}: Exceeds 10 minute duration limit`);
            continue;
          }
        } catch (e) {
          errorMessages.push(`${file.name}: Could not verify video duration`);
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        newFiles.push({ file, previewUrl });
      }

      if (errorMessages.length > 0) {
        alert(`${t.alert_size_limit}\n${errorMessages.join('\n')}`);
      }

      if (newFiles.length > 0) {
        setVideos(prev => [...prev, ...newFiles]);
      }
      
      // Reset input
      event.target.value = '';
    }
  }, [setVideos, t]);

  const removeVideo = (index: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      URL.revokeObjectURL(newVideos[index].previewUrl);
      newVideos.splice(index, 1);
      return newVideos;
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
        disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'bg-white border-blue-200 hover:border-blue-400 cursor-pointer'
      }`}>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t.drop_text}</h3>
          <p className="text-sm text-gray-500 mt-2">{t.browse_text} ({t.limit_text})</p>
          <div className="mt-4 flex items-center text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <AlertCircle size={14} className="mr-1.5" />
            <span>{t.browser_limit_alert}</span>
          </div>
        </div>
      </div>

      {/* File List */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="relative group bg-white border border-gray-200 rounded-lg p-3 flex flex-col shadow-sm">
              <div className="relative aspect-video bg-gray-900 rounded-md overflow-hidden mb-3">
                <video 
                  src={video.previewUrl} 
                  className="w-full h-full object-contain" 
                  controls 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  <Film size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate" title={video.file.name}>
                    {video.file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeVideo(index)}
                  disabled={disabled}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {(video.file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;