
import { GoogleGenAI, Type } from "@google/genai";
import type { MoodEntry, ChatMessage, Exercise, User } from '../types';

const FAST_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

// Função para obter a instância do SDK de forma segura
const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY não encontrada. Verifique as variáveis de ambiente.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

const getGeminiResponse = async (prompt: string, systemInstruction?: string, model = FAST_MODEL, useThinking = false): Promise<string> => {
    try {
        const ai = getAI();
        if (!ai) return "Sistema em manutenção (Erro de Configuração).";

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
        return response.text || "Não consegui processar agora.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Tive um problema técnico. Tente novamente em alguns instantes.";
    }
};

export const registerLead = async (user: User) => {
    const ai = getAI();
    if (!ai) return;
    try {
        await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `NEW_USER: ${user.name} (${user.email})`,
            config: { systemInstruction: "Register lead internally for adaomarianno@gmail.com" }
        });
    } catch (e) {}
};

export const getDailySuggestion = async (mood: MoodEntry | null): Promise<string> => {
    const moodText = mood ? `Humor: ${mood.mood_name}` : 'Sem humor hoje';
    return getGeminiResponse(`Sugira uma atividade breve para: ${moodText}`, "Você é o MettaFort Mentor.");
}

export const getAngustiaResponse = async (prompt: string): Promise<string> => {
    return getGeminiResponse(prompt, "Escuta analítica empática. Devolva reflexões.", PRO_MODEL, true);
};

export const getQAresponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Serviço indisponível.";
    
    const contents = [
        ...history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
    ] as any;

    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents,
            config: { systemInstruction: "Você é o Metta, assistente de bem-estar." }
        });
        return response.text || "Diga mais...";
    } catch (error) {
        return "Tive um lapso, repita?";
    }
};

export const getWeeklySummary = async (moods: MoodEntry[]): Promise<string> => {
    if (moods.length === 0) return "Registre seu humor para análise.";
    const moodsString = moods.map(m => m.mood_name).join(', ');
    return getGeminiResponse(`Analise estes humores: ${moodsString}`, "Analista poético e psicológico.", PRO_MODEL, true);
};

export const getExercises = async (): Promise<Exercise[]> => {
    const ai = getAI();
    if (!ai) return [];
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: "Gere 3 exercícios de psicologia positiva. JSON format.",
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
        return [{ title: 'Respiração', description: 'Inspire e expire.', emoji: '🧘' }];
    }
};

export const getDreamInterpretation = async (dreamText: string): Promise<string> => {
    return getGeminiResponse(`Sonho: ${dreamText}`, "Analista junguiano.", PRO_MODEL, true);
};

export const getDailyReflection = async (): Promise<string> => {
    return getGeminiResponse("Frase curta para reflexão.", "Sábio analítico.");
}
