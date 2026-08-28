import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";

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
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <MarkdownText text={body} />
        {code && (
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm">
            <code className="font-mono leading-relaxed">{code}</code>
          </pre>
        )}
      </div>
      <Button onClick={onContinue} className="self-end">
        Continue
      </Button>
    </section>
  );
}