
import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Previne o prompt padrão do navegador
      e.preventDefault();
      // Guarda o evento para disparar quando o usuário clicar no botão
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-10 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <HeartIcon className="w-8 h-8 text-teal-500"/>
            <span className="text-2xl font-bold text-gray-800 hidden sm:block uppercase tracking-wide">METTA FORT</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-2 text-xs md:text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition animate-bounce"
            >
              Baixar App
            </button>
          )}
          <span className="text-gray-700 hidden lg:block">
            Olá, <span className="font-semibold">{user.name}</span>!
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 border border-transparent rounded-lg hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};
