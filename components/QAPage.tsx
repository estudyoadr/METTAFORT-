
import React, { useState, useRef, useEffect } from 'react';
import { getQAresponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { ChatIcon } from './icons/ChatIcon';

export const QAPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Olá! Sou o Metta, seu assistente de bem-estar. Sinta-se à vontade para perguntar qualquer coisa sobre suas emoções, desafios ou apenas para conversar. Como posso te ajudar hoje?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputText.trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        // Enviamos o histórico completo atual para o serviço
        const geminiResponse = await getQAresponse(text, messages);
        
        const modelMessage: ChatMessage = { role: 'model', text: geminiResponse };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg animate-fade-in h-[calc(100vh-200px)] flex flex-col">
            <div className="text-center mb-4">
                <ChatIcon className="w-10 h-10 mx-auto text-violet-600" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-2">Pergunte ao Metta</h2>
                <p className="text-gray-600 text-sm">Seu espaço para conversar e tirar dúvidas.</p>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg scroll-smooth">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 shadow-sm'}`}>
                           <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-800">
                           <div className="flex items-center space-x-1">
                                <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                           </div>
                         </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Diga algo ao Metta..."
                    className="flex-1 p-3 px-5 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:outline-none transition bg-white"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400 transition-all active:scale-90"
                    disabled={isLoading || !inputText.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
