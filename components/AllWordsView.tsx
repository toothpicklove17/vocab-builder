import React, { useState, useMemo } from 'react';
import type { VocabularyEntry } from '../types';
import { VocabularyList } from './VocabularyList';

interface AllWordsViewProps {
  allWords: VocabularyEntry[];
  onDeleteWord: (word: string) => void;
}

type SortBy = 'time' | 'count';

export const AllWordsView: React.FC<AllWordsViewProps> = ({ allWords, onDeleteWord }) => {
    const [sortBy, setSortBy] = useState<SortBy>('time');

    const sortedWords = useMemo(() => {
        const wordsCopy = [...allWords];
        if (sortBy === 'count') {
            wordsCopy.sort((a, b) => (b.saveCount || 1) - (a.saveCount || 1));
        }
        // 'time' is the default order since new words are prepended in App.tsx
        return wordsCopy;
    }, [allWords, sortBy]);
    
    const getButtonClass = (sortType: SortBy) => {
        return `px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
            sortBy === sortType 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
        }`;
    }

    return (
        <div className="p-8">
             <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h1 className="text-3xl font-bold text-slate-900">All Saved Words</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-500">Sort by:</span>
                    <button onClick={() => setSortBy('time')} className={getButtonClass('time')}>
                        Time
                    </button>
                    <button onClick={() => setSortBy('count')} className={getButtonClass('count')}>
                        Count
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                <VocabularyList words={sortedWords} onDeleteWord={onDeleteWord} title="" showSaveCount={true} />
            </div>
        </div>
    );
};