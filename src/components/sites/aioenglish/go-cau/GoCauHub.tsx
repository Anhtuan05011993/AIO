"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  getDemoUser,
  hasServerSession,
  useDemoUserSync as subscribeUserChanges,
} from "@/lib/store/auth";
import { FeatureGate } from "../gate/FeatureGate";
import fixture from "@/lib/ui-fixtures/go-cau-hub.json";
import "@/styles/custom/go-cau-reference.css";
import "@/styles/custom/go-cau-parity.css";
const parseLevel = (value: unknown) =>
  typeof value === "string"
    ? (value.match(/\b(A1|A2|B1|B2|C1)\b/i)?.[1].toUpperCase() ?? "A1")
    : "A1";
function Art({ html }: { html: string }) {
  return (
    <span
      className="gch-art-host"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
export default function GoCauHub() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [level, setLevel] = useState("A1");
  useEffect(() => {
    let alive = true,
      sequence = 0;
    const controller = new AbortController();
    const sync = async () => {
      const ticket = ++sequence;
      const user = getDemoUser();
      if (user) {
        setLevel(parseLevel(user.level));
        setAuthed(true);
        return;
      }
      let ok = await hasServerSession();
      if (!alive || ticket !== sequence) return;
      if (ok) {
        try {
          const response = await fetch("/api/auth/session", {
            cache: "no-store",
            signal: controller.signal,
          });
          if (response.ok) {
            const data = await response.json();
            ok = Boolean(data.user);
            if (alive && ticket === sequence)
              setLevel(parseLevel(data.user?.level));
          } else if (response.status === 401 || response.status === 403) {
            ok = false;
          }
        } catch {}
      }
      if (alive && ticket === sequence) setAuthed(ok);
    };
    void sync();
    const off = subscribeUserChanges(() => void sync());
    return () => {
      alive = false;
      controller.abort();
      off();
    };
  }, []);
  if (authed === null)
    return (
      <div className="ui-go-cau gch" role="status" aria-label="Đang tải Gõ câu">
        <div className="gch-loading-head" />
        <div className="gch-loading-path" />
        <span className="sr-only">Đang tải Gõ câu…</span>
      </div>
    );
  if (!authed)
    return (
      <FeatureGate
        feature={{
          key: "go-cau",
          name: "Gõ câu",
          chip: "30.519 câu",
          blurb: "Gõ lại câu mẫu, sai đâu sửa đấy",
        }}
      />
    );
  const cols = fixture.levels
    .map((l) => (l.level === level ? "minmax(0,1.75fr)" : "minmax(0,1fr)"))
    .join(" ");
  return (
    <div className="ui-go-cau nb-skin gch" data-nb-accent="xanhtroi">
      <div className="gch-wrap">
        <header
          className="nbc-hd nbx-f-go has-gains"
          data-nb-feature="go"
          data-nb-header
        >
          <Art html={fixture.decoration} />
          <div className="nbc-hd-row is-top">
            <div className="nbc-hd-head">
              <div className="nbc-hd-tt">
                <Art html={fixture.heroArt} />
                <h1>Học qua gõ câu.</h1>
              </div>
              <p className="nbc-sub">
                Nghe câu tiếng Anh thật rồi gõ lại từng từ. Sai chỗ nào, sửa
                ngay chỗ đó.
              </p>
            </div>
            <div className="nbc-hd-cta">
              <Link
                href={"/go-cau/lo-trinh-" + level.toLowerCase()}
                className="nbc-btn is-ink gch-cta"
              >
                Bắt đầu {level}
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>
          <div className="nbx-gains nbc-hd-gains">
            {fixture.gains.map((gain, i) => (
              <span
                key={i}
                className="nbx-gain"
                dangerouslySetInnerHTML={{ __html: gain }}
              />
            ))}
          </div>
        </header>
        <div className="gch-col">
          <section
            className="nbx-blk nbx-r-ivory nbx-grid gcpa"
            aria-labelledby="gc-path-title"
          >
            <i className="nbx-tape" aria-hidden="true" />
            <i className="nbx-tape nbx-k nbx-r" aria-hidden="true" />
            <div className="nbx-bh">
              <Art html={fixture.pathArt} />
              <div className="nbx-sp gcpa-tt">
                <h2 id="gc-path-title">Lộ trình đề xuất.</h2>
                <span className="nbx-bt">
                  5 bộ đi từ A1 tới C1, mỗi bộ xây trên bộ trước
                </span>
              </div>
            </div>
            <ol
              className="nbx-steps gcpa-lvls"
              style={{ "--gcpa-cols": cols } as CSSProperties}
            >
              {fixture.levels.map((l) => (
                <li
                  key={l.level}
                  className={
                    "nbx-lv nbx-lv-" +
                    l.level.toLowerCase() +
                    (l.level === level ? " nbx-next" : "")
                  }
                >
                  <Link
                    href={l.href}
                    className="nbx-card gcpa-lv"
                    aria-label={l.level + " · " + l.title}
                    aria-describedby={
                      "gc-description-" + l.level + " gc-count-" + l.level
                    }
                    aria-current={level === l.level ? "step" : undefined}
                  >
                    <span className="nbx-lvh">
                      <span className="nbx-stk nbx-lvk">
                        <b className="nbx-lvg nbx-face">{l.level}</b>
                        <i className="nbx-peel" aria-hidden="true" />
                      </span>
                      <span className="gcpa-art">
                        <Art html={l.art} />
                      </span>
                      {level === l.level && (
                        <span className="nbx-stk nbx-pill gcpa-pill">
                          <span className="nbx-chip nbx-mark nbx-face">
                            Gợi ý bắt đầu
                          </span>
                          <i className="nbx-peel" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <b className="nbx-lvn">{l.title}</b>
                    <span id={"gc-description-" + l.level} className="nbx-lvd">
                      {l.desc}
                    </span>
                    <span id={"gc-count-" + l.level} className="nbx-lvs">
                      <span className="nbx-num">{l.count}</span> câu
                    </span>
                    <span
                      className={
                        "gcpa-bot " +
                        (level === l.level ? "gcpa-go" : "nbx-lvp")
                      }
                    >
                      <span
                        className="nbx-bar nbx-hatch"
                        role="progressbar"
                        aria-label={l.level + ": Chưa bắt đầu"}
                        aria-valuenow={0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <i style={{ "--nb-x-p": "0%" } as CSSProperties} />
                      </span>
                      {level === l.level ? (
                        <span className="nbx-btn nbx-b-pri nbx-sm">
                          Bắt đầu <span aria-hidden="true">→</span>
                        </span>
                      ) : (
                        <small>Chưa bắt đầu</small>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
          <div
            className="nbx-g nbx-gc-sets gcs"
            aria-label="Thư viện bộ câu"
            role="region"
          >
            {fixture.groups.map((g, i) => (
              <section
                key={g.title}
                className={
                  "nbx-blk gcs-page " +
                  (i === 0
                    ? "nbx-r-ref nbx-ruled nbx-pile"
                    : "nbx-r-peach nbx-dots nbx-pile nbx-alt")
                }
                aria-labelledby={"gc-group-" + i}
              >
                {i === 1 && <i className="nbx-tape nbx-r" aria-hidden="true" />}
                <div className="nbx-bh">
                  <Art html={g.art} />
                  <h2 id={"gc-group-" + i}>{g.title}</h2>
                  <div className="nbx-act">
                    <span className="nbx-bt">
                      <b className="nbx-bign">{g.items.length}</b> bộ
                    </span>
                  </div>
                </div>
                <div className="nbx-sets">
                  {g.items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className="nbx-row gcsr"
                    >
                      <Art html={item.art} />
                      <span className="nbx-tt">
                        <b>{item.title}</b>
                        <small className="gcsr-rg">{item.count}</small>
                      </span>
                    </Link>
                  ))}
                </div>
                {i === 1 && (
                  <p className="nbx-pp nbx-mnote nbx-mnote-blk gch-shelf-note">
                    Chọn bộ gần với việc bạn đang làm nhất.
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
