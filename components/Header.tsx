
import React from 'react';
import type { User } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-10 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <HeartIcon className="w-8 h-8 text-teal-500"/>
            <span className="text-2xl font-bold text-gray-800 hidden sm:block uppercase tracking-wide">METTA FORT</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 hidden md:block">
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
