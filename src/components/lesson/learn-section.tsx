import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";
import { BookOpen, ArrowRight } from "lucide-react";

type LearnSectionProps = {
  title: string;
  body: string;
  onContinue: () => void;
};

export function LearnSection({ title, body, onContinue }: LearnSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      {/* Section header with animated icon */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary animate-pulse-ring">
          <BookOpen className="size-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Learning Material
        </span>
      </motion.div>

      {/* Content card with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        <h2 className="text-xl font-bold tracking-tight mb-4">{title}</h2>
        <div className="prose-sm max-w-none text-muted-foreground leading-relaxed">
          <MarkdownText text={body} />
        </div>
      </motion.div>

      {/* Continue button with glow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="self-end"
      >
        <Button
          onClick={onContinue}
          className="group h-11 px-6 rounded-xl font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] btn-glow"
        >
          Continue
          <ArrowRight className="size-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </section>
  );
}
