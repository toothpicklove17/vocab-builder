import React from 'react';
import type { HistoryEntry } from '../types';
import { VocabularyList } from './VocabularyList';
import { TrashIcon } from './icons';

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
  onDeleteHistory: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectHistory, onDeleteHistory }) => {
  if (history.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No History Yet</h2>
            <p className="text-slate-500 max-w-md">Your past sessions will appear here. Start by analyzing some text or an image from the Home screen.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-bold text-slate-900 border-b pb-4">History</h1>
      {history.map((entry) => (
        <div key={entry.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">{entry.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onSelectHistory(entry)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        View Reading
                    </button>
                    <button 
                        onClick={() => onDeleteHistory(entry.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        aria-label={`Delete entry titled ${entry.title}`}
                        title="Delete entry"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800">
                    View {entry.vocabulary.length} vocabulary words from this session
                </summary>
                <div className="mt-4 border-t pt-4">
                     <VocabularyList words={entry.vocabulary} title="" />
                </div>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
};