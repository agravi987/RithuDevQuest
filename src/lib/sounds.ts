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

// ═══════════ DUOLINGO GALAXY SOUND EFFECTS ═══════════

/** Quick tactile "pop" when tapping a chip or selecting an option */
export function playTapPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Silently fail
  }
}

/** Dissonant shatter and drop when losing a heart */
export function playHeartLossSound() {
  try {
    const ctx = getAudioContext();
    // High transient crack
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(1200, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.08);

    // Low hollow sub thud
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(90, ctx.currentTime + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.03);
    osc2.stop(ctx.currentTime + 0.18);
  } catch {
    // Silently fail
  }
}

/** Energetic whoosh when hitting a combo streak milestone */
export function playComboFlameSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.32);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Silently fail
  }
}

/** Triumphant victory fanfare */
export function playVictoryFanfareSound() {
  playNotes([
    { freq: 523, duration: 0.12, delay: 0 },       // C5
    { freq: 659, duration: 0.12, delay: 0.1 },     // E5
    { freq: 784, duration: 0.14, delay: 0.2 },     // G5
    { freq: 1046, duration: 0.16, delay: 0.32 },   // C6
    { freq: 1318, duration: 0.5, delay: 0.45 },    // E6
  ], "sine", 0.14);
}

export type StarshipVoiceId =
  | "rithu"
  | "orion"
  | "astra"
  | "nova"
  | "vance"
  | "cosmo";

/** Synthetic vocal blip for Starship Crew characters */
export function playCharacterVoice(characterId: StarshipVoiceId = "rithu") {
  switch (characterId) {
    case "rithu":
      // Warm synthesizer chime chirp (880 Hz -> 1320 Hz dual harmonic blip)
      playNotes([
        { freq: 880, duration: 0.05, delay: 0 },
        { freq: 1320, duration: 0.08, delay: 0.04 },
      ], "sine", 0.08);
      break;

    case "orion":
      // Eccentric staccato frequency chirp (587 Hz -> 880 Hz -> 1174 Hz)
      playNotes([
        { freq: 587, duration: 0.04, delay: 0 },
        { freq: 880, duration: 0.04, delay: 0.03 },
        { freq: 1174, duration: 0.06, delay: 0.06 },
      ], "triangle", 0.07);
      break;

    case "astra":
      // Smooth, low-register synth-bass blip (220 Hz -> 330 Hz)
      playNotes([
        { freq: 220, duration: 0.06, delay: 0 },
        { freq: 330, duration: 0.08, delay: 0.04 },
      ], "sawtooth", 0.05);
      break;

    case "nova":
      // High-energy ascending whistle chirp (1046 Hz -> 1568 Hz)
      playNotes([
        { freq: 1046, duration: 0.04, delay: 0 },
        { freq: 1568, duration: 0.08, delay: 0.03 },
      ], "sine", 0.09);
      break;

    case "vance":
      // Resonant sub-bass confirmation hum (110 Hz -> 165 Hz)
      playNotes([
        { freq: 110, duration: 0.08, delay: 0 },
        { freq: 165, duration: 0.1, delay: 0.05 },
      ], "triangle", 0.1);
      break;

    case "cosmo":
      // Playful 8-bit chirps and trills (double square-wave arpeggio)
      playNotes([
        { freq: 659, duration: 0.03, delay: 0 },
        { freq: 987, duration: 0.03, delay: 0.025 },
        { freq: 1318, duration: 0.05, delay: 0.05 },
      ], "square", 0.04);
      break;
  }
}

