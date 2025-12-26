
import React, { useState, useEffect } from 'react';
import type { Advice } from '../types';
import { PenIcon } from './icons/PenIcon';

export const ConselhoPage: React.FC = () => {
  const [adviceText, setAdviceText] = useState('');
  const [savedAdvices, setSavedAdvices] = useState<Advice[]>([]);
  const [showReminder, setShowReminder] = useState<Advice | null>(null);

  useEffect(() => {
    const advicesFromStorage = localStorage.getItem('mettafort_advices');
    if (advicesFromStorage) {
      setSavedAdvices(JSON.parse(advicesFromStorage));
    }
  }, []);

  const saveAdvice = () => {
    if (!adviceText.trim()) return;
    const newAdvice: Advice = {
      id: Date.now(),
      text: adviceText,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    const updatedAdvices = [newAdvice, ...savedAdvices];
    setSavedAdvices(updatedAdvices);
    localStorage.setItem('mettafort_advices', JSON.stringify(updatedAdvices));
    setAdviceText('');
  };

  const showRandomAdvice = () => {
      if(savedAdvices.length > 0) {
          const randomIndex = Math.floor(Math.random() * savedAdvices.length);
          setShowReminder(savedAdvices[randomIndex]);
      }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in space-y-8">
      <div className="text-center">
        <PenIcon className="w-12 h-12 mx-auto text-amber-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Seu Espaço de Autoconhecimento</h2>
      </div>
      
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
        <label htmlFor="advice" className="block text-lg font-semibold text-amber-800 mb-2">Se você pudesse se dar um conselho hoje, que conselho seria?</label>
        <textarea
          id="advice"
          value={adviceText}
          onChange={(e) => setAdviceText(e.target.value)}
          placeholder="Escreva sua resposta aqui..."
          className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition resize-none"
        />
        <button
          onClick={saveAdvice}
          className="mt-4 px-6 py-2 border border-transparent rounded-lg shadow-sm text-md font-semibold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-transform transform hover:scale-105"
        >
          Guardar Conselho
        </button>
      </div>

      {savedAdvices.length > 0 && (
          <div className="text-center">
              <button onClick={showRandomAdvice} className="text-teal-600 hover:text-teal-800 font-semibold transition">
                 Lembrar de um conselho que você se deu?
              </button>
          </div>
      )}

      {showReminder && (
          <div className="bg-teal-50 p-4 rounded-lg animate-fade-in relative">
              <button onClick={() => setShowReminder(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
              <p className="text-sm text-gray-600">Em {showReminder.date}, você disse que daria o seguinte conselho:</p>
              <p className="text-lg italic text-teal-800 mt-2">"{showReminder.text}"</p>
          </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Seus Conselhos Anteriores</h3>
        {savedAdvices.length > 0 ? (
          <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {savedAdvices.map((adv) => (
              <li key={adv.id} className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-800">"{adv.text}"</p>
                <p className="text-right text-sm text-gray-500 mt-2">- {adv.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Você ainda não guardou nenhum conselho.</p>
        )}
      </div>
    </div>
  );
};
