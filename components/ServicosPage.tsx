import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MicIcon } from './icons/MicIcon';

const ServicePackage: React.FC<{ title: string; description: string; features: string[]; siteLink: string; waLink: string }> = ({ title, description, features, siteLink, waLink }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="flex-1">
            <div className="inline-block p-3 bg-teal-50 rounded-2xl mb-4">
                <HeartIcon className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-2xl font-black text-teal-800">{title}</h3>
            <p className="text-gray-600 mt-3 mb-6 leading-relaxed">{description}</p>
            <ul className="space-y-4 text-gray-700 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm font-medium">
                        <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="space-y-4 mt-auto">
            <a 
                href={siteLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-center w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95"
            >
                Saiba Mais no Site
            </a>
            <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-full bg-emerald-50 text-emerald-700 font-bold py-4 px-6 rounded-2xl hover:bg-emerald-100 transition-all border border-emerald-100 active:scale-95"
            >
                <MicIcon className="w-5 h-5 mr-3" />
                Conversar no WhatsApp
            </a>
        </div>
    </div>
);

export const ServicosPage: React.FC = () => {
    const WHATSAPP_URL = "https://wa.me/5522998556178?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20MettaFort.";
    // Link base corrigido para evitar erro 404 em subpáginas inexistentes
    const SITE_URL = "https://www.mettafort.com.br";

    return (
        <div className="animate-fade-in space-y-10 pb-16">
            <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-teal-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <CalendarIcon className="w-48 h-48" />
                </div>
                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Cuidado Profissional</h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                    A tecnologia nos auxilia, mas o encontro humano transforma. Explore nossas modalidades de acompanhamento presencial e online.
                </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10">
                <ServicePackage
                    title="Análise Psicanalítica"
                    description="Um mergulho profundo no seu inconsciente para desatar nós e descobrir novos caminhos de liberdade."
                    features={["Sessões individuais focadas", "Ambiente seguro e ético", "Suporte para angústias e traumas"]}
                    siteLink={SITE_URL}
                    waLink={WHATSAPP_URL}
                />
                <ServicePackage
                    title="Imersão MettaFort"
                    description="Treinamento estruturado de inteligência emocional para alta performance e estabilidade mental."
                    features={["Acompanhamento personalizado", "Ferramentas práticas diárias", "Foco em resultados e resiliência"]}
                    siteLink={SITE_URL}
                    waLink={WHATSAPP_URL}
                />
            </div>

            <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                <div className="relative z-10">
                    <p className="text-white text-xl font-bold mb-6">Ficou com alguma dúvida?</p>
                    <a 
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-10 py-5 bg-white text-teal-700 font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        Falar com Adão Mariano
                    </a>
                </div>
            </div>
        </div>
    );
};