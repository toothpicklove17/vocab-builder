import React from 'react';
import type { VocabularyEntry } from '../types';
import { TrashIcon } from './icons';

interface VocabularyListProps {
  words: VocabularyEntry[];
  onDeleteWord?: (word: string) => void;
  title: string;
  displayMode?: 'full' | 'compact';
  showSaveCount?: boolean;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ words, onDeleteWord, title, displayMode = 'full', showSaveCount = false }) => {
  if (words.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-2 text-sm">No vocabulary words for this article yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold text-slate-800 px-4 pt-4">{title}</h2>}
      <ul className="divide-y divide-slate-200">
        {words.map((entry) => (
          <li key={entry.word} className="relative p-4 bg-white hover:bg-slate-50 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-8">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-indigo-700">{entry.word}</h3>
                  {entry.pronunciation && <p className="text-slate-500 font-mono text-xs md:text-sm">{entry.pronunciation}</p>}
                </div>
                <div className="text-sm space-y-2">
                  <p><strong className="font-medium text-slate-600">Definition:</strong> <span className="text-slate-500">{entry.definition}</span></p>
                  {displayMode === 'full' && (
                    <>
                        <p><strong className="font-medium text-slate-600">Example:</strong> <em className="text-slate-500">"{entry.usage}"</em></p>
                    </>
                  )}
                </div>
              </div>
              {onDeleteWord && (
                <button 
                  onClick={() => onDeleteWord(entry.word)}
                  className="p-1.5 ml-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${entry.word}`}
                  title={`Remove ${entry.word}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
             {showSaveCount && entry.saveCount && (
                <span className="absolute bottom-4 right-4 text-sm text-slate-400 font-medium" title={`Saved ${entry.saveCount} times`}>
                    {entry.saveCount}
                </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};