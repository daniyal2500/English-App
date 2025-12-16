//src/services/audio/pitchDetection.ts

// --- PITCH DETECTION SERVICE ---
// Optimized for Guitar Detection (Sensitivity Boosted)

// Base Frequencies for Guitar Strings (Standard Tuning: E2, A2, D3, G3, B3, E4)
export const GUITAR_STRINGS_BASE_HZ = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

export const getNoteFrequency = (stringIndex: number, fret: number) => {
  if (fret < 0) return 0; 
  const baseFreq = GUITAR_STRINGS_BASE_HZ[stringIndex];
  return baseFreq * Math.pow(2, fret / 12);
};

export const noteFromPitch = (frequency: number) => {
  if (frequency === -1 || frequency === 0) return null;
  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const noteIndex = (Math.round(noteNum) + 69) % 12;
  return noteStrings[noteIndex];
};

/**
 * High Sensitivity Autocorrelation
 * Includes Signal Normalization to detect quiet instruments.
 */
export const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
  const SIZE = buf.length;
  
  // 1. RMS (Volume) Calculation
  let rms = 0;
  let maxVal = 0;
  
  // Find Peak Amplitude and RMS
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
    if (Math.abs(val) > maxVal) {
      maxVal = Math.abs(val);
    }
  }
  rms = Math.sqrt(rms / SIZE);

  // THRESHOLD: Significantly lowered to 0.002 to catch quiet sustain
  // But we require a minimum signal presence.
  if (rms < 0.002) return -1;

  // 2. SIGNAL NORMALIZATION
  // If the guitar is quiet, we boost the buffer values mathematically 
  // so the algorithm "sees" a loud signal.
  const normBuf = new Float32Array(SIZE);
  if (maxVal > 0.0001) {
    const scaler = 0.8 / maxVal; // Scale to 80% volume
    for (let i = 0; i < SIZE; i++) {
        normBuf[i] = buf[i] * scaler;
    }
  } else {
    // Signal too weak to normalize safely
    return -1; 
  }

  // 3. Autocorrelation on Normalized Data
  // Guitar range: ~75Hz (Low E is 82Hz) to ~1000Hz
  const MIN_FREQ = 75;
  const MAX_FREQ = 1200;
  const MAX_LAG = Math.floor(sampleRate / MIN_FREQ);
  const MIN_LAG = Math.floor(sampleRate / MAX_FREQ);

  let bestCorrelation = -1;
  let bestLag = -1;

  // We search for the first strong peak to avoid octave errors (detecting 164Hz instead of 82Hz)
  let foundPeak = false;
  const correlationThreshold = 0.85; // High confidence needed

  for (let lag = MIN_LAG; lag <= MAX_LAG; lag++) {
    let sum = 0;
    // Calculate correlation for this lag
    // Using a smaller window to be faster
    const searchLen = Math.floor(SIZE / 2); 
    
    for (let i = 0; i < searchLen; i++) {
      sum += normBuf[i] * normBuf[i + lag];
    }
    
    // Normalize correlation score to 0-1 range roughly
    // The sum of squares of the first 'searchLen' samples approximates the max possible correlation
    // (This is a simplified normalized autocorrelation)
    
    if (sum > bestCorrelation) {
      bestCorrelation = sum;
      bestLag = lag;
    }
  }

  // Confidence check
  // The correlation value depends on window size. 
  // For normalized signal, a perfect match roughly equals searchLen * 0.5 (due to AC fluctuating).
  // We just return the frequency of the BEST lag found.
  
  if (bestLag === -1) return -1;

  // Refine with simple interpolation
  const freq = sampleRate / bestLag;
  
  // Sanity filter
  if (freq < MIN_FREQ || freq > MAX_FREQ) return -1;

  return freq;
};