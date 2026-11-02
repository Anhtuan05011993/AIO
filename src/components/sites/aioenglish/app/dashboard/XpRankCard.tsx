"use client";
import { useState } from "react";
import { MONTHLY_RANKING } from "@/lib/ui-fixtures/dashboard";
import DashboardArt, { CritterAvatar } from "./DashboardArt";
export default function XpRankCard() {
  const [friends, setFriends] = useState(false);
  return (
    <section
      className="nbx-blk nbx-r-heat nbx-grid nbx-pile rb"
      aria-labelledby="rank-h"
    >
      <i className="nbx-tape nbx-k" aria-hidden="true" />
      <div className="nbx-bh rb-head">
        <DashboardArt kind="rank" />
        <div className="nbx-sp rb-titles">
          <h2 id="rank-h">Xếp hạng XP tháng.</h2>
          <span className="nbx-bt rb-cd">Bảng xếp hạng tháng này</span>
        </div>
        <div className="nbx-act">
          <div
            className="nbx-seg rb-tabs"
            role="tablist"
            aria-label="Phạm vi bảng xếp hạng"
          >
            <button
              className={"rb-tab" + (!friends ? " nbx-on" : "")}
              role="tab"
              aria-selected={!friends}
              onClick={() => setFriends(false)}
            >
              Tất cả
            </button>
            <button
              className={"rb-tab" + (friends ? " nbx-on" : "")}
              role="tab"
              aria-selected={friends}
              onClick={() => setFriends(true)}
            >
              Bạn bè
            </button>
          </div>
        </div>
      </div>
      {friends ? (
        <div className="ui-empty">Chưa có bạn bè trong bảng xếp hạng.</div>
      ) : (
        <>
          <div className="rb-body">
            <ol className="rb-podium" aria-label="Top 3">
              {MONTHLY_RANKING.slice(0, 3).map((row, i) => (
                <li
                  className={"rb-seat rb-seat-" + i}
                  data-medal={i + 1}
                  key={row.name}
                >
                  <span className="rb-seat-who">
                    <span className="rb-crown-slot" aria-hidden="true">
                      {i === 0 && <span className="rb-crown">♛</span>}
                    </span>
                    <span className="rb-ring">
                      <CritterAvatar index={i} />
                    </span>
                    <b className="rb-seat-name">{row.name}</b>
                    <span className="rb-seat-val">
                      <b className="nbx-num nbx-xpb">{row.xp} XP</b>
                    </span>
                  </span>
                  <span className="rb-step">
                    <b className="nbx-num rb-step-n">{i + 1}</b>
                  </span>
                </li>
              ))}
            </ol>
            <div className="rb-scroll">
              <ol className="rb-list" aria-label="Hạng 4 đến 10">
                {MONTHLY_RANKING.slice(3).map((row, i) => (
                  <li className="nbx-row rb-row" key={row.name}>
                    <span className="nbx-rk nbx-num rb-rank">{i + 4}</span>
                    <span className="rb-av">
                      <CritterAvatar index={i} />
                    </span>
                    <span className="nbx-tt">
                      <b className="rb-name">{row.name}</b>
                      <small>Cấp {row.level}</small>
                    </span>
                    <span className="rb-val">
                      <b className="nbx-num nbx-xpb">{row.xp} XP</b>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="nbx-row nbx-on rb-self">
            <span className="nbx-rk nbx-num rb-rank">—</span>
            <span className="rb-av">
              <CritterAvatar index={-1} />
            </span>
            <span className="nbx-tt">
              <b>Bạn</b>
              <small>Cấp 1</small>
            </span>
            <b className="nbx-num">0 XP</b>
          </div>
        </>
      )}
    </section>
  );
}
