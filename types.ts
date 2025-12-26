
export interface User {
  name: string;
  email: string;
}

export enum Page {
  HOME = 'home',
  ANGUSTIAS = 'angustias',
  CONSELHO = 'conselho',
  QA = 'qa',
  SONHOS = 'sonhos',
  EXERCICIOS = 'exercicios',
  MEDITACAO = 'meditacao',
  PROGRESSO = 'progresso',
  SERVICOS = 'servicos',
  LIVE = 'live'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Advice {
  id: number;
  text: string;
  date: string;
}

export interface MoodEntry {
    date: string; // YYYY-MM-DD
    mood: string; // emoji
    mood_name: string;
}

export interface Meditation {
    id: number;
    title: string;
    description: string;
    type: string;
    duration: number; // in seconds
}

export interface Dream {
    id: number;
    date: string;
    text: string;
    interpretation?: string;
}

export interface Exercise {
    title: string;
    description: string;
    emoji: string;
}
