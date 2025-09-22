export interface VocabularyEntry {
  word: string;
  pronunciation?: string;
  definition: string;
  usage: string;
  saveCount?: number;
}

export interface PopupData {
  content: Partial<VocabularyEntry> & { word: string };
  position: { x: number; y: number };
}

export type View = 'home' | 'reading' | 'history' | 'allWords' | 'tutorial';

export interface HistoryEntry {
    id: string;
    title: string;
    sourceText: string;
    highlights: Record<string, string>;
    vocabulary: VocabularyEntry[];
    createdAt: string;
}