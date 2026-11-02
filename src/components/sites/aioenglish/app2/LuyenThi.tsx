"use client";
import NavArt from "../app/NavArt";
import { useState } from "react";
import ContentNotice from "../app/ContentNotice";
const tests = [
  {
    name: "Đề mẫu 01",
    status: "Đã làm",
    topics: "Science · Culture & the arts",
    detail: "Band 5.5",
    action: "Xem kết quả",
  },
  {
    name: "Đề mẫu 02",
    status: "Đang làm",
    topics: "Technology · Education",
    detail: "1/4 kỹ năng",
    action: "Làm tiếp",
  },
  {
    name: "Đề mẫu 03",
    status: "Đã luyện",
    topics: "Health · Nature & animals",
    detail: "Đã làm 4/12 phần",
    action: "Xem kết quả",
  },
  {
    name: "Đề mẫu 04",
    status: "Đã luyện",
    topics: "Daily life · Work & business",
    detail: "Đã làm 3/12 phần",
    action: "Xem kết quả",
  },
  {
    name: "Đề mẫu 05",
    status: "Đã luyện",
    topics: "Education · History",
    detail: "Đã làm 7/12 phần",
    action: "Xem kết quả",
  },
  {
    name: "Đề mẫu 06",
    status: "Chưa làm",
    topics: "Health · Environment",
    detail: "4 kỹ năng",
    action: "Bắt đầu",
  },
];
export default function LuyenThi() {
  const [filter, setFilter] = useState("Tất cả");
  return (
    <div className="ui-stack">
      <header className="ui-page-head" style={{ background: "#e7dbf0cc" }}>
        <div>
          <p className="ui-muted">IELTS Academic · Dữ liệu mẫu</p>
          <NavArt route="/luyen-thi" />
          <h1>Luyện thi IELTS.</h1>
        </div>
        <span className="ui-spacer" />
        <span className="nbx-chip">Mục tiêu 6.5</span>
        <ContentNotice>Làm tiếp Đề mẫu 02 →</ContentNotice>
      </header>
      <div className="ui-exam-bands">
        <section className="ui-sheet">
          <h2>Skill Bands.</h2>
          <div className="ui-skill-grid">
            {[
              ["Listening", "5.0"],
              ["Reading", "5.0"],
              ["Writing", "5.0 – 6.0"],
              ["Speaking", "5.5 – 6.5"],
            ].map(([skill, band]) => (
              <div key={skill}>
                <span>{skill}</span>
                <b>{band}</b>
                <small>Ước tính</small>
              </div>
            ))}
          </div>
        </section>
        <section className="ui-sheet" style={{ background: "#e8d9c7cc" }}>
          <h2>Cố lên nhé!</h2>
          <p>Học đều mỗi ngày để tiến gần hơn tới mục tiêu.</p>
          <ContentNotice>Hướng dẫn nhanh</ContentNotice>
        </section>
      </div>
      <section className="ui-sheet">
        <h2>Luyện kỹ năng.</h2>
        <div className="ui-skill-grid">
          {["Listening", "Reading", "Writing", "Speaking"].map((skill, i) => (
            <ContentNotice className="ui-skill-card" key={skill}>
              <span className="ui-exam-art" aria-hidden="true">
                {["♫", "Aa", "✎", "◌"][i]}
              </span>
              <b>{skill}</b>
              <small>
                {
                  [
                    "13/28 phần đã làm",
                    "7/21 bài đọc đã làm",
                    "5/14 bài đã viết",
                    "5/21 phần đã nói",
                  ][i]
                }
              </small>
            </ContentNotice>
          ))}
        </div>
      </section>
      <section className="ui-sheet">
        <div className="nbx-row-flex">
          <h2>Mock Tests.</h2>
          <span className="ui-spacer" />
          <span className="nbx-chip">Dữ liệu mẫu</span>
        </div>
        <div className="ui-tabs" role="tablist" aria-label="Lọc đề">
          {["Tất cả", "Chưa làm", "Đang làm", "Đã làm", "Đã luyện"].map((s) => (
            <button
              role="tab"
              aria-selected={filter === s}
              key={s}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ui-exam-grid">
          {tests
            .filter((t) => filter === "Tất cả" || t.status === filter)
            .map((test) => (
              <article
                className="ui-sheet"
                key={test.name}
                style={{ background: "#fbf7ed99" }}
              >
                <div className="nbx-row-flex">
                  <h3>{test.name}</h3>
                  <span className="ui-spacer" />
                  <span className="nbx-chip">{test.status}</span>
                </div>
                <p className="ui-muted">{test.topics}</p>
                <div className="ui-exam-skills">
                  {["Listening", "Reading", "Writing", "Speaking"].map((s) => (
                    <p key={s}>
                      <b>{s}</b>
                      <span>
                        {test.status === "Chưa làm" ? "Chưa làm" : test.detail}
                      </span>
                    </p>
                  ))}
                </div>
                <ContentNotice>{test.action}</ContentNotice>
              </article>
            ))}
        </div>
      </section>
      <section className="ui-sheet">
        <h2>Dạng câu còn yếu.</h2>
        <div className="ui-exam-grid">
          {[
            "Plan/map labelling",
            "Matching information",
            "Note completion",
          ].map((t, i) => (
            <ContentNotice className="ui-skill-card" key={t}>
              <b>{t}</b>
              <p>
                {i === 1 ? "Reading" : "Listening"} · {i === 2 ? "3/15" : "0/3"}{" "}
                câu đúng
              </p>
            </ContentNotice>
          ))}
        </div>
      </section>
    </div>
  );
}
