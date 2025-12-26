import React, { useState, useEffect } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import type { Lead } from '../types';

export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        const storedLeads = localStorage.getItem('mettafort_captured_leads');
        if (storedLeads) {
            setLeads(JSON.parse(storedLeads));
        }
    }, []);

    const exportToCSV = () => {
        if (leads.length === 0) return;
        const headers = "Nome,E-mail,Data de Cadastro\n";
        const rows = leads.map(l => `${l.name},${l.email},${l.date}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `leads_mettafort_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-teal-50 animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <div className="inline-flex p-3 bg-rose-50 rounded-2xl mb-2">
                        <HeartIcon className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Painel de Leads</h2>
                    <p className="text-gray-500 font-medium">Controle de novos usuários do MettaFort.</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    disabled={leads.length === 0}
                    className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-200"
                >
                    Exportar Planilha (CSV)
                </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">E-mail</th>
                            <th className="px-6 py-4">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.map((lead, idx) => (
                            <tr key={idx} className="hover:bg-teal-50/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800">{lead.name}</td>
                                <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{lead.date}</td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                    Nenhum lead captado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100 text-center">
                <p className="text-teal-800 text-sm font-medium">
                    Nota: Os leads também são disparados para <strong>contato@mettafort.com.br</strong> via FormSubmit.
                    Certifique-se de verificar sua caixa de entrada e a pasta de Spam.
                </p>
            </div>
        </div>
    );
};