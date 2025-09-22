import React, { useEffect, useRef, useState } from 'react';
import type { VocabularyEntry, PopupData } from '../types';
import { PlusIcon, XIcon, LoadingSpinnerIcon, HighlighterIcon, NoColorIcon } from './icons';

interface VocabularyPopupProps {
  popupData: PopupData;
  isLoading: boolean;
  onClose: () => void;
  onSaveWord: (wordData: VocabularyEntry) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  onHighlightWord: (word: string, color: string) => void;
  onRemoveHighlight: (word: string) => void;
  highlightColor?: string;
}

const HIGHLIGHT_COLORS = { 
    yellow: '#fef08a', // a bright, fluorescent yellow
    orange: '#fed7aa', // a low-saturation light orange
    pink: '#fbcfe8'  // a low-saturation light pink
};

export const VocabularyPopup: React.FC<VocabularyPopupProps> = ({ popupData, isLoading, onClose, onSaveWord, containerRef, onHighlightWord, onRemoveHighlight, highlightColor }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (popupRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();
        const rawX = popupData.position.x;
        const rawY = popupData.position.y;
        
        let left = rawX - containerRect.left;
        let top = rawY - containerRect.top + 15; // Position 15px below the selection

        if (left + popupRect.width > containerRect.width) {
            left = containerRect.width - popupRect.width - 10;
        }
        if (left < 0) {
            left = 10;
        }
        
        // Check if popup would go off the bottom of the viewport
        if (rawY + popupRect.height > window.innerHeight) {
            // Position it above the selection instead
            // We need the selection's top position for this, which we don't have directly.
            // A simplified approach is to subtract the popup height.
             top = rawY - containerRect.top - popupRect.height - 15;
        }
        setPosition({ top, left });
    }
  }, [popupData, containerRef]);

  const handleHighlightClick = (word: string, color: string) => {
    onHighlightWord(word, color);
    setShowColorPicker(false);
  };
  
  const handleRemoveHighlightClick = (word: string) => {
    onRemoveHighlight(word);
    setShowColorPicker(false);
  };

  const isFullEntry = (content: any): content is VocabularyEntry => {
    return 'definition' in content;
  };
  
  const content = popupData.content;

  return (
    <div
      ref={popupRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="absolute z-20 w-80 max-w-sm bg-white rounded-lg shadow-2xl border border-slate-200 p-4 animate-fade-in-up vocab-popup"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Close"
      >
        <XIcon />
      </button>
      
      <div className="flex items-start mb-3">
        <h3 className="text-xl font-bold text-indigo-700 mr-2">{content.word}</h3>
        {isFullEntry(content) && (
            <div className="flex items-center space-x-1.5">
                 <button
                    onClick={() => onSaveWord(content)}
                    className="p-1.5 text-indigo-600 hover:text-white rounded-full bg-indigo-100 hover:bg-indigo-600 transition-colors"
                    aria-label="Save word"
                    title="Save word"
                    >
                    <PlusIcon />
                </button>
                <div className="relative">
                    <button
                        onClick={() => {
                            if (!highlightColor) {
                                onHighlightWord(content.word, HIGHLIGHT_COLORS.yellow);
                            } else {
                                setShowColorPicker(!showColorPicker);
                            }
                        }}
                        className={`p-1.5 rounded-full transition-colors ${highlightColor ? 'text-white' : 'text-yellow-500 bg-yellow-100 hover:bg-yellow-500 hover:text-white'}`}
                        style={{ backgroundColor: highlightColor }}
                        aria-label="Highlight word"
                        title="Highlight word"
                    >
                        <HighlighterIcon />
                    </button>
                    {showColorPicker && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-full border border-slate-200 p-1 flex space-x-1">
                            {Object.values(HIGHLIGHT_COLORS).map(color => (
                                <button key={color} onClick={() => handleHighlightClick(content.word, color)} className="w-6 h-6 rounded-full border border-slate-200" style={{backgroundColor: color}}></button>
                            ))}
                            <button onClick={() => handleRemoveHighlightClick(content.word)} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center bg-slate-100 hover:bg-slate-200"><NoColorIcon /></button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {isLoading && !isFullEntry(content) ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinnerIcon />
          <p className="text-slate-500">Fetching definition...</p>
        </div>
      ) : isFullEntry(content) ? (
        <div className="space-y-3 text-sm">
          {content.pronunciation && (
            <p className="text-slate-500 font-mono text-base">{content.pronunciation}</p>
          )}
          <div>
            <p className="font-semibold text-slate-700 mb-1">Definition</p>
            <p className="text-slate-600">{content.definition}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-1">Example</p>
            <p className="text-slate-600 italic">"{content.usage}"</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};