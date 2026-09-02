import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";
import { Terminal } from "lucide-react";

type ExampleSectionProps = {
  title: string;
  body: string;
  code?: string;
  onContinue: () => void;
};

export function ExampleSection({
  title,
  body,
  code,
  onContinue,
}: ExampleSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Terminal className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Example
            </span>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          </div>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <MarkdownText text={body} />
        </div>
        {code && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="overflow-hidden rounded-xl border border-border"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 bg-muted/80 px-4 py-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-amber-400/60" />
                <div className="size-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground ml-1">terminal</span>
            </div>
            <pre className="overflow-x-auto bg-muted/40 p-4 text-sm">
              <code className="font-mono leading-relaxed text-foreground">{code}</code>
            </pre>
          </motion.div>
        )}
      </motion.div>
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
          <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Button>
      </motion.div>
    </section>
  );
}
