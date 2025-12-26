
import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { HeartIcon } from './icons/HeartIcon';

const ServicePackage: React.FC<{ title: string; description: string; features: string[]; link: string }> = ({ title, description, features, link }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col">
        <div className="flex-1">
            <h3 className="text-xl font-bold text-teal-700">{title}</h3>
            <p className="text-gray-600 mt-2 mb-4">{description}</p>
            <ul className="space-y-2 text-gray-700">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <HeartIcon className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block text-center mt-6 bg-teal-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-teal-700 transition-colors"
        >
            Saiba Mais e Agende
        </a>
    </div>
);

export const ServicosPage: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                <CalendarIcon className="w-12 h-12 mx-auto text-teal-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Serviços e Agendamentos</h2>
                <p className="text-gray-600 mt-1 max-w-2xl mx-auto">Oferecemos um acompanhamento profissional para aprofundar sua jornada de autoconhecimento e bem-estar emocional.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <ServicePackage
                    title="Sessão de Terapia Individual"
                    description="Um espaço seguro e confidencial para explorar suas questões pessoais com o apoio de um terapeuta qualificado."
                    features={["Sessões de 50 minutos", "Abordagem personalizada", "Flexibilidade de horários"]}
                    link="https://www.mettafort.com.br/terapia"
                />
                <ServicePackage
                    title="Pacote de Desenvolvimento Pessoal"
                    description="Um programa estruturado para quem busca atingir objetivos específicos, desenvolver novos hábitos e promover uma transformação duradoura."
                    features={["4 sessões mensais", "Ferramentas e exercícios práticos", "Suporte contínuo via WhatsApp"]}
                    link="https://www.mettafort.com.br/pacotes"
                />
            </div>
        </div>
    );
};
