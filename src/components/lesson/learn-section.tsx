import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";

type LearnSectionProps = {
  title: string;
  body: string;
  onContinue: () => void;
};

export function LearnSection({ title, body, onContinue }: LearnSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <MarkdownText text={body} />
      </div>
      <Button onClick={onContinue} className="self-end">
        Continue
      </Button>
    </section>
  );
}