import { describe, it, expect } from "vitest";
import {
  createQuizQueue,
  calculateQuestionXp,
  calculateComboBonus,
  processQueueAnswer,
  calculateSessionAccuracy,
} from "@/lib/quiz/queue";
import type { DuolingoQuestion } from "@/components/quiz/types";

const mockQuestions: DuolingoQuestion[] = [
  {
    id: "q-1",
    type: "mcq",
    prompt: "What is Docker?",
    payload: {
      options: [{ id: "opt-1", text: "Container runtime" }],
      correctOptionId: "opt-1",
      explanation: "Docker is a container runtime platform.",
    },
    difficulty: "beginner",
  },
  {
    id: "q-2",
    type: "true_false",
    prompt: "Kubernetes is an orchestration system.",
    payload: {
      statement: "Kubernetes orchestrates containers.",
      correctAnswer: true,
      explanation: "Kubernetes is a container orchestrator.",
    },
    difficulty: "beginner",
  },
  {
    id: "q-3",
    type: "word_bank",
    prompt: "Assemble command",
    payload: {
      targetSentence: "docker ps -a",
      tokens: [
        { id: "t1", text: "docker" },
        { id: "t2", text: "ps" },
        { id: "t3", text: "-a" },
      ],
      explanation: "Lists all containers.",
    },
    difficulty: "intermediate",
  },
];

describe("Duolingo Quiz Queue Engine", () => {
  it("initializes queue with correct items and initial attempt count of 0", () => {
    const queue = createQuizQueue(mockQuestions);
    expect(queue).toHaveLength(3);
    expect(queue[0]?.question.id).toBe("q-1");
    expect(queue[0]?.attemptCount).toBe(0);
    expect(queue[0]?.firstTryCorrect).toBeNull();
  });

  it("calculates XP accurately based on attempt numbers", () => {
    expect(calculateQuestionXp(1)).toBe(10); // 100%
    expect(calculateQuestionXp(2)).toBe(5);  // 50%
    expect(calculateQuestionXp(3)).toBe(3);  // 25%
    expect(calculateQuestionXp(5)).toBe(3);  // 25%
  });

  it("calculates streak combo bonus (+2 XP for streaks >= 3)", () => {
    expect(calculateComboBonus(0)).toBe(0);
    expect(calculateComboBonus(1)).toBe(0);
    expect(calculateComboBonus(2)).toBe(0);
    expect(calculateComboBonus(3)).toBe(2);
    expect(calculateComboBonus(5)).toBe(2);
  });

  it("removes correctly answered question from the queue and awards 10 XP on 1st try", () => {
    const queue = createQuizQueue(mockQuestions);
    const result = processQueueAnswer(queue, true, "opt-1");

    expect(result.nextQueue).toHaveLength(2);
    expect(result.nextQueue[0]?.question.id).toBe("q-2");
    expect(result.evaluatedItem.attemptCount).toBe(1);
    expect(result.evaluatedItem.firstTryCorrect).toBe(true);
    expect(result.xpEarned).toBe(10);
    expect(result.isSessionComplete).toBe(false);
  });

  it("re-queues missed questions at the end of the queue (Duolingo mistake recycling)", () => {
    const queue = createQuizQueue(mockQuestions);
    // Answer q-1 wrong
    const result = processQueueAnswer(queue, false, "wrong-opt");

    expect(result.nextQueue).toHaveLength(3);
    // Head is now q-2
    expect(result.nextQueue[0]?.question.id).toBe("q-2");
    // End of queue is now q-1 recycled!
    expect(result.nextQueue[2]?.question.id).toBe("q-1");
    expect(result.nextQueue[2]?.attemptCount).toBe(1);
    expect(result.nextQueue[2]?.firstTryCorrect).toBe(false);
    expect(result.xpEarned).toBe(0);
    expect(result.isSessionComplete).toBe(false);
  });

  it("awards 5 XP when a recycled question is answered correctly on 2nd attempt", () => {
    const queue = createQuizQueue([mockQuestions[0]!]);
    // 1st attempt: wrong
    const attempt1 = processQueueAnswer(queue, false, "wrong");
    expect(attempt1.nextQueue).toHaveLength(1);
    expect(attempt1.xpEarned).toBe(0);

    // 2nd attempt: correct
    const attempt2 = processQueueAnswer(attempt1.nextQueue, true, "opt-1");
    expect(attempt2.nextQueue).toHaveLength(0);
    expect(attempt2.xpEarned).toBe(5);
    expect(attempt2.isSessionComplete).toBe(true);
  });

  it("calculates session accuracy based on first-try correctness", () => {
    const history = [
      { firstTryCorrect: true },
      { firstTryCorrect: false },
      { firstTryCorrect: true },
      { firstTryCorrect: true },
    ];
    // 3 out of 4 = 75%
    expect(calculateSessionAccuracy(history)).toBe(75);
  });
});
