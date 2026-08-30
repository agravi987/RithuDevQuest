/**
 * Sound effects using Web Audio API.
 * No external audio files needed — tones are generated programmatically.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.15,
  delay: number = 0
) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + delay + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch {
    // Silently fail if audio context is not available
  }
}

function playNotes(
  notes: { freq: number; duration: number; delay: number }[],
  type: OscillatorType = "sine",
  volume: number = 0.12
) {
  for (const note of notes) {
    playTone(note.freq, note.duration, type, volume, note.delay);
  }
}

// ═══════════ EXPORTED SOUND EFFECTS ═══════════

/** Bright ascending "ding" for correct answers */
export function playCorrectSound() {
  playNotes([
    { freq: 523, duration: 0.15, delay: 0 },     // C5
    { freq: 659, duration: 0.15, delay: 0.08 },   // E5
    { freq: 784, duration: 0.2, delay: 0.16 },    // G5
  ], "sine", 0.12);
}

/** Soft descending "buzz" for wrong answers */
export function playWrongSound() {
  playNotes([
    { freq: 330, duration: 0.15, delay: 0 },      // E4
    { freq: 262, duration: 0.25, delay: 0.1 },    // C4
  ], "triangle", 0.1);
}

/** Fanfare for level up — 3-note ascending with harmonics */
export function playLevelUpSound() {
  playNotes([
    { freq: 523, duration: 0.2, delay: 0 },       // C5
    { freq: 659, duration: 0.2, delay: 0.15 },    // E5
    { freq: 784, duration: 0.2, delay: 0.3 },     // G5
    { freq: 1047, duration: 0.4, delay: 0.45 },   // C6
  ], "sine", 0.15);
  // Add a harmony layer
  playNotes([
    { freq: 392, duration: 0.3, delay: 0.3 },     // G4
    { freq: 523, duration: 0.5, delay: 0.45 },    // C5
  ], "triangle", 0.08);
}

/** Sparkle chime for achievement unlock */
export function playAchievementSound() {
  playNotes([
    { freq: 880, duration: 0.1, delay: 0 },       // A5
    { freq: 1109, duration: 0.1, delay: 0.08 },   // C#6
    { freq: 1319, duration: 0.1, delay: 0.16 },   // E6
    { freq: 1568, duration: 0.3, delay: 0.24 },   // G6
  ], "sine", 0.1);
}

/** Fire crackle for streak milestone */
export function playStreakSound() {
  playNotes([
    { freq: 440, duration: 0.1, delay: 0 },       // A4
    { freq: 554, duration: 0.1, delay: 0.06 },    // C#5
    { freq: 659, duration: 0.15, delay: 0.12 },   // E5
    { freq: 880, duration: 0.25, delay: 0.18 },   // A5
  ], "sawtooth", 0.06);
}

/** Subtle click for button taps */
export function playClickSound() {
  playTone(800, 0.05, "sine", 0.06);
}

/** Celebration jingle for lesson complete */
export function playLessonCompleteSound() {
  playNotes([
    { freq: 523, duration: 0.15, delay: 0 },      // C5
    { freq: 587, duration: 0.15, delay: 0.1 },    // D5
    { freq: 659, duration: 0.15, delay: 0.2 },    // E5
    { freq: 784, duration: 0.15, delay: 0.3 },    // G5
    { freq: 1047, duration: 0.4, delay: 0.4 },    // C6
  ], "sine", 0.12);
  // Harmony
  playNotes([
    { freq: 392, duration: 0.2, delay: 0.2 },     // G4
    { freq: 523, duration: 0.2, delay: 0.3 },     // C5
    { freq: 659, duration: 0.4, delay: 0.4 },     // E5
  ], "triangle", 0.06);
}

/** XP gain sound — quick ascending blip */
export function playXpGainSound() {
  playNotes([
    { freq: 660, duration: 0.08, delay: 0 },      // E5
    { freq: 880, duration: 0.12, delay: 0.06 },   // A5
  ], "sine", 0.08);
}

/** Quest complete sound */
export function playQuestCompleteSound() {
  playNotes([
    { freq: 784, duration: 0.12, delay: 0 },      // G5
    { freq: 988, duration: 0.12, delay: 0.1 },    // B5
    { freq: 1175, duration: 0.12, delay: 0.2 },   // D6
    { freq: 1568, duration: 0.35, delay: 0.3 },   // G6
  ], "sine", 0.1);
}

/**
 * Resume audio context (must be called after user interaction).
 * Browsers require a user gesture before playing audio.
 */
export function resumeAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  } catch {
    // Ignore
  }
}
