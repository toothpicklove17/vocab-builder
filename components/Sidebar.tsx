import React from 'react';
import { HomeIcon, HistoryIcon, BookmarkIcon, DictionaryIcon, TutorialIcon } from './icons';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: 'home', label: 'Home', icon: HomeIcon },
    { view: 'history', label: 'History', icon: HistoryIcon },
    { view: 'allWords', label: 'All Words', icon: BookmarkIcon },
    { view: 'tutorial', label: 'Tutorial', icon: TutorialIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40">
      <div className="flex items-center space-x-3 h-16 px-6 border-b border-slate-200 flex-shrink-0">
        <DictionaryIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vocab Builder</h1>
      </div>
      <nav className="p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => onNavigate(item.view as View)}
                className={`w-full flex items-center space-x-3 p-3 rounded-md text-sm font-semibold transition-colors ${
                  currentView === item.view
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};