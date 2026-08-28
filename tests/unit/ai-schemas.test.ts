import { describe, expect, it } from "vitest";
import {
  generatedQuestionSchema,
  generatedQuestionsBatchSchema,
} from "@/lib/ai/schemas/question";
import {
  explanationRequestSchema,
  explanationResponseSchema,
} from "@/lib/ai/schemas/explanation";
import { hintRequestSchema, hintResponseSchema } from "@/lib/ai/schemas/hint";
import {
  mentorContextSchema,
  mentorResponseSchema,
} from "@/lib/ai/schemas/mentor";

describe("AI Zod Schemas", () => {
  describe("generatedQuestionSchema", () => {
    it("accepts a valid MCQ question", () => {
      const validMcq = {
        type: "mcq",
        difficulty: "beginner",
        question: "What command lists directory contents?",
        options: ["ls", "cd", "pwd", "rm"],
        correctAnswer: "ls",
        explanation: "The ls command lists directory contents in Linux.",
        hint: "Short for list",
      };

      const result = generatedQuestionSchema.safeParse(validMcq);
      expect(result.success).toBe(true);
    });

    it("rejects MCQ when correctAnswer is not in options", () => {
      const invalidMcq = {
        type: "mcq",
        difficulty: "beginner",
        question: "What command lists directory contents?",
        options: ["cd", "pwd", "rm"],
        correctAnswer: "ls",
        explanation: "The ls command lists directory contents.",
      };

      const result = generatedQuestionSchema.safeParse(invalidMcq);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          "must be one of the provided options",
        );
      }
    });

    it("accepts a valid True/False question", () => {
      const validTf = {
        type: "true_false",
        difficulty: "beginner",
        question: "Docker containers share the host OS kernel.",
        correctAnswer: "true",
        explanation:
          "Containers isolate user space but share the host Linux kernel.",
      };

      const result = generatedQuestionSchema.safeParse(validTf);
      expect(result.success).toBe(true);
    });

    it("rejects True/False with invalid correctAnswer", () => {
      const invalidTf = {
        type: "true_false",
        difficulty: "beginner",
        question: "Docker containers share the host kernel.",
        correctAnswer: "yes",
        explanation: "Explanation here...",
      };

      const result = generatedQuestionSchema.safeParse(invalidTf);
      expect(result.success).toBe(false);
    });

    it("accepts a valid Command question", () => {
      const validCmd = {
        type: "command",
        difficulty: "intermediate",
        question: "Build a docker image tagged myapp:1.0 from current directory.",
        correctAnswer: "docker build -t myapp:1.0 .",
        explanation:
          "docker build with -t tags the image and . specifies context.",
      };

      const result = generatedQuestionSchema.safeParse(validCmd);
      expect(result.success).toBe(true);
    });

    it("accepts a valid Scenario question with 2+ parts", () => {
      const validScenario = {
        type: "scenario",
        difficulty: "advanced",
        question: "Debug a crashing Kubernetes Pod.",
        parts: [
          {
            prompt: "Check the pod status in namespace prod.",
            correctAnswer: "kubectl get pods -n prod",
          },
          {
            prompt: "View logs of crashing pod pod-1.",
            correctAnswer: "kubectl logs pod-1 -n prod",
          },
        ],
        correctAnswer: "kubectl debug",
        explanation: "Step 1 inspects pod state, step 2 reads crash logs.",
      };

      const result = generatedQuestionSchema.safeParse(validScenario);
      expect(result.success).toBe(true);
    });

    it("rejects Scenario question with fewer than 2 parts", () => {
      const invalidScenario = {
        type: "scenario",
        difficulty: "advanced",
        question: "Debug a crashing pod.",
        parts: [
          {
            prompt: "Check status",
            correctAnswer: "kubectl get pods",
          },
        ],
        correctAnswer: "kubectl get pods",
        explanation: "Needs at least 2 parts",
      };

      const result = generatedQuestionSchema.safeParse(invalidScenario);
      expect(result.success).toBe(false);
    });

    it("validates a batch of generated questions", () => {
      const batch = {
        questions: [
          {
            type: "mcq",
            difficulty: "beginner",
            question: "Which port is standard for HTTPS?",
            options: ["80", "443", "8080", "22"],
            correctAnswer: "443",
            explanation: "Port 443 is standard for TLS/HTTPS.",
          },
          {
            type: "command",
            difficulty: "beginner",
            question: "Display active network connections.",
            correctAnswer: "netstat -tuln|ss -tuln",
            explanation: "ss or netstat inspects socket listeners.",
          },
        ],
      };

      const result = generatedQuestionsBatchSchema.safeParse(batch);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.questions.length).toBe(2);
      }
    });
  });

  describe("explanation schemas", () => {
    it("validates valid explanation request and response", () => {
      const req = {
        topic: "Git Branching",
        question: "How do you switch branches in git?",
        userAnswer: "git change main",
        correctAnswer: "git switch main",
      };
      expect(explanationRequestSchema.safeParse(req).success).toBe(true);

      const res = {
        concept: "Git Branch Navigation",
        summary: "Git uses git switch or git checkout to change HEAD.",
        whyIncorrect: "git change is not a valid git subcommand.",
        whyCorrect: "git switch is the modern command to switch branches.",
        commonMistakes: ["Using git change", "Confusing branch creation with checkout"],
        keyTakeaway: "Use git switch <branch> to move HEAD to another branch.",
      };
      expect(explanationResponseSchema.safeParse(res).success).toBe(true);
    });
  });

  describe("hint and mentor schemas", () => {
    it("validates hint request and response", () => {
      const req = {
        topic: "Linux Permissions",
        question: "Make script executable.",
        attemptNumber: 1,
      };
      expect(hintRequestSchema.safeParse(req).success).toBe(true);

      const res = {
        hint: "Think about the chmod command and execute bit +x.",
        subtleClue: "chmod +x",
      };
      expect(hintResponseSchema.safeParse(res).success).toBe(true);
    });

    it("validates mentor context and response", () => {
      const ctx = {
        situation: "greeting",
        userName: "Alex",
        currentStreak: 3,
        userXp: 120,
        level: 2,
      };
      expect(mentorContextSchema.safeParse(ctx).success).toBe(true);

      const res = {
        greeting: "Welcome back, Alex!",
        message: "You have a 3-day streak going! Let's conquer Docker volumes today.",
        tone: "encouraging",
        actionableTip: "Volumes persist data even when containers terminate.",
        suggestedAction: {
          label: "Continue Docker Module",
          href: "/learn/docker/volumes",
        },
      };
      expect(mentorResponseSchema.safeParse(res).success).toBe(true);
    });
  });
});
