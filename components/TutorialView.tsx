import React from 'react';
import { TextIcon, UploadIcon, PlusIcon, HighlighterIcon, BookmarkIcon, HistoryIcon } from './icons';

export const TutorialView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 border-b pb-4">
          How to Use Vocab Builder
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          Welcome! This guide will walk you through the features of the Vocab Builder to help you get started.
        </p>

        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">Start a New Session</h2>
              <p className="text-slate-600 mb-4">
                From the <strong className="text-indigo-600">Home</strong> page, you have two ways to begin:
              </p>
              <ul className="space-y-3 list-disc list-inside text-slate-600">
                <li>
                  <span className="font-semibold">Paste Text:</span> Click the <TextIcon className="inline-block w-5 h-5 -mt-1"/> "Paste Text" tab, enter any text you want to read into the text area, and click "Start Learning".
                </li>
                <li>
                  <span className="font-semibold">Upload Image:</span> Click the <UploadIcon className="inline-block w-5 h-5 -mt-1"/> "Upload Image" tab to upload an image containing text. The app will automatically extract the text for you.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                 <span className="text-2xl font-bold">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">Read and Learn</h2>
              <p className="text-slate-600 mb-4">
                Once your text is loaded, you'll be in the <strong className="text-indigo-600">Reading View</strong>. Here's how to interact with the text:
              </p>
              <ul className="space-y-3 list-disc list-inside text-slate-600">
                <li>
                  <span className="font-semibold">Get Definitions:</span> Simply highlight any word or short phrase with your mouse. A popup will instantly appear with the definition, pronunciation, and an example sentence.
                </li>
                <li>
                  <span className="font-semibold">Save Words:</span> In the popup, click the <PlusIcon className="inline-block w-5 h-5 -mt-1 bg-indigo-100 rounded-full p-0.5"/> "Save" button to add the word to your vocabulary list for this article and your global collection.
                </li>
                 <li>
                  <span className="font-semibold">Highlight Text:</span> Use the <HighlighterIcon className="inline-block w-5 h-5 -mt-1 bg-yellow-100 rounded-full p-0.5"/> "Highlight" button in the popup to mark important sections. You can even choose different colors!
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
             <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                 <span className="text-2xl font-bold">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">Review Your Vocabulary</h2>
              <p className="text-slate-600 mb-4">
                All your saved words are stored for easy review:
              </p>
              <ul className="space-y-3 list-disc list-inside text-slate-600">
                <li>
                  <span className="font-semibold">Article Vocabulary:</span> The list on the right side of the Reading View shows all words you've saved from the current article.
                </li>
                <li>
                  <span className="font-semibold">All Words:</span> Navigate to the <BookmarkIcon className="inline-block w-5 h-5 -mt-1"/> "All Words" page from the sidebar to see every word you've ever saved. You can sort them by time or how many times you've saved them.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
             <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                 <span className="text-2xl font-bold">4</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">Check Your History</h2>
              <p className="text-slate-600">
                The <HistoryIcon className="inline-block w-5 h-5 -mt-1"/> <strong className="text-indigo-600">History</strong> page keeps a record of all your past reading sessions. You can revisit any session to review the text and the vocabulary you learned.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};