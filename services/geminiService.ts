import { GoogleGenAI, Type } from "@google/genai";
import type { MoodEntry, ChatMessage, Exercise, User, Lead } from '../types';

const FAST_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

const getAIInstance = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const getGeminiResponse = async (prompt: string, systemInstruction?: string, model = FAST_MODEL, useThinking = false): Promise<string> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.8,
                topP: 0.95,
                ...(useThinking && model === PRO_MODEL ? { thinkingConfig: { thinkingBudget: 2000 } } : {})
            }
        });
        return response.text || "Aguardando nova percepção...";
    } catch (error: any) {
        console.error("MettaFort AI Error:", error);
        return "Neste momento, as palavras repousam no silêncio. Tente refletir sobre sua respiração por um instante.";
    }
};

export const registerLead = async (user: User) => {
    const today = new Date().toLocaleString('pt-BR');
    
    // 1. Salva localmente para o painel Admin
    try {
        const currentLeads: Lead[] = JSON.parse(localStorage.getItem('mettafort_captured_leads') || '[]');
        if (!currentLeads.some(l => l.email === user.email)) {
            const newLead: Lead = { ...user, date: today };
            localStorage.setItem('mettafort_captured_leads', JSON.stringify([newLead, ...currentLeads]));
        }
    } catch (e) {
        console.error("Local lead save error", e);
    }

    // 2. Dispara e-mail via FormSubmit (AJAX)
    // Substitua pelo seu e-mail real aqui ou mantenha o placeholder profissional
    const ADMIN_EMAIL = "contato@mettafort.com.br";
    try {
        await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                subject: "NOVO LEAD: MettaFort App",
                nome: user.name,
                email: user.email,
                data: today,
                plataforma: "MettaFort Inteligência Emocional"
            })
        });
        console.log("Lead enviado por e-mail com sucesso.");
    } catch (err) {
        console.error("Erro ao disparar e-mail de lead", err);
    }

    // 3. Log silencioso na IA (opcional)
    try {
        const ai = getAIInstance();
        await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `REGISTRO DE LEAD: ${user.name} (${user.email}) em ${today}`,
            config: { systemInstruction: "Silent logger." }
        });
    } catch (e) {}
};

export const getDailySuggestion = async (mood: MoodEntry | null): Promise<string> => {
    const moodText = mood ? `O usuário está se sentindo: ${mood.mood_name}` : 'Estado emocional não registrado hoje.';
    const prompt = `${moodText}. Com base nisso, dê um conselho curto e profundo para ajudar no equilíbrio emocional.`;
    return getGeminiResponse(prompt, "Você é o Metta, um mentor de inteligência emocional. Seja breve, empático e evite clichês.");
}

export const getAngustiaResponse = async (prompt: string): Promise<string> => {
    return getGeminiResponse(prompt, "Você é um analista psicanalítico. Ouça a angústia e devolva uma interpretação que convide o usuário a olhar para o seu próprio desejo.", PRO_MODEL, true);
};

export const getQAresponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    try {
        const ai = getAIInstance();
        const chat = ai.chats.create({
            model: FAST_MODEL,
            config: { systemInstruction: "Você é o Metta. Um assistente acolhedor e sábio." }
        });
        const response = await chat.sendMessage({ message: prompt });
        return response.text || "Estou te ouvindo...";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Houve uma breve interrupção em nossa sintonia. Poderia repetir?";
    }
};

export const getWeeklySummary = async (moods: MoodEntry[]): Promise<string> => {
    if (moods.length === 0) return "Sua jornada emocional ainda está sendo traçada.";
    const moodsString = moods.map(m => m.mood_name).join(', ');
    const prompt = `Analise os sentimentos da semana: ${moodsString}. Faça um resumo psicológico breve.`;
    return getGeminiResponse(prompt, "Analista emocional. Faça sínteses poéticas e precisas.", PRO_MODEL, true);
};

export const getExercises = async (): Promise<Exercise[]> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: "Gere 3 exercícios curtos de autorreflexão. Formato JSON.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            emoji: { type: Type.STRING }
                        },
                        required: ["title", "description", "emoji"]
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        return [{ title: 'Respiração Consciente', description: 'Inspire em 4 tempos, segure em 4, expire em 4.', emoji: '🧘' }];
    }
};

export const getDreamInterpretation = async (dreamText: string): Promise<string> => {
    const prompt = `Sonho relatado: ${dreamText}. Ofereça uma perspectiva baseada na psicologia simbólica.`;
    return getGeminiResponse(prompt, "Especialista em sonhos e símbolos do inconsciente.", PRO_MODEL, true);
};

export const getDailyReflection = async (): Promise<string> => {
    return getGeminiResponse("Gere um aforismo curto sobre a vida e a mente.", "Sábio contemporâneo. Produza frases originais e profundas.");
}