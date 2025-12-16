//src/services/audio/audioInit.ts

// --- INITIALIZATION SERVICE ---
// Handles Microphone access and AudioContext creation only.

export const initAudio = async () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // ENABLED AutoGainControl: Critical for guitar. 
  // Without this, the guitar signal is often too weak compared to voice.
  // ENABLED NoiseSuppression: Helps isolate the musical tone from room hiss.
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: { 
      echoCancellation: false, // Keep false for music (prevents cutting sustain)
      autoGainControl: true,   // CHANGED: True helps boost quiet guitar plucks
      noiseSuppression: true,  // CHANGED: True helps reduce background hum
      sampleRate: 44100        // Request standard audio rate
    } 
  });
  
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  
  // Increased buffer size for better bass frequency resolution (Low E string)
  analyser.fftSize = 4096; 
  analyser.smoothingTimeConstant = 0.0; // No smoothing, we want raw immediate data
  source.connect(analyser);

  return { audioContext, analyser };
};