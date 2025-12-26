
import React, { useState, useEffect } from 'react';
import { getExercises } from '../services/geminiService';
import { DumbbellIcon } from './icons/DumbbellIcon';

interface Exercise {
  title: string;
  description: string;
  emoji: string;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-start space-x-4">
            <span className="text-4xl mt-1">{exercise.emoji}</span>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{exercise.title}</h3>
                <p className="text-gray-600 mt-1">{exercise.description}</p>
            </div>
        </div>
    </div>
);


export const ExerciciosPage: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExercises = async () => {
        setIsLoading(true);
        const fetchedExercises = await getExercises();
        setExercises(fetchedExercises);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in space-y-8">
            <div className="text-center">
                <DumbbellIcon className="w-12 h-12 mx-auto text-cyan-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Exercícios de Desenvolvimento</h2>
                <p className="text-gray-600 mt-1">Práticas para estimular autorreflexão e crescimento emocional.</p>
            </div>
            
            {isLoading ? (
                 <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                 </div>
            ) : (
                <div className="space-y-6">
                    {exercises.map((exercise, index) => (
                        <ExerciseCard key={index} exercise={exercise} />
                    ))}
                </div>
            )}
             <div className="text-center mt-6">
                <button
                onClick={fetchExercises}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-semibold text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 transition disabled:opacity-50"
                >
                    {isLoading ? 'Gerando...' : 'Gerar Novos Exercícios'}
                </button>
            </div>
        </div>
    );
};
