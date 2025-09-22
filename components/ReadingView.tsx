import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import type { HistoryEntry, VocabularyEntry, PopupData } from '../types';
import { VocabularyPopup } from './VocabularyPopup';
import { geminiService } from '../services/geminiService';
import { VocabularyList } from './VocabularyList';
import { EditIcon } from './icons';

interface ReadingViewProps {
  article: HistoryEntry;
  onSaveWord: (wordData: VocabularyEntry) => void;
  onDeleteWord: (word: string) => void;
  onTitleChange: (newTitle: string) => void;
  onHighlightsChange: (newHighlights: Record<string, string>) => void;
  onBack: () => void;
  onError: (message: string | null) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ article, onSaveWord, onDeleteWord, onTitleChange, onHighlightsChange, onBack, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const readingContentRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(article.title);

  const vocabularyMap = useMemo(() => {
    const map = new Map<string, VocabularyEntry>();
    article.vocabulary.forEach(v => map.set(v.word.toLowerCase(), v));
    return map;
  }, [article.vocabulary]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onTitleChange(editableTitle);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  useEffect(() => {
    const handleTextSelection = async () => {
      if (isEditingTitle) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const readingContent = readingContentRef.current;
      const range = selection.getRangeAt(0);

      // Ensure the selection is within the reading content area
      if (!readingContent || !readingContent.contains(range.commonAncestorContainer)) {
        if (selection.toString().trim().length === 0) {
           setPopupData(null);
        }
        return;
      }

      const selectedText = selection.toString().trim().replace(/[^a-zA-Z\s-]/g, '');

      // Only trigger for meaningful selections
      if (selectedText.length > 0 && selectedText.length < 100 && !selectedText.includes('\n')) {
        const rect = range.getBoundingClientRect();

        setPopupData({
          content: { word: selectedText },
          position: { x: rect.left, y: rect.bottom }
        });

        const existingDefinition = vocabularyMap.get(selectedText.toLowerCase());
        if (existingDefinition) {
          setPopupData(prev => prev ? { ...prev, content: existingDefinition } : null);
        } else {
          setIsFetchingDefinition(true);
          try {
            onError(null); // Clear previous errors
            const definition = await geminiService.fetchWordDefinition(selectedText);
            setPopupData(prev => (prev && prev.content.word === selectedText) ? { ...prev, content: definition } : null);
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            if (errorMessage.toLowerCase().includes("quota")) {
                onError(errorMessage);
            } else {
                onError(`Failed to get definition for "${selectedText}".`);
            }
            setPopupData(null);
          } finally {
            setIsFetchingDefinition(false);
          }
        }
      } else if (selectedText.length === 0) {
        setPopupData(null);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
        const popup = (event.target as HTMLElement).closest('.vocab-popup');
        if (popup) return;
        // Use a small timeout to allow the browser's selection to finalize
        setTimeout(handleTextSelection, 10);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEditingTitle, vocabularyMap, onError]);


  const handleHighlightChange = (word: string, color: string | null) => {
    const newHighlights = { ...article.highlights };
    if (color) {
      newHighlights[word.toLowerCase()] = color;
    } else {
      delete newHighlights[word.toLowerCase()];
    }
    onHighlightsChange(newHighlights);
  };

  const renderTextWithHighlights = () => {
    const phrases = Object.keys(article.highlights);

    if (phrases.length === 0) {
      // Return plain text if there's nothing to highlight
      return <>{article.sourceText}</>;
    }

    // Escape special regex characters in phrases to prevent errors
    const escapedPhrases = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // Create a single regex to match all phrases, case-insensitively and globally
    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

    // Split the text by the regex. The capturing group ensures matched phrases are included in the array.
    const parts = article.sourceText.split(regex);

    return (
      <>
        {parts.filter(part => part).map((part, index) => {
          const lowercasedPart = part.toLowerCase();
          const highlightColor = article.highlights[lowercasedPart];

          if (highlightColor) {
            return (
              <span
                key={index}
                style={{ backgroundColor: highlightColor }}
                className="transition-colors rounded-sm px-0.5 py-0.5 -mx-0.5 -my-0.5"
              >
                {part}
              </span>
            );
          }
          // This is a non-highlighted part
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={onBack} className="mb-6 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        &larr; Back to Home
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg border border-slate-200">
          <div className="flex items-center mb-6 border-b pb-4 group">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-3xl font-bold text-slate-800 w-full outline-none bg-indigo-50"
                autoFocus
              />
            ) : (
              <div onClick={() => setIsEditingTitle(true)} className="flex items-center cursor-pointer w-full">
                <h2 className="text-3xl font-bold text-slate-800 ">{article.title}</h2>
                <EditIcon className="w-5 h-5 ml-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <div 
            ref={readingContentRef}
            className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap selection:bg-indigo-200">
            {renderTextWithHighlights()}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-lg shadow-lg border border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <VocabularyList
              words={article.vocabulary}
              onDeleteWord={onDeleteWord}
              title="Article Vocabulary"
              displayMode="compact"
            />
          </div>
        </aside>
      </div>

      {popupData && (
        <VocabularyPopup
          popupData={popupData}
          isLoading={isFetchingDefinition}
          onClose={() => setPopupData(null)}
          onSaveWord={onSaveWord}
          containerRef={containerRef}
          onHighlightWord={(word, color) => handleHighlightChange(word, color)}
          onRemoveHighlight={(word) => handleHighlightChange(word, null)}
          highlightColor={article.highlights[popupData.content.word.toLowerCase()]}
        />
      )}
    </div>
  );
};