import React, { useState } from 'react';

interface ResultDisplayProps {
  text: string;
  image: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, image, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Source Image */}
        <div className="bg-slate-800 p-2 rounded-xl shadow-lg border border-slate-700">
            <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Source Image</div>
            <img 
                src={image} 
                alt="Captured" 
                className="w-full h-48 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity" 
            />
        </div>

        {/* Extracted Text */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-slate-700">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Detected Text</div>
            <button 
              onClick={handleCopy}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4">
            <textarea 
                readOnly 
                value={text} 
                className="w-full h-64 bg-transparent border-none text-slate-200 focus:ring-0 resize-none font-mono text-sm leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <button 
          onClick={onReset}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Scan Another Image</span>
        </button>
      </div>
    </div>
  );
};