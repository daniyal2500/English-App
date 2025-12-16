//src/hooks/useAudioTuner.ts

import { useState, useEffect, useRef } from 'react';

export const useAudioTuner = () => {
    const [state, setState] = useState({
        isListening: false,
        detectedFrequency: null,
        detectedNote: null,
        error: null
    });

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);

    // latestDataRef for audio data
    const latestDataRef = useRef({
        note: null,
        frequency: null
    });

    const start = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 2048;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            setState(prev => ({ ...prev, isListening: true, error: null }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'میکروفون در دسترس نیست'
            }));
        }
    };

    const stop = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setState({
            isListening: false,
            detectedFrequency: null,
            detectedNote: null,
            error: null
        });
        latestDataRef.current = { note: null, frequency: null };
    };

    useEffect(() => {
        return () => {
            stop();
        };
    }, []);

    return {
        isListening: state.isListening,
        note: state.detectedNote,
        error: state.error,
        latestDataRef,
        start,
        stop,
        // Also support old names for compatibility
        startListening: start,
        stopListening: stop
    };
};
