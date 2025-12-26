
import React, { useState, useEffect } from 'react';
import type { Meditation } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface MeditationPlayerProps {
  meditation: Meditation;
  onBack: () => void;
}

export const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ meditation, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(meditation.duration);

  useEffect(() => {
    if (!isPlaying || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((meditation.duration - timeLeft) / meditation.duration) * 100;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in flex flex-col items-center justify-center space-y-6 h-[calc(100vh-300px)] relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-teal-600 hover:text-teal-800 font-semibold">&larr; Voltar</button>
      
        <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{meditation.title}</h2>
            <p className="text-gray-600 mt-1">{meditation.type}</p>
        </div>

        <div className="text-6xl font-mono text-teal-700 my-8">
            {formatTime(timeLeft)}
        </div>

        <div className="w-full max-w-md space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-center">
                <button onClick={() => setIsPlaying(!isPlaying)} className="bg-teal-600 text-white rounded-full p-4 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-110">
                    {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                </button>
            </div>
        </div>

        {timeLeft === 0 && (
            <p className="text-lg text-green-700 font-semibold animate-pulse mt-6">Sessão concluída. Respire fundo.</p>
        )}
    </div>
  );
};
