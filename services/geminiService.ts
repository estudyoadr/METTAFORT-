import { GoogleGenAI, Type } from "@google/genai";
import type { MoodEntry, ChatMessage, Exercise, User } from '../types';

const FAST_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

const getAIInstance = () => {
    const key = process.env.API_KEY;
    if (!key) {
        console.warn("API_KEY não configurada no ambiente.");
    }
    return new GoogleGenAI({ apiKey: key || '' });
};

const getGeminiResponse = async (prompt: string, systemInstruction?: string, model = FAST_MODEL, useThinking = false): Promise<string> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
                temperature: 0.9, // Aumentado para maior variabilidade criativa
                topP: 0.95,
                ...(useThinking && model.includes('pro') ? { thinkingConfig: { thinkingBudget: 4000 } } : {})
            }
        });
        return response.text || "Aguardando nova percepção...";
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return "Neste momento, o silêncio convida à introspecção. (Erro técnico de conexão)";
    }
};

export const registerLead = async (user: User) => {
    try {
        const ai = getAIInstance();
        await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `USER_LOGIN: ${user.name} (${user.email})`,
            config: { systemInstruction: "Log event." }
        });
    } catch (e) {}
};

export const getDailySuggestion = async (mood: MoodEntry | null): Promise<string> => {
    const moodText = mood ? `Estado atual: ${mood.mood_name}` : 'Estado indefinido';
    const prompt = `Com base no estado "${moodText}", ofereça uma única orientação psicológica prática e profunda para o bem-estar agora.`;
    return getGeminiResponse(prompt, "Você é o MettaFort Mentor. Use uma linguagem que mescla acolhimento humanista e clareza analítica. Evite clichês motivacionais.");
}

export const getAngustiaResponse = async (prompt: string): Promise<string> => {
    return getGeminiResponse(prompt, "Atue como um analista de orientação psicanalítica. Não dê soluções rápidas; devolva perguntas reflexivas e interpretações simbólicas sobre a angústia relatada.", PRO_MODEL, true);
};

export const getQAresponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    try {
        const ai = getAIInstance();
        const chat = ai.chats.create({
            model: FAST_MODEL,
            config: { systemInstruction: "Você é o Metta. Um assistente que utiliza conceitos de inteligência emocional e psicologia para dialogar de forma empática." }
        });
        const response = await chat.sendMessage({ message: prompt });
        return response.text || "Prossiga, estou te ouvindo...";
    } catch (error) {
        return "Sinto uma interrupção no nosso diálogo. Poderia retomar seu pensamento?";
    }
};

export const getWeeklySummary = async (moods: MoodEntry[]): Promise<string> => {
    if (moods.length === 0) return "Sua jornada está sendo escrita. Comece registrando como se sente hoje.";
    const moodsString = moods.map(m => m.mood_name).join(', ');
    return getGeminiResponse(`Analise esta sequência emocional: ${moodsString}`, "Faça uma síntese poética e psicológica da semana do usuário, apontando possíveis movimentos do inconsciente.", PRO_MODEL, true);
};

export const getExercises = async (): Promise<Exercise[]> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: "Gere 3 exercícios de autorreflexão psicológica. JSON format.",
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
        return [{ title: 'Pausa Reflexiva', description: 'Observe seus pensamentos como nuvens passando.', emoji: '☁️' }];
    }
};

export const getDreamInterpretation = async (dreamText: string): Promise<string> => {
    return getGeminiResponse(`Sonho: ${dreamText}`, "Interprete sob a ótica da psicologia analítica (Jung). Explore símbolos, arquétipos e a compensação do ego.", PRO_MODEL, true);
};

export const getDailyReflection = async (): Promise<string> => {
    const seeds = ["existencialismo", "desejo", "tempo", "perda", "individuação", "sombra", "afeto", "linguagem"];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    return getGeminiResponse(`Gere uma frase curta e profunda sobre ${randomSeed}.`, "Você é um sábio analista. Produza reflexões que soem como aforismos filosóficos e psicológicos. Seja original e evite frases feitas.");
}