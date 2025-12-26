
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-8 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} MettaFort App. Todos os direitos reservados.</p>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-700">
          <a href="https://www.instagram.com/adaomarianno" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition">
            Instagram: @adaomarianno
          </a>
          <a href="https://wa.me/5522998556178" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition">
            WhatsApp: +55 22 99855-6178
          </a>
          <a href="https://www.mettafort.com.br" target="_blank" rel="noopener noreferrer" className="font-bold text-teal-700 hover:text-teal-500 transition">
            www.mettafort.com.br
          </a>
        </div>
      </div>
    </footer>
  );
};
