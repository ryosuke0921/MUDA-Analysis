import React, { useState } from 'react';
import { VideoFile, AnalysisStatus, AnalysisResult, Language } from './types';
import { analyzeVideo } from './services/geminiService';
import VideoUploader from './components/VideoUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { TRANSLATIONS, getSystemPrompt } from './constants';
import { Loader2, PlayCircle, Settings, ChevronRight, Activity, BarChart3, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [promptContext, setPromptContext] = useState<string>("");
  const [language, setLanguage] = useState<Language>('ja');

  // Updated to a valid existing model. 
  // Using gemini-2.0-flash-exp as it is the current high-performance Flash model for multimodal tasks.
  const HARDCODED_MODEL = 'gemini-2.0-flash-exp';

  const t = TRANSLATIONS[language];

  const handleAnalyze = async () => {
    if (videos.length === 0 || !promptContext.trim()) return;
    
    setStatus(AnalysisStatus.UPLOADING); 
    
    try {
      setStatus(AnalysisStatus.ANALYZING);
      const systemPrompt = getSystemPrompt(language);
      
      const markdown = await analyzeVideo(
        videos, 
        promptContext, 
        systemPrompt,
        HARDCODED_MODEL
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
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
              <p className="text-xs text-gray-500 font-medium">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             {/* Language Selector */}
             <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setLanguage('ja')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'ja' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  JP
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'vi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  VN
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <PlayCircle className="mr-2 text-blue-600" size={20} />
                  {t.video_source}
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {videos.length} Clip{videos.length !== 1 ? 's' : ''}
                </span>
              </div>
              <VideoUploader 
                videos={videos} 
                setVideos={setVideos} 
                disabled={status === AnalysisStatus.ANALYZING || status === AnalysisStatus.UPLOADING}
                t={t}
              />
            </section>

            {/* Context Input - Moved here */}
            <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.context_label} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={promptContext}
                    onChange={(e) => setPromptContext(e.target.value)}
                    disabled={status === AnalysisStatus.ANALYZING}
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={t.context_placeholder}
                />
                <p className="mt-1 text-xs text-gray-500">{t.context_hint}</p>
            </section>

            <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-blue-900 font-semibold mb-2 flex items-center">
                 <BarChart3 size={18} className="mr-2" />
                 {t.ready_title}
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                {t.ready_desc}
              </p>
              <button
                onClick={handleAnalyze}
                disabled={videos.length === 0 || !promptContext.trim() || status === AnalysisStatus.ANALYZING}
                className={`w-full py-3 px-4 rounded-lg font-semibold shadow-md flex items-center justify-center transition-all ${
                  videos.length === 0 || !promptContext.trim() || status === AnalysisStatus.ANALYZING
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:transform active:scale-95'
                }`}
              >
                {status === AnalysisStatus.ANALYZING ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    {t.btn_analyzing}
                  </>
                ) : (
                  <>
                    {t.btn_analyze} <ChevronRight className="ml-2" size={20} />
                  </>
                )}
              </button>
              {status === AnalysisStatus.ERROR && (
                <div className="mt-3 text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-100">
                  {t.error_msg}
                </div>
              )}
            </section>
            
            {/* Guide Info */}
            <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">{t.guide_title}</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-green-500 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">{t.guide_green}</span>
                            <p className="text-gray-500">{t.guide_green_desc}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-yellow-400 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">{t.guide_yellow}</span>
                            <p className="text-gray-500">{t.guide_yellow_desc}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="w-3 h-3 rounded-full bg-red-500 mt-1 mr-3 flex-shrink-0"></span>
                        <div>
                            <span className="font-bold text-gray-900">{t.guide_red}</span>
                            <p className="text-gray-500">{t.guide_red_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 h-full flex flex-col">
            {result ? (
               <AnalysisDisplay result={result} t={t} />
            ) : (
                <div className="h-full bg-white border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{t.no_analysis_title}</h3>
                    <p className="max-w-xs mt-2 text-gray-500">{t.no_analysis_desc}</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;