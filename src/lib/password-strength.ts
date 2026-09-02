export type PasswordStrength = {
  score: 0 | 1 | 2 | 3;
  label: string;
  checks: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    symbol: boolean;
  };
};

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  let score: PasswordStrength["score"];
  if (!checks.length || password.length === 0) score = 0;
  else if (passed <= 2) score = 1;
  else if (passed <= 4) score = 2;
  else score = 3;

  const labels: Record<PasswordStrength["score"], string> = {
    0: "Very weak",
    1: "Weak",
    2: "Good",
    3: "Strong",
  };

  return { score, label: labels[score], checks };
}