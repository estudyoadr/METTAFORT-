
import React from 'react';
import type { Advice } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface AdviceReminderProps {
  advice: Advice;
  onDismiss: () => void;
}

export const AdviceReminder: React.FC<AdviceReminderProps> = ({ advice, onDismiss }) => {
  return (
    <div className="relative bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg shadow-md animate-fade-in my-6">
      <button onClick={onDismiss} className="absolute top-2 right-3 text-amber-600 hover:text-amber-800 font-bold text-xl">&times;</button>
      <div className="flex items-start space-x-4">
        <LightbulbIcon className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
        <div>
            <h3 className="font-semibold text-amber-800">Um lembrete para você...</h3>
            <p className="text-sm text-gray-600 mt-1">Notamos que você não está se sentindo no seu melhor. Lembre-se desta sabedoria que você mesmo registrou em {advice.date}:</p>
            <p className="text-lg italic text-amber-900 mt-3">"{advice.text}"</p>
        </div>
      </div>
    </div>
  );
};
