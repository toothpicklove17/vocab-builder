
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, TextIcon } from './icons';

interface InputViewProps {
  onTextSubmit: (text: string) => void;
  onImageSubmit: (file: File) => void;
  isLoading: boolean;
}

type InputMode = 'text' | 'image';

export const InputView: React.FC<InputViewProps> = ({ onTextSubmit, onImageSubmit, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onImageSubmit(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setFileName(file.name);
        onImageSubmit(file);
    }
  };

  const handleSubmit = useCallback(() => {
    if (mode === 'text' && !isLoading) {
      onTextSubmit(text);
    }
  }, [mode, text, isLoading, onTextSubmit]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Start Learning</h2>
          <p className="text-slate-500 mb-6">Paste your text or upload an image to begin building your vocabulary.</p>
          
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm transition-colors ${mode === 'text' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <TextIcon />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm transition-colors ${mode === 'image' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UploadIcon />
              <span>Upload Image</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-semibold">Analyzing your content...</p>
            </div>
          ) : (
            <div>
              {mode === 'text' ? (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your article or text here..."
                    className="w-full h-64 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-y"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className="w-full mt-4 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Learning
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <label 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    htmlFor="file-upload" 
                    className="relative cursor-pointer block w-full p-12 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 transition-colors bg-slate-50">
                    <div className="flex flex-col items-center">
                        <UploadIcon className="w-12 h-12 text-slate-400" />
                        <span className="mt-2 block text-sm font-semibold text-slate-600">
                          {fileName ? fileName : 'Drag & drop an image, or click to browse'}
                        </span>
                    </div>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
