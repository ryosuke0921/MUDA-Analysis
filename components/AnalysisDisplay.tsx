import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult } from '../types';
import { Clock, CheckCircle2, AlertTriangle, XCircle, FileText, Download, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  t: typeof TRANSLATIONS['en'];
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, t }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!result) return null;

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    // @ts-ignore
    if (typeof window.html2pdf === 'undefined') {
      console.error("html2pdf library not loaded");
      alert("PDF library is not loaded. Please refresh the page.");
      return;
    }

    setIsGeneratingPdf(true);
    const element = contentRef.current;
    
    // Clone the element to remove scrollbars and ensure full height capture
    // This allows us to capture the entire report even if it's currently scrolled or clipped
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.overflow = 'visible';
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.width = '100%';
    
    // Create a temporary container off-screen
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '800px'; // Fixed width for A4 consistency
    container.style.backgroundColor = '#ffffff';
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     `TPS-Analysis-${new Date().toISOString().slice(0,10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: false, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(clone).save();
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      document.body.removeChild(container);
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <h2 className="font-semibold text-gray-900">{t.report_title}</h2>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="ml-3 flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF Report"
            >
              {isGeneratingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>PDF</span>
            </button>
        </div>
        <span className="text-xs text-gray-400">
            {new Date(result.timestamp).toLocaleString()}
        </span>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow" ref={contentRef}>
        <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
            {!result.markdown ? (
                <p className="text-gray-500 italic">No detailed analysis text available.</p>
            ) : (
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3 flex items-center" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg shadow-sm"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                        thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                        th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                        td: ({node, ...props}) => <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 border-t border-gray-100" {...props} />,
                        // Custom styling for specific keywords in the text
                        strong: ({node, children, ...props}) => {
                            // Safely convert children to string for checking content
                            let text = "";
                            try {
                                if (typeof children === 'string') text = children;
                                else if (Array.isArray(children)) text = children.map(c => typeof c === 'string' ? c : '').join('');
                                else text = String(children);
                            } catch (e) { text = ""; }
                            
                            // Value Added / 正味作業
                            if (
                              text.includes('正味作業') || 
                              text.includes('Main Work') || 
                              text.includes('Value Added') ||
                              text.includes('Công việc chính') ||
                              text.includes('Gia tăng giá trị')
                            ) {
                              return <span className="inline-flex items-center font-bold text-green-700 bg-green-50 px-1 rounded"><CheckCircle2 size={14} className="mr-1"/>{children}</span>;
                            }

                            // Incidental Work / 付随作業
                            if (
                              text.includes('付随作業') || 
                              text.includes('Incidental') ||
                              text.includes('Công việc phụ')
                            ) {
                              return <span className="inline-flex items-center font-bold text-yellow-700 bg-yellow-50 px-1 rounded"><AlertTriangle size={14} className="mr-1"/>{children}</span>;
                            }

                            // Waste / ムダ
                            if (
                              text.includes('ムダ') || 
                              text.includes('Waste') ||
                              text.includes('Muda') ||
                              text.includes('Lãng phí')
                            ) {
                              return <span className="inline-flex items-center font-bold text-red-700 bg-red-50 px-1 rounded"><XCircle size={14} className="mr-1"/>{children}</span>;
                            }

                            return <strong className="font-semibold text-gray-900" {...props}>{children}</strong>;
                        },
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-700" {...props} />,
                        li: ({node, ...props}) => <li className="ml-4" {...props} />
                    }}
                >
                    {result.markdown}
                </ReactMarkdown>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;