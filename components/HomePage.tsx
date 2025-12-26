
import React, { useState, useEffect } from 'react';
import { Page, type User, type MoodEntry, type Advice } from '../types';
import { AdviceReminder } from './AdviceReminder';
import { getDailyReflection, getDailySuggestion } from '../services/geminiService';
import { BrainIcon } from './icons/BrainIcon';
import { PenIcon } from './icons/PenIcon';
import { ChatIcon } from './icons/ChatIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DumbbellIcon } from './icons/DumbbellIcon';
import { LotusIcon } from './icons/LotusIcon';
import { MicIcon } from './icons/MicIcon';


interface HomePageProps {
  user: User;
  onNavigate: (page: Page) => void;
}

const moodOptions = [
    { mood: '😄', name: 'Radiante' },
    { mood: '😊', name: 'Calmo' },
    { mood: '😐', name: 'Neutro' },
    { mood: '😕', name: 'Inquieto' },
    { mood: '😢', name: 'Triste' },
    { mood: '😠', name: 'Irritado' },
    { mood: '😟', name: 'Ansioso' }
];

const ToolCard: React.FC<{ title: string; page: Page; icon: React.ReactElement<{ className?: string }>; onNavigate: (page: Page) => void; primary?: boolean; badge?: string }> = ({ title, page, icon, onNavigate, primary, badge }) => (
    <div 
        className={`p-4 rounded-2xl shadow-sm border transition cursor-pointer transform hover:-translate-y-1 flex flex-col items-center text-center relative ${primary ? 'bg-teal-600 border-teal-600 hover:bg-teal-700' : 'bg-white border-gray-100 hover:border-teal-300 hover:shadow-md'}`}
        onClick={() => onNavigate(page)}
    >
        {badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                {badge}
            </span>
        )}
        {React.cloneElement(icon, { className: `w-8 h-8 mb-3 ${primary ? 'text-white' : 'text-teal-600'}`})}
        <h3 className={`text-sm font-bold ${primary ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
    </div>
);


export const HomePage: React.FC<HomePageProps> = ({ user, onNavigate }) => {
    const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
    const [showAdvice, setShowAdvice] = useState<Advice | null>(null);
    const [reflection, setReflection] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');

        const initializeDashboard = async () => {
            setIsLoading(true);
            const todayStr = new Date().toISOString().split('T')[0];
            const allMoods: MoodEntry[] = JSON.parse(localStorage.getItem('mettafort_moods') || '[]');
            const moodForToday = allMoods.find(m => m.date === todayStr);
            if (moodForToday) setTodayMood(moodForToday);

            try {
                const [newReflection, newSuggestion] = await Promise.all([
                    getDailyReflection(),
                    getDailySuggestion(moodForToday || null)
                ]);
                setReflection(newReflection);
                setSuggestion(newSuggestion);
            } catch (err) {
                setReflection("A quietude é o início de toda descoberta.");
                setSuggestion("Respire fundo e tente novamente em instantes.");
            }

            if (moodForToday && ['Triste', 'Irritado', 'Ansioso', 'Inquieto'].includes(moodForToday.mood_name)) {
                const advices: Advice[] = JSON.parse(localStorage.getItem('mettafort_advices') || '[]');
                if (advices.length > 0) {
                    setShowAdvice(advices[Math.floor(Math.random() * advices.length)]);
                }
            }
            setIsLoading(false);
        };
        initializeDashboard();
    }, []);

    const handleMoodSelect = (mood: string, mood_name: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const newEntry: MoodEntry = { date: todayStr, mood, mood_name };
        let allMoods: MoodEntry[] = JSON.parse(localStorage.getItem('mettafort_moods') || '[]');
        allMoods = [...allMoods.filter(m => m.date !== todayStr), newEntry];
        localStorage.setItem('mettafort_moods', JSON.stringify(allMoods));
        setTodayMood(newEntry);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-white p-8 rounded-3xl border border-teal-100 shadow-sm">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{greeting}, {user.name.split(' ')[0]}.</h1>
                    <p className="text-lg text-teal-800 mt-2 font-medium opacity-80">Como está sua mente hoje?</p>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-200 rounded-full opacity-10 blur-3xl"></div>
            </div>
            
            {/* Insight Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center space-x-2 mb-3">
                        <LotusIcon className="w-5 h-5 text-teal-500" />
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reflexão do Momento</h2>
                    </div>
                    {isLoading ? <div className="space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div></div> : <p className="text-xl font-serif text-gray-800 leading-relaxed italic">"{reflection}"</p>}
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center space-x-2 mb-3">
                        <BrainIcon className="w-5 h-5 text-cyan-500" />
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Metta Sugere</h2>
                    </div>
                    {isLoading ? <div className="space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div><div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div></div> : <p className="text-gray-700 text-lg leading-snug">{suggestion}</p>}
                </div>
            </div>

            {/* Mood Tracker */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">O termômetro do seu momento</h2>
                {todayMood ? (
                    <div className="py-4 animate-scale-up">
                        <div className="text-7xl mb-4">{todayMood.mood}</div>
                        <div className="text-2xl font-bold text-teal-700">{todayMood.mood_name}</div>
                        <button onClick={() => setTodayMood(null)} className="mt-6 text-sm font-semibold text-gray-400 hover:text-teal-600 transition underline underline-offset-4">Mudei de sentimento</button>
                    </div>
                ) : (
                    <div className="flex justify-center items-center flex-wrap gap-4">
                        {moodOptions.map(({ mood, name }) => (
                            <button 
                                key={mood}
                                onClick={() => handleMoodSelect(mood, name)}
                                className="group flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all w-24"
                            >
                                <span className="text-4xl group-hover:scale-125 transition-transform">{mood}</span>
                                <span className="text-xs font-bold text-gray-500 mt-2">{name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showAdvice && <AdviceReminder advice={showAdvice} onDismiss={() => setShowAdvice(null)} />}

            {/* Tools Grid */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Cuidado Integral</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <ToolCard title="Consultar Live" page={Page.LIVE} icon={<MicIcon/>} onNavigate={onNavigate} primary badge="AO VIVO" />
                    <ToolCard title="Angústias" page={Page.ANGUSTIAS} icon={<BrainIcon/>} onNavigate={onNavigate} />
                    <ToolCard title="Ouvindo-se" page={Page.CONSELHO} icon={<PenIcon />} onNavigate={onNavigate} />
                    <ToolCard title="Chat Metta" page={Page.QA} icon={<ChatIcon />} onNavigate={onNavigate} />
                    <ToolCard title="Inconsciente" page={Page.SONHOS} icon={<MoonIcon />} onNavigate={onNavigate} />
                    <ToolCard title="Práticas" page={Page.EXERCICIOS} icon={<DumbbellIcon/>} onNavigate={onNavigate} />
                    <ToolCard title="Pausas" page={Page.MEDITACAO} icon={<LotusIcon/>} onNavigate={onNavigate} />
                </div>
            </div>
        </div>
    );
};
