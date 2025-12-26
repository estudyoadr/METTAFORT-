
import React, { useState, useEffect } from 'react';
import { getWeeklySummary } from '../services/geminiService';
import { Page, type MoodEntry } from '../types';
import { ChartIcon } from './icons/ChartIcon';
import { SubtleCTA } from './SubtleCTA';

interface ProgressoPageProps {
    onNavigate: (page: Page) => void;
}

export const ProgressoPage: React.FC<ProgressoPageProps> = ({ onNavigate }) => {
    const [moods, setMoods] = useState<MoodEntry[]>([]);
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMoodData = async () => {
            setIsLoading(true);
            const allMoods: MoodEntry[] = JSON.parse(localStorage.getItem('mettafort_moods') || '[]');
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
            const weeklyMoods = allMoods
                .filter(m => m.date >= sevenDaysAgoStr)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setMoods(weeklyMoods);
            const summaryText = await getWeeklySummary(weeklyMoods);
            setSummary(summaryText);
            setIsLoading(false);
        };
        fetchMoodData();
    }, []);

    const moodCounts = moods.reduce<Record<string, number>>((acc, mood) => {
        const key = `${mood.mood}|${mood.mood_name}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    // Fix: Explicitly cast Object.values to number[] to resolve 'unknown' type error on line 42
    const maxCount = Math.max(...(Object.values(moodCounts) as number[]), 1);

    return (
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-in space-y-10">
            <div className="text-center">
                <div className="inline-flex p-4 bg-teal-50 rounded-full mb-4">
                    <ChartIcon className="w-10 h-10 text-teal-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800">Sua Maré Emocional</h2>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">Um olhar compassivo sobre as oscilações da sua semana.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ChartIcon className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-white/20 p-1 rounded mr-2">✨</span> Análise do Analista
                </h3>
                {isLoading ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="italic opacity-80">Processando sua jornada...</span>
                    </div>
                ) : (
                    <p className="text-lg leading-relaxed font-medium text-teal-50">{summary}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Frequência Semanal</h3>
                    <div className="space-y-4">
                        {/* Fix: Explicitly cast Object.entries to [string, number][] to resolve 'unknown' type errors on lines 81 and 86 */}
                        {(Object.entries(moodCounts) as [string, number][]).map(([key, count]) => {
                            const [mood, mood_name] = key.split('|');
                            return (
                                <div key={key} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-gray-600">{mood} {mood_name}</span>
                                        <span className="text-xs font-bold text-gray-400">{count} {count > 1 ? 'dias' : 'dia'}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-teal-500 h-full rounded-full transition-all duration-1000 group-hover:bg-teal-600"
                                            style={{ width: `${(count / maxCount) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Cronologia</h3>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {moods.map((m, i) => (
                            <div key={i} className="flex items-center space-x-4 p-3 bg-white rounded-2xl shadow-sm">
                                <span className="text-2xl">{m.mood}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-800">{m.mood_name}</div>
                                    <div className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('pt-BR', { weekday: 'long' })}</div>
                                </div>
                            </div>
                        ))}
                        {moods.length === 0 && <p className="text-center text-gray-400 italic py-10">Nenhum registro recente.</p>}
                    </div>
                </div>
            </div>

            <SubtleCTA
                text="O autoconhecimento é uma jornada contínua. Nossos profissionais podem te ajudar a navegar por águas mais profundas."
                buttonText="Ver Planos de Terapia"
                onClick={() => onNavigate(Page.SERVICOS)}
            />
        </div>
    );
};
