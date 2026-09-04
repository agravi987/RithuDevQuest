// Shared "deep space" visual tokens for the dark-only galaxy theme.
// Keeps every full-bleed surface and hero card on one consistent palette
// so the Practice / Learn / auth surfaces all feel like the same galaxy.

/** Full-bleed page background gradient (the scroll surface behind stars). */
export const GALAXY_BG =
  "from-[#060914] via-[#0a0f1f] to-[oklch(0.14_0.015_260)]";

/** Emerald-tinted deep-space hero card (daily challenge launch state). */
export const DEEP_SPACE_CARD =
  "bg-gradient-to-br from-[oklch(0.17_0.05_155)] via-[#0f1629] to-[oklch(0.12_0.015_260)]";

/** Subtle deep-space surface (loading / confirmation states). */
export const DEEP_SPACE_SUBTLE =
  "bg-gradient-to-br from-[oklch(0.12_0.03_155)] to-[#0a0f1f]";

/** Amber-tinted deep-space hero card (special / warning states). */
export const DEEP_SPACE_WARM =
  "bg-gradient-to-br from-[oklch(0.17_0.05_70)] via-[#0f1629] to-[oklch(0.12_0.015_260)]";
