
import React, { useState } from 'react';
import { getAngustiaResponse } from '../services/geminiService';
import { BrainIcon } from './icons/BrainIcon';
import { SubtleCTA } from './SubtleCTA';
import { Page } from '../types';

interface AngustiasPageProps {
  onNavigate: (page: Page) => void;
}


export const AngustiasPage: React.FC<AngustiasPageProps> = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setResponse('');
    const geminiResponse = await getAngustiaResponse(inputText);
    setResponse(geminiResponse);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in space-y-6">
      <div className="text-center">
        <BrainIcon className="w-12 h-12 mx-auto text-cyan-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Página das Angústias</h2>
        <p className="text-gray-600 mt-1">Um espaço confidencial para registrar suas aflições.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Descreva o que você está sentindo..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processando...
            </>
          ) : (
            'Enviar para Reflexão'
          )}
        </button>
      </form>

      {(isLoading || response) && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Uma perspectiva para você:</h3>
          {isLoading && !response && <p className="text-gray-600 italic">Aguardando resposta...</p>}
          {response && (
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{response}</p>
          )}
        </div>
      )}

      {response && !isLoading && (
        <SubtleCTA
            text="Explorar sentimentos pode ser um passo poderoso. Se desejar aprofundar esta reflexão com um profissional, estamos aqui para ajudar."
            buttonText="Conhecer Nossos Serviços"
            onClick={() => onNavigate(Page.SERVICOS)}
        />
      )}
    </div>
  );
};
