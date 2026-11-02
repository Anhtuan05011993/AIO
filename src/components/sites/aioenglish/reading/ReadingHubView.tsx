"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import art from "@/lib/ui-fixtures/reading-art.json";
import UiDialog from "../app/UiDialog";
import ReadingCreateDialog from "./ReadingCreateDialog";
import "@/styles/custom/reading-reference.css";
import "@/styles/custom/reading-parity.css";
export default function ReadingHubView() {
  const [create, setCreate] = useState<"ai" | "paste" | "press" | null>(null);
  const [notice, setNotice] = useState(false);
  return (
    <>
      <div
        data-v-0f5d2610=""
        className="nb-skin nbx-hb nbx-dc ldh"
        data-testid="doc-dich-hub"
        data-nb-accent="bacha"
      >
        <div data-v-0f5d2610="" className="nbc-page nbx-main">
          <header
            data-v-0f5d2610=""
            className="nbc-hd nbx-f-read ldh-hd"
            data-nb-feature="read"
            data-nb-header=""
            data-bm="hdr"
          >
            <span
              className="nbx-hdeco"
              aria-hidden="true"
              data-nb-shapes="read"
              data-nb-skin-ok="shape angle (D9 board: the cut shapes keep their angle in both skins)"
            >
              <i
                className="nbx-a"
                style={
                  {
                    "--nb-x-m":
                      "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3Cpath%20d%3D'M16%2092V50a34%2034%200%200%201%2068%200v42Z'%2F%3E%3C%2Fsvg%3E\")",
                    "--nb-x-w": "190px",
                    "--nb-x-x": "320px",
                    "--nb-x-y": "-46px",
                    "--nb-x-r": "-6deg",
                  } as CSSProperties
                }
              ></i>
              <i
                className="nbx-b"
                style={
                  {
                    "--nb-x-m":
                      "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3Cpath%20d%3D'M50%202C54%2036%2064%2046%2098%2050C64%2054%2054%2064%2050%2098C46%2064%2036%2054%202%2050C36%2046%2046%2036%2050%202Z'%2F%3E%3C%2Fsvg%3E\")",
                    "--nb-x-w": "56px",
                    "--nb-x-x": "252px",
                    "--nb-x-y": "96px",
                    "--nb-x-r": "0deg",
                  } as CSSProperties
                }
              ></i>
              <i
                className="nbx-c"
                style={
                  {
                    "--nb-x-m":
                      "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3Cpath%20d%3D'M50%202C54%2036%2064%2046%2098%2050C64%2054%2054%2064%2050%2098C46%2064%2036%2054%202%2050C36%2046%2046%2036%2050%202Z'%2F%3E%3C%2Fsvg%3E\")",
                    "--nb-x-w": "30px",
                    "--nb-x-x": "560px",
                    "--nb-x-y": "18px",
                    "--nb-x-r": "12deg",
                  } as CSSProperties
                }
              ></i>
            </span>
            <div className="nbc-hd-row is-top">
              <div className="nbc-hd-head">
                <div className="nbc-hd-tt">
                  <span
                    className="ta-tile is-hd ta-plate nbx-r-goal nbc-hd-ic nbc-hd-art"
                    aria-hidden="true"
                  >
                    <svg
                      className="ta nbx-r-goal"
                      data-k="wordcards"
                      data-a1="do"
                      data-a2="info"
                      viewBox="0 0 120 90"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[0] }}
                    />
                  </span>
                  <h1>{"Luyện đọc & dịch."}</h1>
                  <div
                    className="nbc-hd-chips"
                    data-nb-clip-ok="chips that do not fit leave whole (wrap-hide)"
                  >
                    <span
                      data-v-0f5d2610=""
                      className="nbx-chip nbx-plain nbx-hide-s"
                      data-docdich-chip="count"
                    >
                      <span data-v-0f5d2610="" className="nbx-num">
                        {"266"}
                      </span>
                      {" bài · 12 chủ đề"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section
            data-v-48669618=""
            data-v-0f5d2610=""
            id="tung-cau"
            className="nbx-blk nbx-r-goal nbx-pile ths"
            aria-labelledby="doc-dich-sentence-h"
            data-bm="sentence"
            data-hub-block="sentence"
          >
            <i
              data-v-48669618=""
              className="nbx-tape nbx-k"
              aria-hidden="true"
            ></i>
            <div data-v-48669618="" className="nbx-bh">
              <span
                data-v-48669618=""
                className="ta-tile is-head ta-plate nbx-r-soc nbx-bh-art"
                aria-hidden="true"
              >
                <svg
                  className="ta nbx-r-soc"
                  data-k="chat"
                  data-a1="info"
                  data-a2="do"
                  viewBox="0 0 120 90"
                  aria-hidden="true"
                  focusable="false"
                  dangerouslySetInnerHTML={{ __html: art[1] }}
                />
              </span>
              <h2 data-v-48669618="" id="doc-dich-sentence-h">
                {"Luyện dịch từng câu."}
              </h2>
              <div data-v-48669618="" className="nbx-act">
                <span
                  data-v-48669618=""
                  className="nbx-chip nbx-lvl nbx-lv-a1"
                  data-testid="tc-hub-level"
                >
                  {"A1"}
                </span>
              </div>
            </div>
            <div data-v-48669618="" className="nbx-d-tc ths-two">
              <Link
                data-v-48669618=""
                href="/luyen-dich-thuat/tung-cau/ngau-nhien"
                className="nbx-card nbx-r-ivory ths-card"
                data-testid="tc-hub-random"
              >
                <span data-v-48669618="" className="ths-in">
                  <b data-v-48669618="" className="nbx-disp ths-t">
                    {"Dịch từng câu ngẫu nhiên"}
                  </b>
                  <p data-v-48669618="" className="ths-p">
                    {"Câu độc lập ở trình độ của bạn. Câu sai sẽ quay lại."}
                  </p>
                  <span data-v-48669618="" className="ths-foot">
                    <span
                      data-v-48669618=""
                      className="nbx-btn nbx-b-sec ths-go"
                    >
                      {"Bắt đầu"}
                      <svg
                        data-v-48669618=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[2] }}
                      />
                    </span>
                  </span>
                </span>
              </Link>
              <Link
                data-v-48669618=""
                href="/luyen-dich-thuat/tung-cau/theo-bai"
                className="nbx-card nbx-r-peach ths-card"
                data-testid="tc-hub-lessons"
              >
                <span data-v-48669618="" className="ths-in">
                  <b data-v-48669618="" className="nbx-disp ths-t">
                    {"Dịch từng câu theo bài"}
                  </b>
                  <p data-v-48669618="" className="ths-p">
                    {
                      "Dịch lần lượt từng câu của một bài, xong bài sang bài mới."
                    }
                  </p>
                  <span data-v-48669618="" className="ths-foot">
                    <span
                      data-v-48669618=""
                      className="nbx-btn nbx-b-sec ths-go"
                    >
                      {"Bắt đầu"}
                      <svg
                        data-v-48669618=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[3] }}
                      />
                    </span>
                  </span>
                </span>
              </Link>
            </div>
            <Link
              data-v-51f21734=""
              data-v-48669618=""
              href="/luyen-dich-thuat/chu-de"
              className="nbx-btn nbx-b-sec nbx-r-ivory tha ths-all"
              data-hub-all=""
              data-testid="tc-hub-all"
            >
              <svg
                data-v-51f21734=""
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-list-icon nbx-ic"
                aria-hidden="true"
                focusable="false"
                dangerouslySetInnerHTML={{ __html: art[4] }}
              />
              {"Tất cả bài"}
            </Link>
          </section>
          <div
            data-v-0f5d2610=""
            id="doan-van"
            className="nbx-g nbx-pair ldh-pair"
          >
            <section
              data-v-520d345b=""
              data-v-0f5d2610=""
              className="nbx-blk nbx-r-ivory nbx-dots thn"
              data-bm="pair-main"
              data-hub-block="intro"
              aria-labelledby="doc-dich-now-h"
              data-docdich-now="suggest"
            >
              <div data-v-520d345b="" className="nbx-bh">
                <span
                  data-v-520d345b=""
                  className="ta-tile is-head ta-plate nbx-r-info nbx-bh-art"
                  aria-hidden="true"
                >
                  <svg
                    className="ta nbx-r-info"
                    data-k="office"
                    data-a1="do"
                    data-a2="soc"
                    viewBox="0 0 120 90"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[5] }}
                  />
                </span>
                <h2 data-v-520d345b="" id="doc-dich-now-h">
                  {"Luyện dịch đoạn văn."}
                </h2>
              </div>
              <h3 data-v-520d345b="" className="nbx-sub thn-sub">
                {"Bài mới cho bạn"}
              </h3>
              <div data-v-520d345b="" className="nbx-art thn-art">
                <b data-v-520d345b="" className="nbx-disp thn-t" lang="en">
                  {"The Key and Breakfast"}
                </b>
                <span data-v-520d345b="" className="nbx-vi thn-vi">
                  {"Chiếc chìa khóa và bữa sáng"}
                </span>
                <p data-v-520d345b="" className="nbx-ex thn-ex" lang="en">
                  {
                    "In the afternoon, I arrived at a small hotel with my suitcase. I was very tired because the trip was long. The lobby was quiet, and a…"
                  }
                </p>
              </div>
              <div data-v-520d345b="" className="nbx-row-flex thn-foot">
                <span
                  data-v-520d345b=""
                  className="nbx-mut nbx-sm nbx-b nbx-ell thn-meta"
                  data-docdich-now-meta=""
                >
                  {"139 từ · Du lịch: đã dịch 0/28 bài"}
                </span>
                <span data-v-520d345b="" className="nbx-sp"></span>
                <button
                  data-v-520d345b=""
                  type="button"
                  className="nbx-btn nbx-b-pri"
                  data-nb-primary=""
                  data-testid="tx-now-go"
                  onClick={() => setNotice(true)}
                >
                  <svg
                    data-v-520d345b=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pen-line-icon nbx-ic"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[6] }}
                  />
                  {"Dịch bài này"}
                </button>
              </div>
              <Link
                data-v-51f21734=""
                data-v-520d345b=""
                href="/luyen-dich-thuat/chu-de"
                className="nbx-btn nbx-b-sec nbx-r-ivory tha thn-all"
                data-hub-all=""
                data-testid="tx-now-all"
              >
                <svg
                  data-v-51f21734=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-list-icon nbx-ic"
                  aria-hidden="true"
                  focusable="false"
                  dangerouslySetInnerHTML={{ __html: art[7] }}
                />
                {"Tất cả bài"}
              </Link>
            </section>
            <section
              data-v-e15862da=""
              data-v-0f5d2610=""
              className="nbx-blk nbx-r-ok nbx-ruled thg"
              data-bm="pair-side"
              data-hub-block="graded"
              aria-labelledby="doc-dich-graded-h"
              data-graded-state="empty"
            >
              <div data-v-e15862da="" className="nbx-bh">
                <span
                  data-v-e15862da=""
                  className="ta-tile is-head ta-plate nbx-r-heat nbx-bh-art"
                  aria-hidden="true"
                >
                  <svg
                    className="ta nbx-r-heat"
                    data-k="trophy"
                    data-a1="do"
                    data-a2="info"
                    viewBox="0 0 120 90"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[8] }}
                  />
                </span>
                <div data-v-e15862da="" className="nbx-sp thg-tt">
                  <h2 data-v-e15862da="" id="doc-dich-graded-h">
                    {"Bài đã chấm."}
                  </h2>
                  <span
                    data-v-e15862da=""
                    className="nbx-bt nbx-ell"
                    data-graded-count=""
                  >
                    {"Chưa có bài đã chấm"}
                  </span>
                </div>
              </div>
              <h3 data-v-e15862da="" className="nbx-sub">
                {"Tự tạo bài"}
              </h3>
              <div data-v-e15862da="" className="nbx-ladder">
                <button
                  data-v-e15862da=""
                  type="button"
                  className="nbx-row thg-row"
                  data-testid="tx-create-ai-hero"
                  onClick={() => setCreate("ai")}
                >
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-wand-sparkles-icon nbx-ic"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[9] }}
                  />
                  <span data-v-e15862da="" className="nbx-tt">
                    <b data-v-e15862da="">{"Tạo bài bằng AI"}</b>
                  </span>
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[10] }}
                  />
                </button>
                <button
                  data-v-e15862da=""
                  type="button"
                  className="nbx-row thg-row"
                  data-testid="tx-tool-press"
                  onClick={() => setCreate("press")}
                >
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-newspaper-icon nbx-ic"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[11] }}
                  />
                  <span data-v-e15862da="" className="nbx-tt">
                    <b data-v-e15862da="">{"Nhập bài báo"}</b>
                  </span>
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[12] }}
                  />
                </button>
                <button
                  data-v-e15862da=""
                  type="button"
                  className="nbx-row thg-row"
                  data-testid="tx-tool-paste"
                  onClick={() => setCreate("paste")}
                >
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy-icon nbx-ic"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[13] }}
                  />
                  <span data-v-e15862da="" className="nbx-tt">
                    <b data-v-e15862da="">{"Dán văn bản"}</b>
                  </span>
                  <svg
                    data-v-e15862da=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[14] }}
                  />
                </button>
              </div>
            </section>
          </div>
          <div
            data-v-0f5d2610=""
            className="ldh-press"
            data-testid="press-lane-slot"
          >
            <section
              data-v-d54688a6=""
              data-v-0f5d2610=""
              id="bao-song-ngu"
              className="nbx-blk nbx-r-ref nbx-ruled nbx-pile nbx-alt thp"
              aria-labelledby="bao-song-ngu-h"
              data-hub-block="press"
              data-testid="press-lane"
              data-bm="press"
            >
              <div data-v-d54688a6="" className="nbx-bh">
                <span
                  data-v-d54688a6=""
                  className="ta-tile is-head ta-plate nbx-r-goal nbx-bh-art"
                  aria-hidden="true"
                >
                  <svg
                    className="ta nbx-r-goal"
                    data-k="media"
                    data-a1="do"
                    data-a2="heat"
                    viewBox="0 0 120 90"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[15] }}
                  />
                </span>
                <h2 data-v-d54688a6="" id="bao-song-ngu-h">
                  {"Đọc & dịch báo song ngữ."}
                </h2>
                <div data-v-d54688a6="" className="nbx-act">
                  <button
                    data-v-d54688a6=""
                    type="button"
                    className="nbx-lnk thp-paste"
                    data-testid="press-import-open"
                    onClick={() => setCreate("press")}
                  >
                    <svg
                      data-v-d54688a6=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-link-icon nbx-ic"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[16] }}
                    />
                    {"Dán link bài báo "}
                  </button>
                </div>
              </div>
              <div data-v-d54688a6="" className="nbx-papers">
                <Link
                  data-v-d54688a6=""
                  href="/luyen-dich-thuat/bao/the-guardian"
                  className="nbx-card nbx-r-ivory nbx-paper"
                  data-paper="the-guardian"
                  data-testid="press-paper-card"
                >
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <b data-v-d54688a6="" className="nbx-disp nbx-ell">
                      {"The Guardian"}
                    </b>
                    <span data-v-d54688a6="" className="nbx-chip nbx-plain">
                      {"Báo Anh"}
                    </span>
                  </span>
                  <small data-v-d54688a6="">
                    {"Báo Anh, tin thế giới, khoa học, đời sống."}
                  </small>
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <span data-v-d54688a6="" className="nbx-mut nbx-sm nbx-b">
                      {"321 bài"}
                    </span>
                    <span data-v-d54688a6="" className="nbx-sp"></span>
                    <span data-v-d54688a6="" className="nbx-lnk nbx-sm">
                      {"Đọc tờ này"}
                      <svg
                        data-v-d54688a6=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[17] }}
                      />
                    </span>
                  </span>
                </Link>
                <Link
                  data-v-d54688a6=""
                  href="/luyen-dich-thuat/bao/the-conversation"
                  className="nbx-card nbx-r-ivory nbx-paper"
                  data-paper="the-conversation"
                  data-testid="press-paper-card"
                >
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <b data-v-d54688a6="" className="nbx-disp nbx-ell">
                      {"The Conversation"}
                    </b>
                    <span data-v-d54688a6="" className="nbx-chip nbx-plain">
                      {"Học thuật"}
                    </span>
                  </span>
                  <small data-v-d54688a6="">
                    {
                      "Học giả viết cho công chúng: khoa học, xã hội, công nghệ."
                    }
                  </small>
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <span data-v-d54688a6="" className="nbx-mut nbx-sm nbx-b">
                      {"317 bài"}
                    </span>
                    <span data-v-d54688a6="" className="nbx-sp"></span>
                    <span data-v-d54688a6="" className="nbx-lnk nbx-sm">
                      {"Đọc tờ này"}
                      <svg
                        data-v-d54688a6=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[18] }}
                      />
                    </span>
                  </span>
                </Link>
                <Link
                  data-v-d54688a6=""
                  href="/luyen-dich-thuat/bao/the-atlantic"
                  className="nbx-card nbx-r-ivory nbx-paper"
                  data-paper="the-atlantic"
                  data-testid="press-paper-card"
                >
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <b data-v-d54688a6="" className="nbx-disp nbx-ell">
                      {"The Atlantic"}
                    </b>
                    <span data-v-d54688a6="" className="nbx-chip nbx-plain">
                      {"Tạp chí"}
                    </span>
                  </span>
                  <small data-v-d54688a6="">
                    {
                      "Tạp chí Mỹ, bài luận dài về chính trị, văn hoá, kinh tế, ý tưởng."
                    }
                  </small>
                  <span data-v-d54688a6="" className="nbx-row-flex">
                    <span data-v-d54688a6="" className="nbx-mut nbx-sm nbx-b">
                      {"223 bài"}
                    </span>
                    <span data-v-d54688a6="" className="nbx-sp"></span>
                    <span data-v-d54688a6="" className="nbx-lnk nbx-sm">
                      {"Đọc tờ này"}
                      <svg
                        data-v-d54688a6=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[19] }}
                      />
                    </span>
                  </span>
                </Link>
              </div>
            </section>
          </div>
          <section
            data-v-0f5d2610=""
            id="bai-hoc-cua-toi"
            className="nbx-blk nbx-r-goal nbx-grid ldh-cat ldh-mine-blk"
            aria-labelledby="doc-dich-mine-h"
            data-hub-block="mine"
            data-bm="mine"
          >
            <div data-v-0f5d2610="" className="nbx-bh">
              <span
                data-v-0f5d2610=""
                className="ta-tile is-head ta-plate nbx-r-goal nbx-bh-art"
                aria-hidden="true"
              >
                <svg
                  className="ta nbx-r-goal"
                  data-k="mine"
                  data-a1="do"
                  data-a2="heat"
                  viewBox="0 0 120 90"
                  aria-hidden="true"
                  focusable="false"
                  dangerouslySetInnerHTML={{ __html: art[20] }}
                />
              </span>
              <h2 data-v-0f5d2610="" id="doc-dich-mine-h">
                {"Bài học của tôi."}
              </h2>
              <div data-v-0f5d2610="" className="nbx-act">
                <span
                  data-v-0f5d2610=""
                  className="nbx-bt"
                  data-testid="tx-mine-count"
                >
                  <span data-v-0f5d2610="" className="nbx-num">
                    {"0"}
                  </span>
                  {" bài đã tạo"}
                </span>
              </div>
            </div>
            <div data-v-0f5d2610="" className="ldh-mine">
              <div
                data-v-0f5d2610=""
                className="ldh-create"
                data-testid="tx-create-row"
              >
                <button
                  data-v-0f5d2610=""
                  type="button"
                  className="nbx-row ldh-cr"
                  data-testid="tx-create-press"
                  onClick={() => setCreate("press")}
                >
                  <span data-v-0f5d2610="" className="nbx-tile nbx-r-ref">
                    <svg
                      data-v-0f5d2610=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-newspaper-icon nbx-ic"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[21] }}
                    />
                  </span>
                  <span data-v-0f5d2610="" className="nbx-tt">
                    <b data-v-0f5d2610="">{"Tạo bài báo song ngữ"}</b>
                    <small data-v-0f5d2610="">
                      {"Từ link Guardian, Conversation, Atlantic"}
                    </small>
                  </span>
                  <svg
                    data-v-0f5d2610=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut ldh-cr-arr"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[22] }}
                  />
                </button>
                <button
                  data-v-0f5d2610=""
                  type="button"
                  className="nbx-row ldh-cr"
                  data-testid="tx-create-ai"
                  onClick={() => setCreate("ai")}
                >
                  <span data-v-0f5d2610="" className="nbx-tile nbx-r-goal">
                    <svg
                      data-v-0f5d2610=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-wand-sparkles-icon nbx-ic"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[23] }}
                    />
                  </span>
                  <span data-v-0f5d2610="" className="nbx-tt">
                    <b data-v-0f5d2610="">{"Tạo bài luyện dịch bằng AI"}</b>
                    <small data-v-0f5d2610="">
                      {"Mô tả ý tưởng, chọn trình độ, độ dài"}
                    </small>
                  </span>
                  <svg
                    data-v-0f5d2610=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut ldh-cr-arr"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[24] }}
                  />
                </button>
                <button
                  data-v-0f5d2610=""
                  type="button"
                  className="nbx-row ldh-cr"
                  data-testid="tx-create-paste"
                  onClick={() => setCreate("paste")}
                >
                  <span data-v-0f5d2610="" className="nbx-tile nbx-r-do">
                    <svg
                      data-v-0f5d2610=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy-icon nbx-ic"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[25] }}
                    />
                  </span>
                  <span data-v-0f5d2610="" className="nbx-tt">
                    <b data-v-0f5d2610="">{"Tạo bài luyện dịch tuỳ chọn"}</b>
                    <small data-v-0f5d2610="">
                      {"Dán văn bản có sẵn, máy dịch phía còn lại"}
                    </small>
                  </span>
                  <svg
                    data-v-0f5d2610=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-icon nbx-ic nbx-mut ldh-cr-arr"
                    aria-hidden="true"
                    focusable="false"
                    dangerouslySetInnerHTML={{ __html: art[26] }}
                  />
                </button>
              </div>
              <section data-v-0f5d2610="" className="ldh-sec">
                <h3 data-v-0f5d2610="" className="ldh-h">
                  {"Bài báo đã tạo"}
                </h3>
                <div
                  data-v-2ebe176e=""
                  data-v-0f5d2610=""
                  className="pml"
                  data-testid="press-mine"
                >
                  <div
                    data-v-5eaadc54=""
                    data-v-2ebe176e=""
                    data-filter-swap=""
                    className="min-w-0"
                  >
                    <div
                      data-v-86ebee26=""
                      data-v-2ebe176e=""
                      className="hnst"
                      data-hub-state="empty"
                    >
                      <span
                        data-v-86ebee26=""
                        className="ta-tile is-scene hnst-art"
                        aria-hidden="true"
                      >
                        <svg
                          className="ta nbx-r-ref"
                          data-k="search"
                          data-a1="info"
                          data-a2="do"
                          viewBox="0 0 120 90"
                          aria-hidden="true"
                          focusable="false"
                          dangerouslySetInnerHTML={{ __html: art[27] }}
                        />
                      </span>
                      <p data-v-86ebee26="" className="hnst-t">
                        {"Chưa có bài báo nào"}
                      </p>
                      <p data-v-86ebee26="" className="hnst-p">
                        {
                          "Dán link một bài ở The Guardian, The Conversation hay The Atlantic bằng nút Tạo bài báo song ngữ."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section data-v-0f5d2610="" className="ldh-sec">
                <h3 data-v-0f5d2610="" className="ldh-h">
                  {"Bài luyện dịch đã tạo"}
                </h3>
                <div
                  data-v-5eaadc54=""
                  data-v-0f5d2610=""
                  data-filter-swap=""
                  className="min-w-0"
                >
                  <div
                    data-v-86ebee26=""
                    data-v-0f5d2610=""
                    className="hnst"
                    data-hub-state="empty"
                  >
                    <span
                      data-v-86ebee26=""
                      className="ta-tile is-scene hnst-art"
                      aria-hidden="true"
                    >
                      <svg
                        className="ta nbx-r-goal"
                        data-k="mine"
                        data-a1="do"
                        data-a2="heat"
                        viewBox="0 0 120 90"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[28] }}
                      />
                    </span>
                    <p data-v-86ebee26="" className="hnst-t">
                      {"Chưa có bài nào"}
                    </p>
                    <p data-v-86ebee26="" className="hnst-p">
                      {"Tạo bài luyện dịch bằng AI hoặc dán văn bản ở trên."}
                    </p>
                  </div>
                </div>
              </section>
              <div
                data-v-b8593f49=""
                data-v-0f5d2610=""
                className="ml"
                data-testid="my-lessons"
              >
                <section
                  data-v-b8593f49=""
                  className="nbx-blk nbx-ruled ml-blk nbx-r-ivory"
                  aria-labelledby="ml-recent-h"
                  data-testid="my-recent"
                >
                  <div data-v-b8593f49="" className="nbx-bh">
                    <span data-v-b8593f49="" className="nbx-tile">
                      <svg
                        data-v-b8593f49=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-history-icon nbx-ic"
                        aria-hidden="true"
                        focusable="false"
                        dangerouslySetInnerHTML={{ __html: art[29] }}
                      />
                    </span>
                    <h3 data-v-b8593f49="" id="ml-recent-h">
                      {"Bài đã làm gần đây."}
                    </h3>
                  </div>
                  <p data-v-b8593f49="" className="ml-empty">
                    <svg
                      data-v-b8593f49=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-languages-icon"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: art[30] }}
                    />
                    <span data-v-b8593f49="">
                      {"Chưa làm bài nào. Chọn một bài ở trang "}
                      <Link
                        data-v-b8593f49=""
                        href="/luyen-dich-thuat/chu-de"
                        className="underline underline-offset-2"
                        data-testid="ml-all-lessons"
                      >
                        {"Tất cả bài"}
                      </Link>
                      {" để bắt đầu."}
                    </span>
                  </p>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
      {create && (
        <ReadingCreateDialog kind={create} onClose={() => setCreate(null)} />
      )}
      {notice && (
        <UiDialog title="Luyện dịch đoạn văn" onClose={() => setNotice(false)}>
          <p>Nội dung chưa được bổ sung.</p>
        </UiDialog>
      )}
    </>
  );
}
