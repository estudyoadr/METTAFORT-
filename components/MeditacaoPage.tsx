
import React, { useState } from 'react';
import type { Meditation } from '../types';
import { LotusIcon } from './icons/LotusIcon';
import { MeditationPlayer } from './MeditationPlayer';


const meditations: Meditation[] = [
    { id: 1, title: "Respiração Profunda", description: "Acalme sua mente e corpo com foco na respiração.", type: "Relaxamento", duration: 300 }, // 5 min
    { id: 2, title: "Atenção Plena", description: "Esteja presente no agora, observando seus pensamentos.", type: "Foco", duration: 600 }, // 10 min
    { id: 3, title: "Escaneamento Corporal", description: "Libere a tensão de cada parte do seu corpo.", type: "Alívio de Tensões", duration: 900 }, // 15 min
];


const MeditationCard: React.FC<{ meditation: Meditation, onSelect: (meditation: Meditation) => void }> = ({ meditation, onSelect }) => (
    <div 
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-teal-300 transition cursor-pointer"
        onClick={() => onSelect(meditation)}
    >
        <div className="flex items-start space-x-4">
            <div className="bg-teal-100 p-3 rounded-full">
                 <LotusIcon className="w-6 h-6 text-teal-600"/>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">{meditation.title}</h3>
                <p className="text-sm text-gray-500 font-semibold text-teal-700">{meditation.type} - {meditation.duration / 60} min</p>
                <p className="text-gray-600 mt-2">{meditation.description}</p>
            </div>
        </div>
    </div>
);


export const MeditacaoPage: React.FC = () => {
    const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);

    if (selectedMeditation) {
        return <MeditationPlayer meditation={selectedMeditation} onBack={() => setSelectedMeditation(null)} />
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in space-y-8">
            <div className="text-center">
                <LotusIcon className="w-12 h-12 mx-auto text-teal-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Sessões de Meditação Guiada</h2>
                <p className="text-gray-600 mt-1">Encontre um momento de paz e clareza para o seu dia.</p>
            </div>
            
            <div className="space-y-6">
                {meditations.map((meditation) => (
                    <MeditationCard key={meditation.id} meditation={meditation} onSelect={setSelectedMeditation} />
                ))}
            </div>
        </div>
    );
};
