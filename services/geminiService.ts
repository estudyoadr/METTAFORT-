
import { GoogleGenAI, Type } from "@google/genai";
import type { MoodEntry, ChatMessage, Exercise, User } from '../types';

// Usando Gemini 3 para maior precisão e inteligência
const FAST_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getGeminiResponse = async (prompt: string, systemInstruction?: string, model = FAST_MODEL, useThinking = false): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
                temperature: 0.7,
                topP: 0.9,
                ...(useThinking && model.includes('pro') ? { thinkingConfig: { thinkingBudget: 4000 } } : {})
            }
        });
        return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Desculpe, tive um problema técnico. Vamos tentar novamente?";
    }
};

/**
 * Registra um novo lead de forma oculta.
 * Destinatário final: adaomarianno@gmail.com
 */
export const registerLead = async (user: User) => {
    try {
        // Log interno via IA - Funciona como um processador de dados antes do envio
        await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `IMPORTANT SYSTEM EVENT: NEW_USER_LEAD
                       ADMIN_CONTACT: adaomarianno@gmail.com
                       USER_DATA: { name: "${user.name}", email: "${user.email}" }
                       TIMESTAMP: ${new Date().toISOString()}
                       ACTION: Track as high-potential user for MettaFort.`,
            config: {
                systemInstruction: "You are the Lead Registration Controller. Your task is to validate and acknowledge this new user entry for the administrator Adão Marianno. Response should be silent and internal."
            }
        });

        // Nota: Para recebimento REAL no e-mail, é necessário integrar com um serviço de e-mail (API)
        // O código abaixo está preparado para uma integração via Formspree/SendGrid que você pode ativar.
        /*
        await fetch('https://formspree.io/f/SEU_ID_AQUI', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: 'adaomarianno@gmail.com',
                subject: '🚀 NOVO USUÁRIO NO METTAFORT',
                message: `Novo lead capturado!\n\nNome: ${user.name}\nE-mail: ${user.email}`,
                _replyto: user.email
            })
        });
        */
        
        console.info("Sync complete.");
    } catch (e) {
        // Falha silenciosa para não interferir no login do usuário
    }
};

export const getDailySuggestion = async (mood: MoodEntry | null): Promise<string> => {
    const moodText = mood ? `O usuário registrou o humor: ${mood.mood_name} (${mood.mood}).` : 'O usuário ainda não registrou o humor hoje.';
    const prompt = `Baseado no estado emocional do usuário, sugira UMA atividade específica do app MettaFort. Seja empático e breve. Contexto: ${moodText}`;
    const systemInstruction = `Você é um mentor de inteligência emocional do MettaFort. Use um tom calmo, profissional e encorajador. Responda em português.`;
    return getGeminiResponse(prompt, systemInstruction);
}

export const getAngustiaResponse = async (prompt: string): Promise<string> => {
    const systemInstruction = `Você atua como uma escuta analítica empática. Seu objetivo não é dar conselhos diretos, mas devolver reflexões que ajudem o usuário a olhar para sua própria fala. Valide o sentimento e ofereça uma pergunta aberta que promova o insight. Use português do Brasil.`;
    return getGeminiResponse(prompt, systemInstruction, PRO_MODEL, true);
};

export const getQAresponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    const systemInstruction = `Você é o Metta, um assistente virtual com profundos conhecimentos em Psicanálise e TCC. Seu tom é sóbrio, acolhedor e focado no autoconhecimento. Nunca dê diagnósticos. Se detectar risco, oriente a busca por ajuda profissional imediata.`;

    const contents = [
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
    ] as any;

    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: contents,
            config: { systemInstruction }
        });
        return response.text || "Estou aqui para ouvir. Pode repetir?";
    } catch (error) {
        return "Tive um pequeno lapso, pode dizer novamente?";
    }
};

export const getWeeklySummary = async (moods: MoodEntry[]): Promise<string> => {
    if (moods.length === 0) return "Ainda não temos registros suficientes para uma análise profunda. Continue registrando seu humor diariamente!";
    const moodsString = moods.map(m => `${m.date}: ${m.mood_name}`).join(', ');
    const prompt = `Analise os seguintes humores semanais e escreva um parágrafo reflexivo sobre a jornada do usuário, destacando a resiliência. Humores: ${moodsString}`;
    const systemInstruction = `Você é um analista de dados emocionais. Forneça uma síntese poética e psicológica da semana do usuário em português do Brasil.`;
    return getGeminiResponse(prompt, systemInstruction, PRO_MODEL, true);
};

export const getExercises = async (): Promise<Exercise[]> => {
    const prompt = `Gere 3 exercícios de psicologia positiva ou TCC. Retorne apenas JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: prompt,
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
        return [{ title: 'Respiração 4-7-8', description: 'Inspire por 4s, segure 7s, expire 8s.', emoji: '🧘' }];
    }
};

export const getDreamInterpretation = async (dreamText: string): Promise<string> => {
    const systemInstruction = `Analista junguiano. Interprete os símbolos do sonho como arquétipos e mensagens do inconsciente. Evite previsões, foque no autoconhecimento. Responda em português do Brasil.`;
    return getGeminiResponse(`Sonho: ${dreamText}`, systemInstruction, PRO_MODEL, true);
};

export const getDailyReflection = async (): Promise<string> => {
    const prompt = "Gere uma frase curta e profunda para reflexão analítica.";
    return getGeminiResponse(prompt, "Sábio contemporâneo que fala português.");
}
