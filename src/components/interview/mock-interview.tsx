"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Keyboard,
  Send,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { DuoButton } from "@/components/quiz/duo-button";
import { playTapPopSound, playCorrectSound, playVictoryFanfareSound } from "@/lib/sounds";
import { lessonCompleteConfetti } from "@/lib/confetti";

interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error: string;
}

interface BrowserSpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognitionInstance;

type TranscriptEntry = {
  role: "interviewer" | "user";
  text: string;
  score?: number;
  tips?: string | null;
  idealAnswer?: string | null;
  feedback?: string;
  roundNumber?: number;
};

type Summary = {
  overall: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

type Props = {
  career: { id: string; slug: string; title: string };
};

const SCENARIO_STARTERS = [
  { label: "🔍 Root Cause", text: "\n\n**1. Root Cause Triage:**\n" },
  { label: "⚡ Immediate Mitigation", text: "\n\n**2. Immediate Mitigation:**\n" },
  { label: "📊 Telemetry & Metrics", text: "\n\n**3. Monitoring & Telemetry:**\n" },
  { label: "🛡️ Hardening", text: "\n\n**4. Long-Term Hardening & Trade-offs:**\n" },
];

export function MockInterview({ career }: Props) {
  const [phase, setPhase] = useState<"intro" | "active" | "summary">("intro");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Audio and Speech State
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const [expandedModelAnswerIdx, setExpandedModelAnswerIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognitionInstance | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [transcript, busy, phase]);

  // Web Speech API: Text-to-Speech
  const speakText = useCallback(
    (text: string) => {
      if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        // Clean out markdown symbols for clean vocal speech
        const vocal = text
          .replace(/[*_#`~]/g, "")
          .replace(/\n+/g, ". ")
          .trim();

        const utterance = new SpeechSynthesisUtterance(vocal);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;

        // Pick a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("David")),
        ) ?? voices.find((v) => v.lang.startsWith("en"));
        if (englishVoice) utterance.voice = englishVoice;

        utterance.onstart = () => setIsSpeakingTTS(true);
        utterance.onend = () => setIsSpeakingTTS(false);
        utterance.onerror = () => setIsSpeakingTTS(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeakingTTS(false);
      }
    },
    [isMuted],
  );

  // Stop TTS on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API: Speech-to-Text Recognition
  const toggleRecording = () => {
    if (typeof window === "undefined") return;

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use text mode.");
      setIsVoiceMode(false);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
        playTapPopSound();
      };

      recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i]?.[0]?.transcript ?? "";
        }
        if (currentTranscript.trim()) {
          setAnswer((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${currentTranscript.trim()}` : currentTranscript.trim();
          });
        }
      };

      recognition.onerror = (e: BrowserSpeechRecognitionErrorEvent) => {
        console.warn("Speech recognition error:", e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition failed:", err);
      setIsRecording(false);
    }
  };

  const handleMuteToggle = () => {
    if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingTTS(false);
    }
    setIsMuted(!isMuted);
  };

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: career.id }),
      });
      let data: { sessionId?: string; question?: string; totalRounds?: number; error?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        // In case response is not JSON
      }
      if (!res.ok || !data) {
        throw new Error(data?.error ?? `Failed to start interview (${res.status})`);
      }
      if (!data.sessionId || !data.question) {
        throw new Error("Invalid session data received from server");
      }

      setSessionId(data.sessionId);
      setRound(1);
      setTotalRounds(data.totalRounds ?? 5);
      setTranscript([{ role: "interviewer", text: data.question, roundNumber: 1 }]);
      setPhase("active");
      speakText(data.question);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start interview");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!answer.trim() || !sessionId || busy) return;
    const userAnswer = answer.trim();
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setBusy(true);
    setError(null);
    setAnswer("");

    setTranscript((prev) => [...prev, { role: "user", text: userAnswer }]);

    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userAnswer }),
      });
      let data: {
        isComplete?: boolean;
        nextQuestion?: string;
        summary?: Summary | null;
        answered?: {
          score: number;
          feedback: string;
          tips?: string | null;
          idealAnswer?: string | null;
        };
        error?: string;
      } | null = null;
      try {
        data = await res.json();
      } catch {
        // In case response is not JSON
      }
      if (!res.ok || !data) {
        throw new Error(data?.error ?? `Failed to submit answer (${res.status})`);
      }
      if (!data.answered) {
        throw new Error("Invalid evaluation received from server");
      }

      const answered = data.answered;
      const isComplete = Boolean(data.isComplete);
      const nextQuestion = data.nextQuestion ?? "Please elaborate further on your technical considerations.";
      const summary = data.summary;

      playCorrectSound();

      // Feedback block with score and model answer
      const feedbackText = `Score: ${answered.score}/100\n${answered.feedback}${
        answered.tips ? `\n\n💡 Coaching Tip: ${answered.tips}` : ""
      }`;

      setTranscript((prev) => [
        ...prev,
        {
          role: "interviewer",
          text: feedbackText,
          score: answered.score,
          tips: answered.tips,
          idealAnswer: answered.idealAnswer,
          feedback: answered.feedback,
          roundNumber: round,
        },
      ]);

      speakText(`Evaluation complete. Score: ${answered.score} out of 100. ${answered.feedback}`);

      if (isComplete) {
        setSummary(summary ?? null);
        setTimeout(() => {
          setPhase("summary");
          playVictoryFanfareSound();
          lessonCompleteConfetti();
        }, 1200);
      } else {
        setRound((prev) => prev + 1);
        setTimeout(() => {
          setTranscript((prev) => [
            ...prev,
            { role: "interviewer", text: nextQuestion, roundNumber: round + 1 },
          ]);
          speakText(nextQuestion);
        }, 800);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to evaluate answer");
    } finally {
      setBusy(false);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 1. INTRO SCREEN: STARSHIP EVALUATION CHAMBER BRIEFING
  // ═══════════════════════════════════════════════════════════
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-8 py-8 px-4 select-none">
        {/* Holographic Chamber Card */}
        <div className="duo-card-3d relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 border-b-[8px] border-b-cyan-600/50 bg-[#0d1527] p-6 sm:p-10 shadow-2xl">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cyan-500/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-60 rounded-full bg-purple-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            {/* Dr. Orion Pedestal */}
            <div className="relative">
              <div className="size-28 sm:size-32 rounded-3xl border-2 border-b-[6px] border-cyan-400/50 bg-cyan-500/15 p-2 flex items-center justify-center shadow-xl shadow-cyan-500/10">
                <CosmicCharacter characterId="orion" mood="speaking" size="custom" className="size-24 sm:size-28" />
              </div>
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400 bg-cyan-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                Chief Evaluator
              </span>
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                AI Engineering Simulation
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {career.title} Technical Interview
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                Step into the virtual starship evaluation chamber. Dr. Orion will test your architecture, incident triage, and trade-off decisions with 5 live production scenarios.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg text-left">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="text-base mb-1">🎙️ / ⌨️</div>
                <div className="text-xs font-black text-white">Oral & Text</div>
                <div className="text-[10px] text-slate-400 font-medium">Speak or type your answer</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="text-base mb-1">🚨</div>
                <div className="text-xs font-black text-white">Scenarios</div>
                <div className="text-[10px] text-slate-400 font-medium">Real-world incidents & trade-offs</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 col-span-2 sm:col-span-1">
                <div className="text-base mb-1">👑</div>
                <div className="text-xs font-black text-white">Model Answers</div>
                <div className="text-[10px] text-slate-400 font-medium">Staff Engineer exemplar answers</div>
              </div>
            </div>

            {error && (
              <div className="w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-300 flex items-center justify-center gap-2">
                <AlertTriangle className="size-4" /> {error}
              </div>
            )}

            {/* Launch CTA */}
            <div className="w-full max-w-md mt-2">
              <DuoButton variant="secondary" size="lg" fullWidth disabled={busy} onClick={start}>
                {busy ? "Entering Orbit..." : "START MOCK INTERVIEW 🚀"}
              </DuoButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 2. SUMMARY SCREEN: OFFICER EVALUATION REPORT
  // ═══════════════════════════════════════════════════════════
  if (phase === "summary" && summary) {
    const scoreColor =
      summary.overall >= 85
        ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        : summary.overall >= 70
          ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
          : "text-amber-400 border-amber-500/40 bg-amber-500/10";

    const scoreTitle =
      summary.overall >= 85
        ? "Staff Engineer Caliber 👑"
        : summary.overall >= 70
          ? "Senior Ready 🚀"
          : "Solid Foundation ✨";

    return (
      <div className="mx-auto max-w-3xl space-y-8 py-6 px-4 select-none">
        {/* Celebration Banner */}
        <div className="duo-card-3d rounded-3xl border-2 border-cyan-500/30 border-b-[8px] border-b-cyan-600/40 bg-[#0d1527] p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="size-20 flex items-center justify-center rounded-3xl bg-cyan-500/20 border-2 border-b-4 border-cyan-500/40 mb-3 shadow-lg">
            <CosmicCharacter characterId="orion" mood="celebrating" size="custom" className="size-16" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
            Interview Debrief Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {career.title} Technical Evaluation
          </h2>

          {/* Big Circular Score Dial */}
          <div className="mt-6 flex flex-col items-center">
            <div
              className={cn(
                "size-32 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl",
                scoreColor,
              )}
            >
              <span className="text-4xl font-black tracking-tight">{summary.overall}</span>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-70">/ 100</span>
            </div>
            <span className="mt-3 text-sm font-black text-white uppercase tracking-wider">{scoreTitle}</span>
          </div>

          <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
            {summary.summary}
          </p>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Strengths */}
          <div className="duo-card-3d rounded-3xl border-2 border-emerald-500/30 border-b-[6px] border-b-emerald-600 bg-[#0d1527] p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                Key Strengths Demonstrated
              </h3>
            </div>
            <ul className="space-y-2.5">
              {summary.strengths.map((s, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs font-bold text-slate-200 leading-relaxed"
                >
                  ✓ {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="duo-card-3d rounded-3xl border-2 border-amber-500/30 border-b-[6px] border-b-amber-600 bg-[#0d1527] p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="size-5 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
                Tactical Growth Areas
              </h3>
            </div>
            <ul className="space-y-2.5">
              {summary.improvements.map((s, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs font-bold text-slate-200 leading-relaxed"
                >
                  ⚡ {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/interview-prep" className="w-full sm:w-auto">
            <DuoButton variant="neutral" size="lg" className="w-full">
              <RotateCcw className="size-4 mr-2" />
              Try Another Role
            </DuoButton>
          </Link>
          <Link href="/learn" className="w-full sm:w-auto">
            <DuoButton variant="primary" size="lg" className="w-full">
              Return to Learning Path
              <ArrowRight className="size-4 ml-2" />
            </DuoButton>
          </Link>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 3. ACTIVE SIMULATION ARENA: DUAL ORAL / TEXT CONSOLE
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-2 px-2 sm:px-4 select-none">
      {/* ── Top Fixed Evaluation HUD ── */}
      <div className="duo-card-3d flex items-center justify-between rounded-3xl border-2 border-white/10 border-b-[6px] bg-[#0d1527] px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Shield className="size-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-white">{career.title}</h2>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Round {round} / {totalRounds} Scenario Trial
            </span>
          </div>
        </div>

        {/* Round Progress Dots & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            {Array.from({ length: totalRounds }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i + 1 < round
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : i + 1 === round
                      ? "bg-cyan-400 scale-125 animate-pulse"
                      : "bg-white/15",
                )}
              />
            ))}
          </div>

          {/* Voice Mode Toggle Pill */}
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-wider transition-all",
              isVoiceMode
                ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-md shadow-purple-500/10"
                : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white",
            )}
            title="Toggle between Voice and Text mode"
          >
            {isVoiceMode ? <Mic className="size-3.5 text-purple-300" /> : <Keyboard className="size-3.5 text-slate-400" />}
            <span>{isVoiceMode ? "Voice Mode 🎙️" : "Text Mode ⌨️"}</span>
          </button>

          {/* TTS Speaker Toggle */}
          <button
            onClick={handleMuteToggle}
            className="size-8 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? "Unmute Dr. Orion voice" : "Mute Dr. Orion voice"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* ── Main Interview Stage: Dr. Orion Stage & Transcript ── */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 min-h-[380px] max-h-[550px] overflow-y-auto rounded-3xl border-2 border-white/10 bg-[#070b14]/90 p-4 sm:p-6 shadow-inner"
      >
        <AnimatePresence initial={false}>
          {transcript.map((entry, idx) => {
            const isInterviewer = entry.role === "interviewer";
            const isLatestQuestion = isInterviewer && !entry.score && idx === transcript.length - 1;

            if (isInterviewer) {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 sm:gap-4 w-full"
                >
                  {/* Dr. Orion Avatar Rig */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="size-12 sm:size-14 rounded-2xl bg-cyan-500/15 border-2 border-cyan-400/40 p-1 flex items-center justify-center shadow-md">
                      <CosmicCharacter
                        characterId="orion"
                        mood={isSpeakingTTS && isLatestQuestion ? "speaking" : entry.score ? (entry.score >= 80 ? "happy_jump" : "idle") : "speaking"}
                        size="custom"
                        className="size-full"
                      />
                    </div>
                    <span className="mt-1 text-[9px] font-black text-cyan-400 uppercase tracking-wider">
                      Dr. Orion
                    </span>
                  </div>

                  {/* Speech Card */}
                  <div className="flex-1 max-w-2xl">
                    <div
                      className={cn(
                        "duo-card-3d relative rounded-3xl p-5 sm:p-6 border-2 shadow-xl",
                        entry.score !== undefined
                          ? "border-emerald-500/40 border-b-[6px] border-b-emerald-600/40 bg-[#0c1829]"
                          : "border-cyan-500/30 border-b-[6px] border-b-cyan-600/40 bg-[#0d1527]",
                      )}
                    >
                      {/* Audio Waveform Indicator if Speaking */}
                      {isSpeakingTTS && isLatestQuestion && (
                        <div className="flex items-center gap-1 mb-2 text-cyan-400">
                          <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            Orion Speaking...
                          </span>
                          <div className="flex items-center gap-0.5 ml-2">
                            <span className="h-3 w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-4 w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-2 w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      )}

                      {/* Score Badge if Graded */}
                      {entry.score !== undefined && (
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">Evaluation Score</span>
                            <span
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-black border",
                                entry.score >= 85
                                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                                  : entry.score >= 70
                                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                                    : "border-amber-400 bg-amber-500/20 text-amber-300",
                              )}
                            >
                              {entry.score} / 100
                            </span>
                          </div>

                          <button
                            onClick={() => speakText(entry.feedback ?? entry.text)}
                            className="text-[11px] text-cyan-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="size-3.5" /> Read
                          </button>
                        </div>
                      )}

                      {/* Scenario / Feedback Text */}
                      <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                        {entry.text}
                      </p>

                      {/* Replay Question Button */}
                      {!entry.score && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                          <button
                            onClick={() => speakText(entry.text)}
                            className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Volume2 className="size-3.5" /> Replay Voice
                          </button>
                        </div>
                      )}

                      {/* Expandable Model Ideal Answer */}
                      {entry.idealAnswer && (
                        <div className="mt-4 pt-3 border-t border-emerald-500/30">
                          <button
                            onClick={() =>
                              setExpandedModelAnswerIdx(
                                expandedModelAnswerIdx === idx ? null : idx,
                              )
                            }
                            className="flex items-center justify-between w-full py-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider hover:text-emerald-300"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="size-3.5" /> Real-Interview Staff Model Answer
                            </span>
                            {expandedModelAnswerIdx === idx ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </button>

                          {expandedModelAnswerIdx === idx && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2.5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-medium text-emerald-100 leading-relaxed whitespace-pre-line"
                            >
                              <div className="font-bold text-[10px] uppercase text-emerald-400 mb-1">
                                Exemplar Staff-Level Response:
                              </div>
                              {entry.idealAnswer}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }

            // User Candidate Response Bubble
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-end gap-3 w-full"
              >
                <div className="max-w-xl">
                  <div className="duo-card-3d rounded-3xl rounded-tr-sm border-2 border-purple-500/40 border-b-[6px] border-b-purple-600/50 bg-[#16122c] p-4 sm:p-5 shadow-xl text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block mb-1">
                      Your Answer
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-white leading-relaxed text-left whitespace-pre-line">
                      {entry.text}
                    </p>
                  </div>
                </div>
                <div className="size-10 rounded-2xl bg-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center font-black text-xs text-purple-300 shrink-0 mt-1">
                  YOU
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {busy && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md">
            <div className="size-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span className="text-xs font-bold text-cyan-300 animate-pulse">
              Dr. Orion is evaluating your architectural reasoning...
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom Candidate Response Console ── */}
      <div className="duo-card-3d rounded-3xl border-2 border-white/10 border-b-[6px] bg-[#0d1527] p-4 sm:p-5 shadow-2xl flex flex-col gap-3">
        {/* Scenario Helper Starter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Format:
          </span>
          {SCENARIO_STARTERS.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setAnswer((prev) => `${prev}${s.text}`);
                playTapPopSound();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:border-cyan-400 hover:text-white transition-all active:scale-95"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Area: Voice vs Text */}
        {isVoiceMode ? (
          /* Oral Mode Interface */
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-950/20">
            {/* Glowing Big Mic Button */}
            <div className="relative shrink-0">
              {isRecording && (
                <div className="absolute -inset-2.5 rounded-full bg-purple-500/30 animate-ping pointer-events-none" />
              )}
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "size-16 sm:size-18 rounded-full flex flex-col items-center justify-center border-2 border-b-4 transition-all shadow-xl",
                  isRecording
                    ? "border-rose-400 bg-rose-500 text-white animate-pulse"
                    : "border-purple-400 bg-purple-600 hover:bg-purple-500 text-white",
                )}
              >
                {isRecording ? <MicOff className="size-6" /> : <Mic className="size-6" />}
                <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">
                  {isRecording ? "Stop" : "Speak"}
                </span>
              </button>
            </div>

            {/* Live Transcription Box */}
            <div className="flex-1 w-full">
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1 flex items-center justify-between">
                <span>{isRecording ? "🔴 Listening to voice..." : "Voice Answer Transcript"}</span>
                {isRecording && <span className="animate-pulse">Tap &apos;Stop&apos; when done</span>}
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Click the microphone to speak, or edit your voice response here..."
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        ) : (
          /* Text Terminal Mode Interface */
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={`Type your engineering response for ${career.title} role... (Ctrl + Enter to submit)`}
              rows={4}
              className="w-full rounded-2xl border-2 border-white/10 bg-black/40 p-4 text-xs sm:text-sm font-sans text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none transition-colors"
            />
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/40">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        )}

        {/* Submit & Switcher Bar */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className="text-xs font-bold text-slate-400 hover:text-white underline transition-colors"
            >
              {isVoiceMode ? "Switch to Text Mode ⌨️" : "Switch to Voice Mode 🎙️"}
            </button>
          </div>

          <DuoButton
            variant="primary"
            size="md"
            disabled={!answer.trim() || busy}
            onClick={submit}
            className="min-w-[170px]"
          >
            {busy ? "Evaluating..." : "Submit Response"}
            <Send className="size-4 ml-1.5" />
          </DuoButton>
        </div>
      </div>
    </div>
  );
}