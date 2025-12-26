import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSecretTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onSecretTrigger }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 7) {
      if (onSecretTrigger) onSecretTrigger();
      setClickCount(0);
    }
    // Reset count after 3 seconds of inactivity
    setTimeout(() => setClickCount(0), 3000);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-50 p-4 select-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer active:opacity-70 transition-opacity"
          onClick={handleTitleClick}
        >
            <HeartIcon className="w-8 h-8 text-teal-500"/>
            <span className="text-2xl font-black text-gray-800 hidden sm:block uppercase tracking-tight">METTA FORT</span>
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
          <span className="text-gray-700 hidden lg:block text-sm">
            Olá, <span className="font-bold text-teal-700">{user.name.split(' ')[0]}</span>
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-bold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition active:scale-95"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};