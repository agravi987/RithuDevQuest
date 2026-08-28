import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="size-20 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
        <Compass className="size-10 text-primary" />
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <span className="text-xs font-black uppercase tracking-widest text-primary">
          404 · Quest Not Found
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          You wandered off the map!
        </h1>
        <p className="text-sm text-muted-foreground">
          The skill node or page you are looking for does not exist or has moved.
        </p>
      </div>

      <Button asChild size="lg" className="rounded-2xl font-bold gap-2">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
