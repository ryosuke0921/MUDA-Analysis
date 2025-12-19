import React, { useState } from 'react';
import { VideoFile, AnalysisStatus, AnalysisResult, TpsConfig } from './types';
import { analyzeVideo } from './services/geminiService';
import VideoUploader from './components/VideoUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { DEFAULT_TPS_PROMPT, GEMINI_MODELS } from './constants';
import { Loader2, PlayCircle, Settings, ChevronRight, Activity, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [promptContext, setPromptContext] = useState<string>("A4サイズ製品のプレス工程です。この作業のムダを分析してください。");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0].value);

  const handleAnalyze = async () => {
    if (videos.length === 0) return;
    
    setStatus(AnalysisStatus.UPLOADING); // We don't really have a separate upload phase for inline, but logically
    
    try {
      setStatus(AnalysisStatus.ANALYZING);
      const markdown = await analyzeVideo(
        videos, 
        promptContext, 
        DEFAULT_TPS_PROMPT,
        selectedModel
      );
      
      setResult({
        markdown,
        timestamp: Date.now()
      });
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">TPS Kaizen AI</h1>
              <p className="text-xs text-gray-500 font-medium">Video Waste Analysis System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Settings Panel */}
        {showSettings && (
           <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-fade-in-down">
             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
               <Settings size={16} className="mr-2" /> Analysis Configuration
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Context
                  </label>
                  <textarea
                    value={promptContext}
                    onChange={(e) => setPromptContext(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Describe what is happening in the video (e.g., 'Worker assembling engine part A')..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Provide specific context to help the AI identify Value-Added work.</p>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {GEMINI_MODELS.map(model => (
                      <option key={model.value} value={model.value}>{model.label}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Flash 2.5 is faster. Pro 1.5 offers deeper reasoning for complex movements.
                  </p>
               </div>
             </div>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <PlayCircle className="mr-2 text-blue-600" size={20} />
                  Video Source
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {videos.length} Clip{videos.length !== 1 ? 's' : ''}
                </span>
              </div>
              <VideoUploader 
                videos={videos} 
                setVideos={setVideos} 
                disabled={status === AnalysisStatus.ANALYZING || status === AnalysisStatus.UPLOADING} 
              />
            </section>

            <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-blue-900 font-semibold mb-2 flex items-center">
                 <BarChart3 size={18} className="mr-2" />
                 Ready to Analyze?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                The AI will analyze the uploaded footage for 3 types of motion: <span className="font-bold">Main Work</span>, <span className="font-bold">Incidental Work</span>, and <span className="font-bold">Waste</span>.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={videos.length === 0 || status === AnalysisStatus.ANALYZING}
                className={`w-full py-3 px-4 rounded-lg font-semibold shadow-md flex items-center justify-center transition-all ${
                  videos.length === 0 || status === AnalysisStatus.ANALYZING
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:transform active:scale-95'
                }`}
              >
                {status === AnalysisStatus.ANALYZING ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Analyzing Process...
                  </>
                ) : (
                  <>
                    Run TPS Analysis <ChevronRight className="ml-2" size={20} />
                  </>
                )}
              </button>
              {status === AnalysisStatus.ERROR && (
                <div className="mt-3 text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-100">
                  Analysis failed. Please check your API key or try a shorter video.
                </div>
              )}
            </section>
            
            {/* Guide Info */}
            <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">TPS Muda Classification</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-green-500 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">Value Added (Net Work)</span>
                            <p className="text-gray-500">Directly changes product shape or quality.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-yellow-400 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">Incidental Work</span>
                            <p className="text-gray-500">Necessary but adds no value (e.g., reaching, holding).</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-red-500 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">Waste (Muda)</span>
                            <p className="text-gray-500">Unnecessary motion, waiting, or searching.</p>
                        </div>
                    </div>
                </div>
            </section>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 h-full flex flex-col">
            {result ? (
               <AnalysisDisplay result={result} />
            ) : (
                <div className="h-full bg-white border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Analysis Yet</h3>
                    <p className="max-w-xs mt-2 text-gray-500">Upload a video and start the analysis to see the TPS breakdown and improvement suggestions.</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;