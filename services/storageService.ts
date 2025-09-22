import type { VocabularyEntry, HistoryEntry } from '../types';

const VOCAB_LIST_KEY = 'vocabBuilder_vocabList';
const HISTORY_KEY = 'vocabBuilder_history';

export const storageService = {
  getVocabularyList: (): VocabularyEntry[] => {
    try {
      const data = localStorage.getItem(VOCAB_LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse vocabulary list from localStorage", error);
      return [];
    }
  },

  saveVocabularyList: (vocabList: VocabularyEntry[]): void => {
    try {
      localStorage.setItem(VOCAB_LIST_KEY, JSON.stringify(vocabList));
    } catch (error) {
      console.error("Failed to save vocabulary list to localStorage", error);
    }
  },

  addWordToVocabulary: (word: VocabularyEntry): void => {
    const currentList = storageService.getVocabularyList();
    if (!currentList.some(item => item.word.toLowerCase() === word.word.toLowerCase())) {
        const updatedList = [word, ...currentList];
        storageService.saveVocabularyList(updatedList);
    }
  },

  removeWordFromVocabulary: (word: string): void => {
    const currentList = storageService.getVocabularyList();
    const updatedList = currentList.filter(item => item.word.toLowerCase() !== word.toLowerCase());
    storageService.saveVocabularyList(updatedList);
  },
  
  getHistory: (): HistoryEntry[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
    }
  },

  saveHistory: (history: HistoryEntry[]): void => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  },

  addHistoryEntry: (entry: HistoryEntry): void => {
    const currentHistory = storageService.getHistory();
    const updatedHistory = [entry, ...currentHistory];
    // Keep history limited to e.g. 50 entries
    if (updatedHistory.length > 50) {
        updatedHistory.pop();
    }
    storageService.saveHistory(updatedHistory);
  }
};
