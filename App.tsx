
import React, { useState, useEffect } from 'react';
import { Page, User } from './types';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AngustiasPage } from './components/AngustiasPage';
import { ConselhoPage } from './components/ConselhoPage';
import { QAPage } from './components/QAPage';
import { SonhosPage } from './components/SonhosPage';
import { ExerciciosPage } from './components/ExerciciosPage';
import { MeditacaoPage } from './components/MeditacaoPage';
import { ProgressoPage } from './components/ProgressoPage';
import { ServicosPage } from './components/ServicosPage';
import { MettaLivePage } from './components/MettaLivePage';
import { HomeIcon } from './components/icons/HomeIcon';
import { BrainIcon } from './components/icons/BrainIcon';
import { ChartIcon } from './components/icons/ChartIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { MicIcon } from './components/icons/MicIcon';
import { registerLead } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  useEffect(() => {
    const savedUser = localStorage.getItem('mettafort_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    const isNewLead = !localStorage.getItem('mettafort_user');
    setUser(loggedInUser);
    localStorage.setItem('mettafort_user', JSON.stringify(loggedInUser));

    if (isNewLead) {
      registerLead(loggedInUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.HOME);
    localStorage.removeItem('mettafort_user');
  };

  const renderPage = () => {
    if (!user) return null;
    switch (currentPage) {
      case Page.ANGUSTIAS: return <AngustiasPage onNavigate={setCurrentPage} />;
      case Page.CONSELHO: return <ConselhoPage />;
      case Page.QA: return <QAPage />;
      case Page.SONHOS: return <SonhosPage />;
      case Page.EXERCICIOS: return <ExerciciosPage />;
      case Page.MEDITACAO: return <MeditacaoPage />;
      case Page.PROGRESSO: return <ProgressoPage onNavigate={setCurrentPage} />;
      case Page.SERVICOS: return <ServicosPage />;
      case Page.LIVE: return <MettaLivePage />;
      case Page.HOME:
      default:
        return <HomePage user={user} onNavigate={setCurrentPage} />;
    }
  };

  const navItems = [
    { page: Page.HOME, label: "Painel", icon: HomeIcon },
    { page: Page.LIVE, label: "Metta Live", icon: MicIcon },
    { page: Page.PROGRESSO, label: "Progresso", icon: ChartIcon },
    { page: Page.ANGUSTIAS, label: "Angústias", icon: BrainIcon },
    { page: Page.SERVICOS, label: "Serviços", icon: CalendarIcon },
  ];

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] selection:bg-teal-100">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-72">
            <nav className="sticky top-28 space-y-3">
                {navItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => setCurrentPage(item.page)}
                        className={`w-full flex items-center px-6 py-4 text-sm font-bold rounded-2xl transition-all duration-300 ${
                            currentPage === item.page
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 translate-x-1'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-4 flex-shrink-0" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>

        <main className="flex-1 min-w-0 mb-20 md:mb-0">
            {renderPage()}
        </main>
      </div>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around p-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
            <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`p-2 rounded-xl flex flex-col items-center transition-all ${currentPage === item.page ? 'text-teal-600 scale-110' : 'text-gray-400'}`}
            >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-bold">{item.label}</span>
            </button>
        ))}
      </nav>
      
      <Footer />
    </div>
  );
};

export default App;
