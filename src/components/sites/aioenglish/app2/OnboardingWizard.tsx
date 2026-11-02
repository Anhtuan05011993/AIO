"use client";

// /chao-mung — 5-step onboarding wizard (standalone full-screen flow, like /auth pages;
// no AppShell). Trình độ → Mục tiêu → Giọng tiếng Anh → Mỗi ngày → Sẵn sàng.
// "Bắt đầu" writes the demo user to localStorage and goes to /tong-quan.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import "@/styles/custom/pages2.css";
import BrandLockup from "@/components/sites/aioenglish/auth/BrandLockup";
import { setDemoUser } from "@/lib/store/auth";
import { speak } from "@/components/sites/aioenglish/lesson/speech";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBookOpen,
  IconCheck,
  IconClock,
  IconGraduationCap,
  IconKeyboard,
  IconSparkles,
  IconTarget,
  IconVolume,
} from "./Icons";

const STEP_NAMES = [
  "Trình độ",
  "Mục tiêu",
  "Giọng tiếng Anh",
  "Mỗi ngày",
  "Sẵn sàng",
] as const;

type Exam = "ielts" | "toeic" | "unsure";
type Accent = "uk" | "us";

/* Band labels verbatim from the source app's level data (Brabbkxn chunk). */
const TOEIC_BANDS = [
  "Mới bắt đầu (≤220)",
  "TOEIC 225–549",
  "TOEIC 550–784",
  "TOEIC 785–944",
  "TOEIC 945–990",
];
const IELTS_BANDS = [
  "Mới bắt đầu (≤2.5)",
  "IELTS 3.0–3.5",
  "IELTS 4.0–5.0",
  "IELTS 5.5–6.5",
  "IELTS 7.0–8.0",
  "IELTS 8.5–9.0",
];

const GOALS: Array<{ score: string; stage: string }> = [
  { score: "TOEIC 785", stage: "Hết chặng B1" },
  { score: "TOEIC 945", stage: "B2" },
  { score: "TOEIC 990", stage: "C1" },
];

const MINUTES: Array<{ value: number; label: string }> = [
  { value: 30, label: "30 phút" },
  { value: 45, label: "45 phút" },
  { value: 60, label: "1 giờ" },
  { value: 180, label: "3 giờ" },
];

function minutesLabel(v: number | null): string {
  return MINUTES.find((m) => m.value === v)?.label ?? "30 phút";
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [exam, setExam] = useState<Exam | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [accent, setAccent] = useState<Accent | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  const bands = exam === "ielts" ? IELTS_BANDS : TOEIC_BANDS;

  const stepDone = [
    exam !== null && (exam === "unsure" || band !== null),
    goal !== null,
    accent !== null,
    minutes !== null,
    true,
  ];
  const canContinue = stepDone[step];

  function pickExam(next: Exam) {
    setExam(next);
    setBand(null);
  }

  function goNext() {
    if (!canContinue) return;
    setStep((s) => Math.min(STEP_NAMES.length - 1, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function onStart() {
    setDemoUser({
      name: "Học viên demo",
      email: "demo@aioenglish.local",
      level: exam === "unsure" ? "A1" : (band ?? "Chưa rõ"),
      goal: goal ?? "TOEIC 785",
      accent: accent ?? "uk",
      minutesPerDay: minutes ?? 30,
      createdAt: Date.now(),
    });
    router.push("/tong-quan");
  }

  return (
    <div className="lp-wiz w-full bg-paper">
      <div className="lp-wiz-shell mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="lp-wiz-logo">
            <BrandLockup idSuffix="wiz-0" />
          </span>
          <span className="nbc-chip">
            Bước {step + 1}/{STEP_NAMES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 md:items-start">
          {/* Cột trái — giới thiệu + 3 phương pháp */}
          <aside className="nbc-hd lp-wiz-intro" data-nb-accent="vang">
            <div className="nbc-hd-tt">
              <span className="nbc-hd-ic nbx-f-home nbx-tile">
                <IconSparkles size={22} />
              </span>
              <h1 className="font-hero text-2xl font-extrabold tracking-tight text-fg">
                Chào mừng bạn đến với AIO&nbsp;English.
              </h1>
            </div>
            <p className="text-sm leading-6 text-fg-muted">
              Trả lời nhanh 5 câu hỏi để app dựng lộ trình vừa sức với bạn. Mọi
              thứ về tiếng Anh, trong một ứng dụng.
            </p>
            <ul className="flex flex-col gap-2.5">
              <li className="nbx-row">
                <span className="nbx-tile nbx-f-voc" aria-hidden="true">
                  <IconBookOpen size={18} />
                </span>
                <span className="min-w-0">
                  <b className="block">Học qua ngữ cảnh</b>
                  <span className="nbc-hint block">
                    Mỗi câu là một bài học thật — từ vựng sống trong câu.
                  </span>
                </span>
              </li>
              <li className="nbx-row">
                <span className="nbx-tile nbx-f-go" aria-hidden="true">
                  <IconKeyboard size={18} />
                </span>
                <span className="min-w-0">
                  <b className="block">Gõ lại từng câu</b>
                  <span className="nbc-hint block">
                    Sai đâu sửa đó, tạo phản xạ và trí nhớ cơ bắp.
                  </span>
                </span>
              </li>
              <li className="nbx-row">
                <span className="nbx-tile nbx-f-gram" aria-hidden="true">
                  <IconClock size={18} />
                </span>
                <span className="min-w-0">
                  <b className="block">Ôn giãn cách</b>
                  <span className="nbc-hint block">
                    Nhắc lại đúng lúc sắp quên — nhớ lâu mà không mất công.
                  </span>
                </span>
              </li>
            </ul>
            <p className="nbc-hint">
              Đã có hồ sơ?{" "}
              <Link
                href="/auth/login"
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                Đăng nhập
              </Link>
            </p>
          </aside>

          {/* Cột phải — steps */}
          <section
            className="card card-pad"
            aria-label="Phần giới thiệu 5 bước"
          >
            {/* Steps indicator 1-5 */}
            <div
              className="nbc-steps lp-wiz-steps"
              role="tablist"
              aria-label="Các bước"
            >
              {STEP_NAMES.map((name, i) => (
                <Fragment key={name}>
                  {i > 0 ? (
                    <i
                      className={i <= step ? "is-on" : undefined}
                      aria-hidden="true"
                    />
                  ) : null}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === step}
                    aria-label={`Bước ${i + 1}: ${name}`}
                    className={`nbc-stp${i === step ? " is-cur" : i < step ? " is-done" : ""}`}
                    disabled={i > step}
                    onClick={() => i < step && setStep(i)}
                  >
                    <b>{i < step ? <IconCheck size={13} /> : i + 1}</b>
                    <span className="hidden md:inline">{name}</span>
                  </button>
                </Fragment>
              ))}
            </div>

            <div className="lp-wiz-step-body">
              {step === 0 ? (
                <>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">
                    Bạn quan tâm đến chứng chỉ nào?
                  </h2>
                  <div
                    className="nbc-pills"
                    role="radiogroup"
                    aria-label="Chứng chỉ"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={exam === "toeic"}
                      className={`nbc-pill${exam === "toeic" ? " is-on" : ""}`}
                      onClick={() => pickExam("toeic")}
                    >
                      <IconGraduationCap size={15} /> TOEIC
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={exam === "ielts"}
                      className={`nbc-pill${exam === "ielts" ? " is-on" : ""}`}
                      onClick={() => pickExam("ielts")}
                    >
                      <IconGraduationCap size={15} /> IELTS
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={exam === "unsure"}
                      className={`nbc-pill${exam === "unsure" ? " is-on" : ""}`}
                      onClick={() => pickExam("unsure")}
                    >
                      Chưa rõ
                    </button>
                  </div>

                  {exam !== null && exam !== "unsure" ? (
                    <div className="lp-wiz-sub">
                      <b className="block">Trình độ hiện tại của bạn?</b>
                      <div
                        className="nbc-frows"
                        role="radiogroup"
                        aria-label="Trình độ hiện tại"
                      >
                        {bands.map((label) => (
                          <button
                            key={label}
                            type="button"
                            role="radio"
                            aria-checked={band === label}
                            className={`nbc-opt${band === label ? " is-on" : ""}`}
                            onClick={() => setBand(label)}
                          >
                            <span className="nbc-rd" aria-hidden="true" />
                            <b className="block">{label}</b>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : exam === "unsure" ? (
                    <p className="nbc-hint">
                      Không sao — app sẽ tự đo trình độ khi bạn học.
                    </p>
                  ) : (
                    <p className="nbc-hint">Chọn một chứng chỉ để tiếp tục.</p>
                  )}
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">
                    Bạn muốn đạt tới đâu?
                  </h2>
                  <div
                    className="nbc-frows"
                    role="radiogroup"
                    aria-label="Mục tiêu"
                  >
                    {GOALS.map((g) => (
                      <button
                        key={g.score}
                        type="button"
                        role="radio"
                        aria-checked={goal === g.score}
                        className={`nbc-opt${goal === g.score ? " is-on" : ""}`}
                        onClick={() => setGoal(g.score)}
                      >
                        <span className="nbc-rd" aria-hidden="true" />
                        <b className="block">{g.score}</b>
                        <span className="nbc-chip">{g.stage}</span>
                      </button>
                    ))}
                  </div>
                  <p className="nbc-hint">
                    Với {minutesLabel(minutes)} mỗi ngày: dự kiến khoảng 3 tháng
                    để đạt {goal ?? "TOEIC 785"}.
                  </p>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">
                    Giọng tiếng Anh?
                  </h2>
                  <div
                    className="nbc-frows"
                    role="radiogroup"
                    aria-label="Giọng tiếng Anh"
                  >
                    <div
                      className={`nbc-opt lp-opt${accent === "uk" ? " is-on" : ""}`}
                    >
                      <button
                        type="button"
                        className="lp-opt-hit"
                        aria-pressed={accent === "uk"}
                        aria-label="Chọn giọng Anh-Anh"
                        onClick={() => setAccent("uk")}
                      />
                      <span className="nbc-rd" aria-hidden="true" />
                      <span className="min-w-0">
                        <b className="block">Anh-Anh</b>
                        <span className="nbc-hint block">
                          Mặc định — tomato /təˈmɑːtəʊ/
                        </span>
                      </span>
                      <button
                        type="button"
                        className="nbc-hlink"
                        onClick={() => speak("tomato", "en-GB")}
                      >
                        <IconVolume size={15} /> Nghe
                      </button>
                    </div>
                    <div
                      className={`nbc-opt lp-opt${accent === "us" ? " is-on" : ""}`}
                    >
                      <button
                        type="button"
                        className="lp-opt-hit"
                        aria-pressed={accent === "us"}
                        aria-label="Chọn giọng Anh-Mỹ"
                        onClick={() => setAccent("us")}
                      />
                      <span className="nbc-rd" aria-hidden="true" />
                      <span className="min-w-0">
                        <b className="block">Anh-Mỹ</b>
                        <span className="nbc-hint block">
                          Giọng Mỹ — tomato /təˈmeɪtoʊ/
                        </span>
                      </span>
                      <button
                        type="button"
                        className="nbc-hlink"
                        onClick={() => speak("tomato", "en-US")}
                      >
                        <IconVolume size={15} /> Nghe
                      </button>
                    </div>
                  </div>
                  <p className="nbc-hint">
                    Bấm “Nghe” để nghe thử từ “tomato” theo từng giọng.
                  </p>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">
                    Mỗi ngày bạn học bao lâu?
                  </h2>
                  <div
                    className="nbc-pills"
                    role="radiogroup"
                    aria-label="Mỗi ngày"
                  >
                    {MINUTES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        role="radio"
                        aria-checked={minutes === m.value}
                        className={`nbc-pill${minutes === m.value ? " is-on" : ""}`}
                        onClick={() => setMinutes(m.value)}
                      >
                        <IconClock size={15} /> {m.label}
                      </button>
                    ))}
                  </div>
                  <p className="nbc-hint">
                    {minutes ?? 30} phút mỗi ngày là đủ để hoàn thành chặng đầu
                    tiên trong khoảng 3 tháng.
                  </p>
                </>
              ) : null}

              {step === 4 ? (
                <>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">
                    Sẵn sàng!
                  </h2>
                  <ul
                    className="nbc-frows nbc-f-go"
                    aria-label="Tóm tắt lựa chọn"
                  >
                    <li className="nbc-frow lp-frow-auto">
                      <span className="nbc-av is-k" aria-hidden="true">
                        <IconGraduationCap size={16} />
                      </span>
                      <b className="lp-frow-name">Trình độ</b>
                      <p>{exam === "unsure" ? "Chưa rõ" : (band ?? "—")}</p>
                    </li>
                    <li className="nbc-frow lp-frow-auto">
                      <span className="nbc-av is-k" aria-hidden="true">
                        <IconTarget size={16} />
                      </span>
                      <b className="lp-frow-name">Mục tiêu</b>
                      <p>{goal ?? "—"}</p>
                    </li>
                    <li className="nbc-frow lp-frow-auto">
                      <span className="nbc-av is-k" aria-hidden="true">
                        <IconVolume size={16} />
                      </span>
                      <b className="lp-frow-name">Giọng đọc</b>
                      <p>{accent === "us" ? "Anh-Mỹ" : "Anh-Anh"}</p>
                    </li>
                    <li className="nbc-frow lp-frow-auto">
                      <span className="nbc-av is-k" aria-hidden="true">
                        <IconClock size={16} />
                      </span>
                      <b className="lp-frow-name">Mỗi ngày</b>
                      <p>{minutesLabel(minutes)}</p>
                    </li>
                  </ul>
                  <p className="nbc-hint">
                    Có thể đổi lại mọi thứ trong Cài đặt bất cứ lúc nào.
                  </p>
                </>
              ) : null}
            </div>

            <div className="lp-wiz-acts">
              {step > 0 ? (
                <button type="button" className="nbc-back" onClick={goBack}>
                  <IconArrowLeft size={16} /> Quay lại {STEP_NAMES[step - 1]}
                </button>
              ) : (
                <span />
              )}
              {step < STEP_NAMES.length - 1 ? (
                <button
                  type="button"
                  className="nbc-btn is-ink"
                  disabled={!canContinue}
                  onClick={goNext}
                >
                  Tiếp tục <IconArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="nbc-btn is-ink"
                  onClick={onStart}
                >
                  Bắt đầu <IconArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
