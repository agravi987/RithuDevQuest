import confetti from "canvas-confetti";

// Color palettes for different events
const COLORS = {
  correct: ["#58CC02", "#89E219", "#A8E42B", "#73D13D"],
  lessonComplete: ["#58CC02", "#FFD700", "#FF6B35", "#A855F7", "#3B82F6", "#EC4899"],
  levelUp: ["#FFD700", "#FFA500", "#FF6B35", "#FF4500", "#FF8C00"],
  achievement: ["#A855F7", "#7C3AED", "#6D28D9", "#5B21B6", "#FFD700"],
  streak: ["#FF6B35", "#FF8C00", "#FFA500", "#FF4500", "#FFD700"],
  xp: ["#FFD700", "#FFC107", "#FFB300", "#FFA000"],
  wrong: ["#6B7280", "#9CA3AF", "#D1D5DB"],
  questComplete: ["#58CC02", "#A855F7", "#FFD700", "#3B82F6"],
};

/**
 * Correct answer — quick green burst from center
 */
export function correctAnswerConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    gravity: 0.8,
    ticks: 100,
    origin: { y: 0.6 },
    colors: COLORS.correct,
    shapes: ["circle"],
    scalar: 0.8,
  });
}

/**
 * Lesson complete — full celebration with dual cannons
 */
export function lessonCompleteConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: COLORS.lessonComplete,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: COLORS.lessonComplete,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();

  // Center burst
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 120,
      startVelocity: 35,
      gravity: 0.5,
      ticks: 150,
      origin: { y: 0.5 },
      colors: COLORS.lessonComplete,
      shapes: ["circle", "square"],
      scalar: 1.2,
    });
  }, 500);
}

/**
 * Level up — big rainbow explosion with stars
 */
export function levelUpConfetti() {
  // Big center burst
  confetti({
    particleCount: 150,
    spread: 120,
    startVelocity: 40,
    gravity: 0.4,
    ticks: 200,
    origin: { y: 0.4 },
    colors: COLORS.levelUp,
    shapes: ["circle"],
    scalar: 1.5,
  });

  // Side cannons
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: COLORS.levelUp,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: COLORS.levelUp,
    });
  }, 200);

  // Star shower
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 160,
      startVelocity: 20,
      gravity: 0.3,
      ticks: 250,
      origin: { y: 0.3 },
      colors: ["#FFD700", "#FFA500"],
      shapes: ["star"],
      scalar: 1.8,
    });
  }, 400);
}

/**
 * Achievement unlock — purple/gold sparkle burst
 */
export function achievementConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 30,
    gravity: 0.6,
    ticks: 150,
    origin: { y: 0.5 },
    colors: COLORS.achievement,
    shapes: ["circle", "star"],
    scalar: 1.2,
  });

  // Gold sparkle shower
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 80,
      startVelocity: 25,
      gravity: 0.5,
      ticks: 120,
      origin: { y: 0.4 },
      colors: ["#FFD700", "#FFC107"],
      shapes: ["star"],
      scalar: 1.5,
    });
  }, 300);
}

/**
 * Streak milestone — fire-colored burst
 */
export function streakConfetti() {
  confetti({
    particleCount: 60,
    spread: 80,
    startVelocity: 30,
    gravity: 0.7,
    ticks: 120,
    origin: { y: 0.5 },
    colors: COLORS.streak,
    shapes: ["circle"],
    scalar: 1,
  });

  // Fire particles from bottom
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 270,
      spread: 40,
      startVelocity: 40,
      origin: { x: 0.5, y: 1 },
      colors: COLORS.streak,
      shapes: ["circle"],
      scalar: 0.8,
    });
  }, 150);
}

/**
 * XP gain — gold sparkle
 */
export function xpGainConfetti() {
  confetti({
    particleCount: 15,
    spread: 40,
    startVelocity: 15,
    gravity: 1,
    ticks: 60,
    origin: { y: 0.6 },
    colors: COLORS.xp,
    shapes: ["circle"],
    scalar: 0.6,
  });
}

/**
 * Quest complete — green/purple/gold celebration
 */
export function questCompleteConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 30,
    gravity: 0.5,
    ticks: 150,
    origin: { y: 0.5 },
    colors: COLORS.questComplete,
    shapes: ["circle", "star"],
    scalar: 1.1,
  });
}

/**
 * Wrong answer — subtle red puff (not punishing)
 */
export function wrongAnswerEffect() {
  confetti({
    particleCount: 8,
    spread: 30,
    startVelocity: 10,
    gravity: 1.5,
    ticks: 40,
    origin: { y: 0.6 },
    colors: COLORS.wrong,
    shapes: ["circle"],
    scalar: 0.5,
  });
}

/**
 * Big celebration for special events
 */
export function bigCelebration() {
  const colors = ["#FFD700", "#FF6B35", "#A855F7", "#58CC02", "#3B82F6"];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 120,
        startVelocity: 35 + i * 5,
        gravity: 0.4,
        ticks: 200,
        origin: { x: 0.5, y: 0.5 },
        colors,
        shapes: ["circle", "star", "square"],
        scalar: 1 + i * 0.1,
      });
    }, i * 200);
  }
}
