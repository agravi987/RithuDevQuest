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
          <Terminal className="size-4 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <MarkdownText text={body} />
        </div>
        {code && (
          <motion.pre
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="overflow-x-auto rounded-xl border-2 bg-muted/40 p-4 text-sm code-block-glow transition-all duration-300"
          >
            <code className="font-mono leading-relaxed text-foreground">{code}</code>
          </motion.pre>
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
