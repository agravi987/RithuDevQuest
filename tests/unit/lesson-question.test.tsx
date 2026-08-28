import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { QuestionSection } from "@/components/lesson/question-section";
import { FeedbackSection } from "@/components/lesson/feedback-section";
import type {
  LessonQuestionData,
  SubmitAnswerResult,
} from "@/lib/lesson/types";

function mcqQuestion(): LessonQuestionData {
  return {
    id: "q1",
    type: "mcq",
    difficulty: "beginner",
    question: "Which program interprets commands?",
    options: ["Shell", "Terminal", "Kernel"],
    parts: null,
    hint: null,
  };
}

function commandQuestion(): LessonQuestionData {
  return {
    id: "q2",
    type: "command",
    difficulty: "beginner",
    question: "Run a command that prints `hello`.",
    options: null,
    parts: null,
    hint: "Try the echo command.",
  };
}

function scenarioQuestion(): LessonQuestionData {
  return {
    id: "q3",
    type: "scenario",
    difficulty: "intermediate",
    question: "You just opened a new server terminal.",
    options: null,
    parts: [
      { prompt: "Find your current user." },
      { prompt: "Find your current directory." },
      { prompt: "Switch to the /var/log directory." },
    ],
    hint: null,
  };
}

describe("QuestionSection", () => {
  it("renders MCQ options as selectable buttons and reports selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <QuestionSection
        question={mcqQuestion()}
        value={null}
        onValueChange={onValueChange}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={null}
      />,
    );
    expect(screen.getByRole("button", { name: "Shell" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Terminal" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kernel" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Shell" }));
    expect(onValueChange).toHaveBeenCalledWith("Shell");
  });

  it("disables the check button until an answer is selected", () => {
    render(
      <QuestionSection
        question={mcqQuestion()}
        value={null}
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={null}
      />,
    );
    expect(screen.getByRole("button", { name: "Check answer" })).toBeDisabled();
  });

  it("enables the check button once an answer is selected", () => {
    render(
      <QuestionSection
        question={mcqQuestion()}
        value="Shell"
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={null}
      />,
    );
    expect(screen.getByRole("button", { name: "Check answer" })).toBeEnabled();
  });

  it("submits the selected answer", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <QuestionSection
        question={mcqQuestion()}
        value="Shell"
        onValueChange={vi.fn()}
        onSubmit={onSubmit}
        submitting={false}
        partIndex={null}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders true and false options for a true_false question", () => {
    render(
      <QuestionSection
        question={{ ...mcqQuestion(), type: "true_false", options: null }}
        value={null}
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={null}
      />,
    );
    expect(screen.getByRole("button", { name: "True" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "False" })).toBeInTheDocument();
  });

  it("collects raw input for a command question", async () => {
    const user = userEvent.setup();
    let typed = "";
    function Harness() {
      const [value, setValue] = useState("");
      return (
        <QuestionSection
          question={commandQuestion()}
          value={value}
          onValueChange={(next) => {
            typed = next;
            setValue(next);
          }}
          onSubmit={vi.fn()}
          submitting={false}
          partIndex={null}
        />
      );
    }
    render(<Harness />);
    const input = screen.getByRole("textbox", {
      name: "Command answer",
    });
    await user.type(input, "echo hello");
    expect(typed).toBe("echo hello");
  });

  it("shows the part prompt for scenario questions", () => {
    render(
      <QuestionSection
        question={scenarioQuestion()}
        value={null}
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={1}
      />,
    );
    expect(screen.getByText("Part 2 of 3")).toBeInTheDocument();
    expect(
      screen.getByText("Find your current directory."),
    ).toBeInTheDocument();
  });

  it("reveals a hint when requested", async () => {
    const user = userEvent.setup();
    render(
      <QuestionSection
        question={commandQuestion()}
        value=""
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
        partIndex={null}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Show hint" }));
    expect(screen.getByText(/Hint: Try the echo command./)).toBeInTheDocument();
  });
});

describe("FeedbackSection", () => {
  function feedback(overrides: Partial<SubmitAnswerResult> = {}):
    SubmitAnswerResult {
    return {
      questionId: "q1",
      lessonId: "l1",
      isCorrect: true,
      attemptNumber: 1,
      xpEarned: 10,
      correctAnswer: "Shell",
      explanation: "The shell interprets your commands.",
      hint: null,
      partIndex: null,
      totalParts: null,
      scenarioComplete: false,
      ...overrides,
    };
  }

  it("shows positive feedback and a continue action for correct answers", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <FeedbackSection
        feedback={feedback()}
        onContinue={onContinue}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("shows the explanation and a retry action for incorrect answers", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <FeedbackSection
        feedback={feedback({
          isCorrect: false,
          attemptNumber: 1,
          xpEarned: 0,
        })}
        onContinue={vi.fn()}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("Not quite")).toBeInTheDocument();
    expect(
      screen.getByText("The shell interprets your commands."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Correct answer: Shell/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("labels a correct scenario part but holds back the full explanation", () => {
    render(
      <FeedbackSection
        feedback={feedback({
          partIndex: 0,
          totalParts: 3,
          scenarioComplete: false,
        })}
        onContinue={vi.fn()}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText("Part 1 correct")).toBeInTheDocument();
    expect(
      screen.queryByText("The shell interprets your commands."),
    ).not.toBeInTheDocument();
  });

  it("celebrates a fully solved scenario with the explanation", () => {
    render(
      <FeedbackSection
        feedback={feedback({
          partIndex: 2,
          totalParts: 3,
          scenarioComplete: true,
        })}
        onContinue={vi.fn()}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText("Scenario complete!")).toBeInTheDocument();
    expect(
      screen.getByText("The shell interprets your commands."),
    ).toBeInTheDocument();
  });
});