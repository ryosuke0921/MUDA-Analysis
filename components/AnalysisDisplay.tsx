import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult } from '../types';
import { Clock, CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <h2 className="font-semibold text-gray-900">Analysis Report</h2>
        </div>
        <span className="text-xs text-gray-400">
            {new Date(result.timestamp).toLocaleString()}
        </span>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
        <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
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
                        const text = String(children);
                        if (text.includes('正味作業') || text.includes('Main Work')) return <span className="inline-flex items-center font-bold text-green-700 bg-green-50 px-1 rounded"><CheckCircle2 size={14} className="mr-1"/>{children}</span>;
                        if (text.includes('付随作業') || text.includes('Incidental')) return <span className="inline-flex items-center font-bold text-yellow-700 bg-yellow-50 px-1 rounded"><AlertTriangle size={14} className="mr-1"/>{children}</span>;
                        if (text.includes('ムダ') || text.includes('Waste')) return <span className="inline-flex items-center font-bold text-red-700 bg-red-50 px-1 rounded"><XCircle size={14} className="mr-1"/>{children}</span>;
                        return <strong className="font-semibold text-gray-900" {...props}>{children}</strong>;
                    },
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-700" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4" {...props} />
                }}
            >
                {result.markdown}
            </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;