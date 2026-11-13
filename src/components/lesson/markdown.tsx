import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

function renderInline(text: string, index: number): ReactNode[] {
  const parts = text.split(INLINE_PATTERN);
  return parts.map((part, partIndex) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${index}-${partIndex}`}>{part.slice(2, -2)}</strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${index}-${partIndex}`}
          className="rounded-lg bg-black/40 border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[0.95em] text-cyan-300 font-bold shadow-sm"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderParagraph(block: string, index: number): ReactNode[] {
  const lines = block.split("\n");
  return lines.flatMap((line, lineIndex) => {
    const nodes = renderInline(line, index);
    if (lineIndex === 0) return nodes;
    return [<br key={`${index}-br-${lineIndex}`} />, ...nodes];
  });
}

/**
 * Minimal inline markdown renderer — supports **bold** and `code` spans.
 */
export function MarkdownText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={cn("text-base sm:text-lg leading-relaxed text-foreground/90", className)}>
          {renderParagraph(paragraph, index)}
        </p>
      ))}
    </>
  );
}