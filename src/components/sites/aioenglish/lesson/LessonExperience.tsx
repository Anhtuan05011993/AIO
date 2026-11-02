"use client";

// Lesson player orchestrator: setup → playing → done.
// Rebuilt from the source app's lesson flow ("Chọn cách học" → typing session → summary)
// using the site's own design tokens and real course data.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Course, LearningUnit, Statement } from "@/lib/demo-data/go-cau";
import { addLessonRecord } from "@/lib/store/progress";
import LessonSetup from "./LessonSetup";
import PlayerHud from "./PlayerHud";
import TypingStage from "./TypingStage";
import TocDrawer from "./TocDrawer";
import LessonDone from "./LessonDone";
import { stopSpeaking } from "./speech";

export type LessonMode = "default" | "listening" | "listening-speaking" | "grammar";
export type LessonDifficulty = "basic" | "intermediate" | "advanced";

export type Step = {
  statementIndex: number;
  unit: LearningUnit | null; // null = the full-sentence step
  kind: "word" | "phrase" | "sentence";
  target: string; // EN answer
  hintVi: string; // VN hint shown (mode: default)
  ipa: string; // per-step IPA
  accepted: string[];
};

function wordIpaOf(statement: Statement, unitText: string): string {
  // pronunciationGuide looks like "/aɪ/ /hæv/ /lɪvd/ ..."
  const parts = (statement.pronunciationGuide || statement.ipa || "").match(/\/[^/]+\//g) ?? [];
  const words = statement.text.split(/\s+/);
  const idx = words.findIndex((w) => w.toLowerCase().replace(/[^a-z']/g, "") === unitText.toLowerCase().replace(/[^a-z']/g, ""));
  if (idx >= 0 && parts[idx]) return parts[idx];
  return "";
}

export function buildSteps(statement: Statement, difficulty: LessonDifficulty): Step[] {
  const steps: Step[] = [];
  const units = statement.learningUnits ?? [];
  const sentence: Step = {
    statementIndex: -1,
    unit: null,
    kind: "sentence",
    target: statement.displayText || statement.text,
    hintVi: statement.translation,
    ipa: statement.pronunciationGuide || statement.ipa || "",
    accepted: statement.acceptedAnswers?.length ? statement.acceptedAnswers : [statement.text],
  };
  if (difficulty === "advanced") return [sentence];
  for (const u of units) {
    if (u.unitType === "word") {
      steps.push({
        statementIndex: -1,
        unit: u,
        kind: "word",
        target: u.unitText,
        hintVi: u.explanationVi || "",
        ipa: wordIpaOf(statement, u.unitText),
        accepted: [u.unitText],
      });
    }
  }
  if (difficulty === "basic") {
    for (const u of units) {
      if (u.unitType === "phrase") {
        steps.push({
          statementIndex: -1,
          unit: u,
          kind: "phrase",
          target: u.unitText,
          hintVi: u.explanationVi || "",
          ipa: "",
          accepted: [u.unitText],
        });
      }
    }
  }
  steps.push(sentence);
  return steps;
}

export default function LessonExperience({
  course,
  backHref,
  breadcrumb,
}: {
  course: Course;
  backHref: string;
  breadcrumb: string[];
}) {
  const [phase, setPhase] = useState<"setup" | "playing" | "done">("setup");
  const [mode, setMode] = useState<LessonMode>("default");
  const [difficulty, setDifficulty] = useState<LessonDifficulty>("basic");
  const [statementIdx, setStatementIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [tocOpen, setTocOpen] = useState(false);
  const [jumpTo, setJumpTo] = useState(0);
  const startedAt = useRef<number>(0);

  const statement: Statement | undefined = course.statements[statementIdx];
  const steps = useMemo(
    () => (statement ? buildSteps(statement, difficulty) : []),
    [statement, difficulty],
  );

  const totalSentences = course.statements.length;

  // session tally for the demo progress store
  const tallyRef = useRef({ tries: 0, right: 0 });
  const onAttempt = useCallback((ok: boolean) => {
    tallyRef.current.tries += 1;
    if (ok) tallyRef.current.right += 1;
  }, []);

  const finishStatement = useCallback(
    (idx: number) => {
      setDoneIds((prev) => new Set(prev).add(course.statements[idx].id));
      if (idx + 1 < course.statements.length) {
        setStatementIdx(idx + 1);
      } else {
        const seconds = elapsed || Math.round((Date.now() - startedAt.current) / 1000);
        const { tries, right } = tallyRef.current;
        const accuracy = tries === 0 ? 100 : Math.round((right / tries) * 100);
        const xp = Math.max(10, Math.round(course.statements.length * 1.6 + seconds / 6));
        addLessonRecord({ courseId: course.course.id, mode, difficulty, seconds, accuracy, xp });
        setPhase("done");
      }
    },
    [course.statements, elapsed, mode, difficulty],
  );

  // jump from TOC
  useEffect(() => {
    if (phase === "playing") setStatementIdx(jumpTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpTo]);

  // session timer
  useEffect(() => {
    if (phase !== "playing") return;
    startedAt.current = Date.now() - elapsed * 1000;
    const t = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => stopSpeaking(), []);

  if (phase === "setup") {
    return (
      <LessonSetup
        course={course}
        backHref={backHref}
        breadcrumb={breadcrumb}
        mode={mode}
        difficulty={difficulty}
        onMode={setMode}
        onDifficulty={setDifficulty}
        onStart={() => setPhase("playing")}
      />
    );
  }

  if (phase === "done") {
    return (
      <LessonDone
        course={course}
        elapsed={elapsed}
        mode={mode}
        difficulty={difficulty}
        accuracy={tallyRef.current.tries === 0 ? 100 : Math.round((tallyRef.current.right / tallyRef.current.tries) * 100)}
        xp={Math.max(10, Math.round(course.statements.length * 1.6 + elapsed / 6))}
        backHref={backHref}
        onRestart={() => {
          setDoneIds(new Set());
          setStatementIdx(0);
          setElapsed(0);
          setPhase("playing");
        }}
        onSetup={() => {
          setDoneIds(new Set());
          setStatementIdx(0);
          setElapsed(0);
          setPhase("setup");
        }}
      />
    );
  }

  return (
    <div data-lesson-player className="lp-root nb-lesson relative isolate flex h-dscreen flex-col" data-feature="go-cau">
      <PlayerHud
        course={course}
        statementIdx={statementIdx}
        totalSentences={totalSentences}
        elapsed={elapsed}
        backHref={backHref}
        onToc={() => setTocOpen(true)}
        onQuit={() => setPhase("setup")}
      />
      <main id="main-content" className="lp-main relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        {statement ? (
          <TypingStage
            key={statement.id}
            statement={statement}
            steps={steps}
            mode={mode}
            statementNumber={statementIdx + 1}
            totalSentences={totalSentences}
            onStatementDone={() => finishStatement(statementIdx)}
            onJumpRequest={(i) => setJumpTo(i)}
            onAttempt={onAttempt}
          />
        ) : null}
      </main>
      <TocDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        course={course}
        difficulty={difficulty}
        current={statementIdx}
        doneIds={doneIds}
        onJump={(i) => {
          setJumpTo(i);
          setTocOpen(false);
        }}
      />
    </div>
  );
}
