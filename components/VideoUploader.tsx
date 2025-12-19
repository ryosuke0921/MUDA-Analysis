import React, { useCallback } from 'react';
import { Upload, X, Film, AlertCircle } from 'lucide-react';
import { VideoFile } from '../types';
import { checkFileSize } from '../services/geminiService';

interface VideoUploaderProps {
  videos: VideoFile[];
  setVideos: React.Dispatch<React.SetStateAction<VideoFile[]>>;
  disabled: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ videos, setVideos, disabled }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: VideoFile[] = [];
      const skippedFiles: string[] = [];

      Array.from(event.target.files).forEach((item) => {
        const file = item as File;
        if (!file.type.startsWith('video/')) {
          return;
        }
        if (!checkFileSize(file)) {
          skippedFiles.push(file.name);
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        newFiles.push({ file, previewUrl });
      });

      if (skippedFiles.length > 0) {
        alert(`Some files were skipped because they exceed the browser upload limit (20MB):\n${skippedFiles.join('\n')}`);
      }

      setVideos(prev => [...prev, ...newFiles]);
      // Reset input
      event.target.value = '';
    }
  }, [setVideos]);

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
          <h3 className="text-lg font-medium text-gray-900">Drop manufacturing videos here</h3>
          <p className="text-sm text-gray-500 mt-2">or click to browse (Max 20MB per file)</p>
          <div className="mt-4 flex items-center text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <AlertCircle size={14} className="mr-1.5" />
            <span>Browser-limit: Short clips only</span>
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