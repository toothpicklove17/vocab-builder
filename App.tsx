import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputView } from './components/InputView';
import { ReadingView } from './components/ReadingView';
import { HistoryView } from './components/HistoryView';
import { AllWordsView } from './components/AllWordsView';
import { TutorialView } from './components/TutorialView';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import type { View, VocabularyEntry, HistoryEntry } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for the current session/article
  const [currentArticle, setCurrentArticle] = useState<HistoryEntry | null>(null);
  
  // State for persistent data
  const [allWords, setAllWords] = useState<VocabularyEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Ensure all loaded words have a saveCount for consistency
    const loadedWords = storageService.getVocabularyList().map(word => ({
        ...word,
        saveCount: word.saveCount || 1
    }));
    setAllWords(loadedWords);
    setHistory(storageService.getHistory());
  }, []);
  
  const persistHistory = (updatedHistory: HistoryEntry[]) => {
      setHistory(updatedHistory);
      storageService.saveHistory(updatedHistory);
  };
  
  const persistAllWords = (updatedWords: VocabularyEntry[]) => {
      setAllWords(updatedWords);
      storageService.saveVocabularyList(updatedWords);
  }

  const handleAnalysis = async (source: string | File) => {
    setIsLoading(true);
    setError(null);
    try {
      let text = '';
      
      if (typeof source === 'string') {
        text = source;
      } else {
        // Use Gemini for OCR to get text from the image.
        text = await geminiService.extractTextFromImage(source);
      }
        
      const title = "Text";

      const newArticle: HistoryEntry = {
          id: new Date().toISOString(),
          title,
          sourceText: text,
          vocabulary: [], // Start with an empty vocabulary list
          highlights: {},
          createdAt: new Date().toISOString(),
      };
      
      setCurrentArticle(newArticle);
      persistHistory([newArticle, ...history]);
      
      setCurrentView('reading');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWord = useCallback((wordData: VocabularyEntry) => {
    const wordLower = wordData.word.toLowerCase();
    const existingWordIndex = allWords.findIndex(w => w.word.toLowerCase() === wordLower);
    
    let updatedWords;
    if (existingWordIndex > -1) {
        // Word exists, so we create a new array with the updated word
        updatedWords = allWords.map((word, index) => {
            if (index === existingWordIndex) {
                return {
                    ...word,
                    saveCount: (word.saveCount || 1) + 1
                };
            }
            return word;
        });
    } else {
        // New word, add it to the beginning of the array with a count of 1
        updatedWords = [{ ...wordData, saveCount: 1 }, ...allWords];
    }
    persistAllWords(updatedWords);
    
    // Save to current article's list if it's not already there
    if (currentArticle) {
      if (!currentArticle.vocabulary.some(v => v.word.toLowerCase() === wordData.word.toLowerCase())) {
        const updatedArticle = {
          ...currentArticle,
          vocabulary: [wordData, ...currentArticle.vocabulary]
        };
        setCurrentArticle(updatedArticle);

        const historyIndex = history.findIndex(h => h.id === currentArticle.id);
        if (historyIndex > -1) {
            const updatedHistory = [...history];
            updatedHistory[historyIndex] = updatedArticle;
            persistHistory(updatedHistory);
        }
      }
    }
  }, [allWords, currentArticle, history]);


  const handleDeleteWord = useCallback((wordToDelete: string) => {
    // Delete from global list
    const updatedAllWords = allWords.filter(w => w.word.toLowerCase() !== wordToDelete.toLowerCase());
    persistAllWords(updatedAllWords);

    // Also delete from current article's vocabulary list if it exists
    if (currentArticle) {
        const updatedArticle = {
            ...currentArticle,
            vocabulary: currentArticle.vocabulary.filter(w => w.word.toLowerCase() !== wordToDelete.toLowerCase())
        };
        setCurrentArticle(updatedArticle);
        
        const historyIndex = history.findIndex(h => h.id === currentArticle.id);
        if (historyIndex > -1) {
            const updatedHistory = [...history];
            updatedHistory[historyIndex] = updatedArticle;
            persistHistory(updatedHistory);
        }
    }
  }, [allWords, currentArticle, history]);
  
  const handleTitleChange = useCallback((newTitle: string) => {
    if (currentArticle) {
        const updatedArticle = { ...currentArticle, title: newTitle };
        setCurrentArticle(updatedArticle);
        
        const historyIndex = history.findIndex(h => h.id === currentArticle.id);
        if (historyIndex > -1) {
            const updatedHistory = [...history];
            updatedHistory[historyIndex] = updatedArticle;
            persistHistory(updatedHistory);
        }
    }
  }, [currentArticle, history]);

  const handleHighlightsChange = useCallback((newHighlights: Record<string, string>) => {
       if (currentArticle) {
        const updatedArticle = { ...currentArticle, highlights: newHighlights };
        setCurrentArticle(updatedArticle);
        
        const historyIndex = history.findIndex(h => h.id === currentArticle.id);
        if (historyIndex > -1) {
            const updatedHistory = [...history];
            updatedHistory[historyIndex] = updatedArticle;
            persistHistory(updatedHistory);
        }
    }
  }, [currentArticle, history]);
  
  const handleDeleteHistory = useCallback((idToDelete: string) => {
    const updatedHistory = history.filter(h => h.id !== idToDelete);
    persistHistory(updatedHistory);
  }, [history]);

  const handleNavigate = (view: View) => {
    if (view === 'home') {
        setCurrentArticle(null);
    }
    setError(null); // Clear error on navigation
    setCurrentView(view);
  };
  
  const handleSelectHistory = (entry: HistoryEntry) => {
      setCurrentArticle(entry);
      setError(null); // Clear error on navigation
      setCurrentView('reading');
  }
  
  const handleSetError = useCallback((message: string | null) => {
    setError(message);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <InputView onTextSubmit={handleAnalysis} onImageSubmit={handleAnalysis} isLoading={isLoading} />;
      case 'reading':
        return currentArticle ? (
            <ReadingView 
                key={currentArticle.id}
                article={currentArticle} 
                onSaveWord={handleSaveWord} 
                onDeleteWord={handleDeleteWord}
                onTitleChange={handleTitleChange}
                onHighlightsChange={handleHighlightsChange}
                onBack={() => handleNavigate('home')} 
                onError={handleSetError}
            />
        ) : <div className="text-center p-8">No article selected. Go <button onClick={() => handleNavigate('home')} className="text-indigo-600 underline">home</button> to start.</div>;
      case 'history':
        return <HistoryView history={history} onSelectHistory={handleSelectHistory} onDeleteHistory={handleDeleteHistory} />;
      case 'allWords':
        return <AllWordsView allWords={allWords} onDeleteWord={handleDeleteWord} />;
      case 'tutorial':
        return <TutorialView />;
      default:
        return <InputView onTextSubmit={handleAnalysis} onImageSubmit={handleAnalysis} isLoading={isLoading} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close">
                    <span className="text-2xl">&times;</span>
                </button>
            </div>}
            {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

export default App;