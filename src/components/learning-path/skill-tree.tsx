import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PathNode = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  moduleCount: number;
  lessonCount: number;
};

type SkillTreeProps = {
  careerTitle: string;
  paths: PathNode[];
};

export function SkillTree({ careerTitle, paths }: SkillTreeProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-muted-foreground">
        <FolderTree className="size-4" />
        <span className="text-sm font-medium">{careerTitle}</span>
      </div>

      <div className="flex flex-col gap-3">
        {paths.map((path) => (
          <Link key={path.id} href={`/learn/${path.slug}`} className="block">
            <Card className="transition-colors hover:border-primary/50 hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{path.title}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardTitle>
                {path.description && (
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Badge variant="secondary">{path.moduleCount} modules</Badge>
                <Badge variant="outline">{path.lessonCount} lessons</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}