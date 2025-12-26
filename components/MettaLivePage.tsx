
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { MicIcon } from './icons/MicIcon';

export const MettaLivePage: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Pronto para conversar?');
    const [isConnecting, setIsConnecting] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const sessionRef = useRef<any>(null);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
    const streamRef = useRef<MediaStream | null>(null);

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const stopSession = () => {
        if (sessionRef.current) {
            sessionRef.current.close();
            sessionRef.current = null;
        }
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }

        setIsActive(false);
        setStatus('Sessão encerrada.');
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopSession();
        };
    }, []);

    const startSession = async () => {
        setIsConnecting(true);
        setStatus('Conectando ao Metta...');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = inputCtx;
            outputAudioContextRef.current = outputCtx;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        setStatus('Metta está ouvindo...');
                        
                        const source = inputCtx.createMediaStreamSource(stream);
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                            
                            const pcmBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);
                    },
                    onmessage: async (msg) => {
                        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                        }
                        if (msg.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => s.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: () => setStatus('Erro na conexão.'),
                    onclose: () => stopSession()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
                    systemInstruction: 'Você é o Metta, um assistente de voz terapêutico. Fale de forma calma, pausada e empática. Seu objetivo é ajudar o usuário a respirar e se acalmar através da voz. Responda brevemente e sempre convide à respiração. Use português do Brasil.'
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error(err);
            setStatus('Falha ao acessar microfone.');
            setIsConnecting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl animate-fade-in flex flex-col items-center justify-center min-h-[500px] border border-teal-50">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-teal-500 shadow-[0_0_50px_rgba(20,184,166,0.5)] scale-110' : 'bg-gray-100'}`}>
                <div className={`absolute w-full h-full rounded-full border-4 border-teal-200 ${isActive ? 'animate-ping' : ''}`}></div>
                <MicIcon className={`w-12 h-12 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            </div>

            <div className="mt-12 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Metta Ao Vivo</h2>
                <p className={`text-lg mt-2 font-medium ${isActive ? 'text-teal-600' : 'text-gray-500'}`}>{status}</p>
            </div>

            <div className="mt-10 max-w-sm text-center">
                <p className="text-gray-500 text-sm italic">
                    {isActive 
                        ? "O Metta está sintonizado com sua voz. Respire fundo e fale o que vier à mente." 
                        : "Uma sessão de voz em tempo real para momentos de crise ou necessidade de escuta imediata."}
                </p>
            </div>

            <button
                onClick={isActive ? stopSession : startSession}
                disabled={isConnecting}
                className={`mt-10 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg active:scale-95 ${isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
            >
                {isConnecting ? 'Conectando...' : (isActive ? 'Encerrar Sessão' : 'Iniciar Conversa')}
            </button>
        </div>
    );
};
