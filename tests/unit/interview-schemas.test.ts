import { describe, expect, it } from "vitest";
import {
  interviewQuestionSchema,
  interviewGradeSchema,
  interviewSummarySchema,
} from "@/lib/ai/schemas/interview";

describe("Interview AI Zod Schemas", () => {
  describe("interviewQuestionSchema", () => {
    it("accepts a valid interview question", () => {
      const res = interviewQuestionSchema.safeParse({
        question: "Explain how you would scale a PostgreSQL database for read-heavy traffic.",
      });
      expect(res.success).toBe(true);
    });

    it("rejects an empty or too-short question", () => {
      const res = interviewQuestionSchema.safeParse({ question: "Hi?" });
      expect(res.success).toBe(false);
    });
  });

  describe("interviewGradeSchema", () => {
    it("accepts a valid grade with follow-up", () => {
      const res = interviewGradeSchema.safeParse({
        score: 65,
        feedback: "You covered the basics but missed replication strategies.",
        tips: "Mention read replicas and connection pooling.",
        followUpQuestion: "How would read replicas affect consistency?",
      });
      expect(res.success).toBe(true);
    });

    it("accepts a grade with null follow-up and tips", () => {
      const res = interviewGradeSchema.safeParse({
        score: 95,
        feedback: "Excellent, thorough and accurate answer.",
        tips: null,
        followUpQuestion: null,
      });
      expect(res.success).toBe(true);
    });

    it("rejects a score outside the 0–100 range", () => {
      const res = interviewGradeSchema.safeParse({
        score: 140,
        feedback: "Way too high.",
        tips: null,
        followUpQuestion: null,
      });
      expect(res.success).toBe(false);
    });

    it("rejects a missing feedback field", () => {
      const res = interviewGradeSchema.safeParse({
        score: 50,
        tips: "Nice",
        followUpQuestion: null,
      });
      expect(res.success).toBe(false);
    });
  });

  describe("interviewSummarySchema", () => {
    it("accepts a valid session summary", () => {
      const res = interviewSummarySchema.safeParse({
        overall: 78,
        summary: "The candidate showed strong fundamentals with a few gaps in advanced concurrency.",
        strengths: ["Clear explanations", "Good command of SQL"],
        improvements: ["Deeper system-design thinking", "More precise trade-off analysis"],
      });
      expect(res.success).toBe(true);
    });

    it("rejects an overall score over 100", () => {
      const res = interviewSummarySchema.safeParse({
        overall: 120,
        summary: "Too high a score to be valid.",
        strengths: ["Strong"],
        improvements: ["None"],
      });
      expect(res.success).toBe(false);
    });
  });
});
