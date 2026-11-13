import * as React from "react";

export function FormattedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (!text) return null;

  // Split by inline backticks e.g. `docker run`
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          const codeSnippet = part.slice(1, -1);
          return (
            <code
              key={index}
              className="inline-block font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 px-2 py-0.5 rounded-lg text-[0.88em] shadow-[0_0_14px_rgba(6,182,212,0.3)] mx-1 align-baseline tracking-tight"
            >
              {codeSnippet}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
