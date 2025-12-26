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

    // Funções de codificação e decodificação manuais seguindo diretrizes do SDK
    function decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async function decodeAudioData(
        data: Uint8Array,
        ctx: AudioContext,
        sampleRate: number,
        numChannels: number,
    ): Promise<AudioBuffer> {
        const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    function encode(bytes: Uint8Array) {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    const stopSession = () => {
        if (sessionRef.current) {
            sessionRef.current.close();
            sessionRef.current = null;
        }
        sourcesRef.current.forEach(s => {
            try { s.stop(); } catch(e) {}
        });
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
        setIsConnecting(false);
        setStatus('Sessão encerrada.');
        nextStartTimeRef.current = 0;
    };

    useEffect(() => {
        return () => stopSession();
    }, []);

    const startSession = async () => {
        if (isConnecting || isActive) return;
        setIsConnecting(true);
        setStatus('Sintonizando sua frequência...');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            if (inputCtx.state === 'suspended') await inputCtx.resume();
            if (outputCtx.state === 'suspended') await outputCtx.resume();

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
                        setStatus('Metta está te ouvindo...');
                        
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
                            
                            sessionPromise.then(s => {
                                try { s.sendRealtimeInput({ media: pcmBlob }); } catch(err) {}
                            });
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
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                        }
                        if (msg.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e) => {
                        console.error("Metta Live Error", e);
                        setStatus('Houve um pequeno ruído na conexão.');
                        setIsConnecting(false);
                    },
                    onclose: () => stopSession()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'Você é o Metta, um suporte emocional de voz. Fale pausadamente, com empatia psicanalítica. Incentive a respiração.'
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error(err);
            setStatus('Por favor, verifique o microfone.');
            setIsConnecting(false);
        }
    };

    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl animate-fade-in flex flex-col items-center justify-center min-h-[550px] border border-teal-50 relative overflow-hidden">
            {/* Elementos Visuais de Background */}
            <div className={`absolute w-80 h-80 rounded-full border-2 border-teal-100/50 transition-all duration-1000 ${isActive ? 'scale-150 opacity-20' : 'scale-0 opacity-0'}`}></div>
            <div className={`absolute w-[30rem] h-[30rem] rounded-full border border-teal-50/30 transition-all duration-1000 delay-300 ${isActive ? 'scale-150 opacity-10' : 'scale-0 opacity-0'}`}></div>

            <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${isActive ? 'bg-teal-500 shadow-[0_0_60px_rgba(20,184,166,0.6)] scale-110' : 'bg-gray-100 shadow-inner'}`}>
                <div className={`absolute w-full h-full rounded-full border-4 border-teal-200/50 ${isActive ? 'animate-ping' : ''}`}></div>
                <MicIcon className={`w-16 h-16 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            </div>

            <div className="mt-14 text-center relative z-10">
                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Metta Live</h2>
                <p className={`text-xl mt-3 font-semibold transition-colors duration-500 ${isActive ? 'text-teal-600' : 'text-gray-400'}`}>{status}</p>
            </div>

            <div className="mt-12 max-w-md text-center relative z-10">
                <p className="text-gray-500 text-sm italic leading-relaxed px-4">
                    {isActive 
                        ? "O espaço entre sua voz e o silêncio é onde o Metta te encontra. Sinta-se à vontade." 
                        : "Sessão de voz instantânea. Use em momentos de crise, ansiedade ou quando precisar apenas de uma escuta sábia."}
                </p>
            </div>

            <button
                onClick={isActive ? stopSession : startSession}
                disabled={isConnecting}
                className={`mt-14 px-12 py-5 rounded-full text-xl font-bold transition-all shadow-xl active:scale-95 relative z-10 ${isActive ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white animate-pulse-soft'}`}
            >
                {isConnecting ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Conectando...</span>
                    </div>
                ) : (isActive ? 'Encerrar Conexão' : 'Começar a Falar')}
            </button>
        </div>
    );
};