
import React, { useState, useEffect } from 'react';
import { getDreamInterpretation } from '../services/geminiService';
import type { Dream } from '../types';
import { MoonIcon } from './icons/MoonIcon';

export const SonhosPage: React.FC = () => {
    const [dreamText, setDreamText] = useState('');
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const dreamsFromStorage = localStorage.getItem('mettafort_dreams');
        if (dreamsFromStorage) {
            setDreams(JSON.parse(dreamsFromStorage));
        }
    }, []);

    const saveDream = () => {
        if (!dreamText.trim()) return;
        const newDream: Dream = {
            id: Date.now(),
            text: dreamText,
            date: new Date().toLocaleDateString('pt-BR'),
        };
        const updatedDreams = [newDream, ...dreams];
        setDreams(updatedDreams);
        localStorage.setItem('mettafort_dreams', JSON.stringify(updatedDreams));
        setDreamText('');
    };

    const interpretDream = async (dreamId: number) => {
        const dreamToInterpret = dreams.find(d => d.id === dreamId);
        if (!dreamToInterpret) return;

        setIsLoading(true);
        const interpretation = await getDreamInterpretation(dreamToInterpret.text);
        
        const updatedDreams = dreams.map(d => 
            d.id === dreamId ? { ...d, interpretation } : d
        );
        setDreams(updatedDreams);
        localStorage.setItem('mettafort_dreams', JSON.stringify(updatedDreams));
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in space-y-8">
            <div className="text-center">
                <MoonIcon className="w-12 h-12 mx-auto text-indigo-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Diário e Interpretação de Sonhos</h2>
                <p className="text-gray-600 mt-1">Descreva seu sonho e receba uma perspectiva psicológica sobre seus significados.</p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
                <label htmlFor="dream" className="block text-lg font-semibold text-indigo-800 mb-2">O que você sonhou esta noite?</label>
                <textarea
                    id="dream"
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    placeholder="Descreva seu sonho com o máximo de detalhes que conseguir lembrar..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
                />
                <button
                    onClick={saveDream}
                    className="mt-4 px-6 py-2 border border-transparent rounded-lg shadow-sm text-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Salvar Sonho
                </button>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Seus Sonhos Salvos</h3>
                {dreams.length > 0 ? (
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {dreams.map((dream) => (
                            <li key={dream.id} className="bg-gray-50 p-4 rounded-lg border">
                                <p className="text-sm text-gray-500 mb-2">Registrado em: {dream.date}</p>
                                <p className="text-gray-800 whitespace-pre-wrap">"{dream.text}"</p>
                                {dream.interpretation ? (
                                    <div className="mt-4 p-4 bg-indigo-50/50 border-t border-indigo-200">
                                        <h4 className="font-semibold text-indigo-800">Perspectiva sobre o sonho:</h4>
                                        <p className="text-gray-700 mt-1 whitespace-pre-wrap italic">{dream.interpretation}</p>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => interpretDream(dream.id)}
                                        disabled={isLoading}
                                        className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Interpretando...' : 'Buscar uma interpretação'}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">Você ainda não registrou nenhum sonho.</p>
                )}
            </div>
        </div>
    );
};
