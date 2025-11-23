import React, { useState, useCallback } from 'react';
import { CameraView } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { extractTextFromImage } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageData, setImageData] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCamera = () => {
    setAppState(AppState.CAMERA);
    setErrorMessage(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        processImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = useCallback((base64: string) => {
    processImage(base64);
  }, []);

  const processImage = async (base64Data: string) => {
    setImageData(base64Data);
    setAppState(AppState.PROCESSING);

    try {
      // Assuming JPEG for camera captures, but works for uploaded PNGs too if Data URL contains mime
      const mimeType = base64Data.split(';')[0].split(':')[1] || 'image/jpeg';
      const text = await extractTextFromImage(base64Data, mimeType);
      
      setExtractedText(text);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to extract text. Please try again.");
      setAppState(AppState.IDLE);
    }
  };

  const resetApp = () => {
    setImageData(null);
    setExtractedText("");
    setAppState(AppState.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            LensText AI
          </h1>
        </div>
        {/* Simple Github or Help icon could go here */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        
        {/* State: IDLE (Home Screen) */}
        {appState === AppState.IDLE && (
          <div className="w-full max-w-md p-6 flex flex-col space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-100">Scan & Extract</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Extract text instantly from documents, signs, or screens using Gemini Vision AI.
              </p>
            </div>

            <div className="space-y-4">
              {/* Camera Button */}
              <button 
                onClick={startCamera}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 group"
              >
                <div className="p-2 bg-blue-700/50 rounded-full group-hover:bg-blue-600/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </div>
                <span className="font-semibold text-lg">Use Camera</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase font-medium">Or upload file</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Upload Button */}
              <label className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 border-dashed hover:border-slate-500 cursor-pointer transition-all flex items-center justify-center space-x-3 group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-2 bg-slate-900 rounded-full group-hover:bg-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <span className="font-medium">Upload Image</span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm text-center">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* State: CAMERA */}
        {appState === AppState.CAMERA && (
          <CameraView 
            onCapture={handleCameraCapture} 
            onCancel={() => setAppState(AppState.IDLE)} 
          />
        )}

        {/* State: PROCESSING */}
        {appState === AppState.PROCESSING && imageData && (
          <div className="flex flex-col items-center justify-center space-y-6 p-8 animate-pulse">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Analyzing Image...</h3>
                <p className="text-slate-400">Gemini AI is reading text from the image.</p>
            </div>
            <img 
              src={imageData} 
              alt="Processing" 
              className="w-32 h-32 object-cover rounded-lg border border-slate-700 opacity-50 blur-[1px]" 
            />
          </div>
        )}

        {/* State: RESULT */}
        {appState === AppState.RESULT && imageData && (
          <ResultDisplay 
            text={extractedText} 
            image={imageData} 
            onReset={resetApp} 
          />
        )}
      </main>
    </div>
  );
};

export default App;