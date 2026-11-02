import type { CSSProperties } from "react";

export type RaccoonExpression = "chao" | "vui" | "tomo";

/* Coon mascot rig — extracted verbatim from the source SSR markup.
   Expression variants (ex-chao / ex-vui / ex-tomo) come from RaccoonMascot.css. */
export default function Raccoon({ expression }: { expression: RaccoonExpression }) {
  return (
    <div
      data-raccoon
      data-expression={expression}
      data-look="1"
      className={`ex-${expression} rk-wrap`}
      data-v-1593b0df
      data-v-702c373c
    >
      <div className="rig-move" data-v-702c373c>
        <div
          className="rk-stage"
          style={{ width: "380px", height: "437px", "--rk-s": "1.9px", "--rk-ox": "0px", "--rk-oy": "0px" } as CSSProperties}
          aria-hidden="true"
          data-v-702c373c
        >
        <span className="rk-l p-tail" data-v-702c373c="">
          <span className="rk-l a-tail" data-v-702c373c="">
            <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
              <path d="M126 186 C 160 191 180 166 173 130" fill="none" stroke="#201f1b" strokeWidth="31" strokeLinecap="round" data-v-702c373c=""></path>
              <path d="M126 186 C 160 191 180 166 173 130" fill="none" stroke="#9a9dab" strokeWidth="24" strokeLinecap="round" data-v-702c373c=""></path>
              <path d="M126 186 C 160 191 180 166 173 130" fill="none" stroke="#4b4f5e" strokeWidth="24" strokeDasharray="10 12" strokeDashoffset="-16" data-v-702c373c=""></path>
            </svg>
          </span>
        </span>
        <span className="rk-l p-body" data-v-702c373c="">
          <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
            <ellipse cx="100" cy="182" rx="50" ry="40" fill="#9a9dab" stroke="#201f1b" strokeWidth="3.5" data-v-702c373c=""></ellipse>
            <ellipse cx="100" cy="190" rx="30" ry="25" fill="#dcdee6" data-v-702c373c=""></ellipse>
            <path d="M76 150 L 83 163 L 91 156 L 100 168 L 109 156 L 117 163 L 124 150 Z" fill="#e8eaf0" data-v-702c373c=""></path>
          </svg>
          <span className="rk-l p-foot-l" data-v-702c373c="">
            <span className="rk-l a-foot-l" data-v-702c373c="">
              <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                <ellipse cx="76" cy="212" rx="16" ry="9.8" fill="#3d4159" stroke="#201f1b" strokeWidth="3.5" data-v-702c373c=""></ellipse>
                <path d="M65.6 208.2 Q 69.6 204.8 75.6 204.6" fill="none" stroke="#5b6080" strokeWidth="2.4" strokeLinecap="round" data-v-702c373c=""></path>
                <path d="M71 216.8 L 71.3 221 M81 216.8 L 80.7 221" stroke="#201f1b" strokeWidth="2.2" strokeLinecap="round" data-v-702c373c=""></path>
              </svg>
            </span>
          </span>
          <span className="rk-l p-foot-r" data-v-702c373c="">
            <span className="rk-l a-foot-r" data-v-702c373c="">
              <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                <ellipse cx="124" cy="212" rx="16" ry="9.8" fill="#3d4159" stroke="#201f1b" strokeWidth="3.5" data-v-702c373c=""></ellipse>
                <path d="M113.6 208.2 Q 117.6 204.8 123.6 204.6" fill="none" stroke="#5b6080" strokeWidth="2.4" strokeLinecap="round" data-v-702c373c=""></path>
                <path d="M119 216.8 L 119.3 221 M129 216.8 L 128.7 221" stroke="#201f1b" strokeWidth="2.2" strokeLinecap="round" data-v-702c373c=""></path>
              </svg>
            </span>
          </span>
        </span>
        <span className="rk-l p-head" data-v-702c373c="">
          <span className="rk-l p-look" data-v-702c373c="">
            <span className="rk-l a-head" data-v-702c373c="">
              <span className="rk-l p-ear-l" data-v-702c373c="">
                <span className="rk-l a-ear-l" data-v-702c373c="">
                  <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                    <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                      <path d="M30 90C20 62 22 34 36 26C48 20 70 34 90 52Z" fill="#9a9dab" stroke="#201f1b" strokeWidth="3.9" strokeLinejoin="round" data-v-702c373c=""></path>
                      <path d="M42 76C34 56 36 40 44 36C52 32 64 40 78 52Z" fill="#4b4f5e" data-v-702c373c=""></path>
                    </g>
                  </svg>
                </span>
              </span>
              <span className="rk-l p-ear-r" data-v-702c373c="">
                <span className="rk-l a-ear-r" data-v-702c373c="">
                  <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                    <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                      <path d="M170 90C180 62 178 34 164 26C152 20 130 34 110 52Z" fill="#9a9dab" stroke="#201f1b" strokeWidth="3.9" strokeLinejoin="round" data-v-702c373c=""></path>
                      <path d="M158 76C166 56 164 40 156 36C148 32 136 40 122 52Z" fill="#4b4f5e" data-v-702c373c=""></path>
                    </g>
                  </svg>
                </span>
              </span>
              <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                  <path d="M100 38C146 38 176 62 178 98L192 108L180 114L189 125L175 128C166 156 136 172 100 172C64 172 34 156 25 128L11 125L20 114L8 108L22 98C24 62 54 38 100 38Z" fill="#a3a6b4" stroke="#201f1b" strokeWidth="3.9" strokeLinejoin="round" data-v-702c373c=""></path>
                  <path d="M100 40C93 52 93 66 100 78C107 66 107 52 100 40Z" fill="#6b6f7e" data-v-702c373c=""></path>
                  <ellipse cx="66" cy="106" rx="32" ry="21" transform="rotate(-14 66 106)" fill="#3d4159" data-v-702c373c=""></ellipse>
                  <ellipse cx="134" cy="106" rx="32" ry="21" transform="rotate(14 134 106)" fill="#3d4159" data-v-702c373c=""></ellipse>
                  <ellipse cx="100" cy="137.5" rx="31" ry="24" fill="#f1f2f6" data-v-702c373c=""></ellipse>
                </g>
              </svg>
              <span className="rk-l eyes-open" data-v-702c373c="">
                <span className="rk-l look" data-v-702c373c="">
                  <span className="rk-l eye-l" data-v-702c373c="">
                    <span className="rk-l blink-e" data-v-702c373c="">
                      <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                        <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                          <circle cx="68" cy="106" r="12" fill="#141414" data-v-702c373c=""></circle>
                          <circle cx="72.5" cy="101" r="4.4" fill="#ffffff" data-v-702c373c=""></circle>
                          <circle cx="63.5" cy="110.5" r="1.9" fill="#ffffff" data-v-702c373c=""></circle>
                        </g>
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="rk-l look" data-v-702c373c="">
                  <span className="rk-l eye-r" data-v-702c373c="">
                    <span className="rk-l blink-e" data-v-702c373c="">
                      <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                        <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                          <circle cx="132" cy="106" r="12" fill="#141414" data-v-702c373c=""></circle>
                          <circle cx="136.5" cy="101" r="4.4" fill="#ffffff" data-v-702c373c=""></circle>
                          <circle cx="127.5" cy="110.5" r="1.9" fill="#ffffff" data-v-702c373c=""></circle>
                        </g>
                      </svg>
                    </span>
                  </span>
                </span>
              </span>
              <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                  <g className="eyes-happy" data-v-702c373c="">
                    <path d="M56 110Q68 94 80 110" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" data-v-702c373c=""></path>
                    <path d="M120 110Q132 94 144 110" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" data-v-702c373c=""></path>
                  </g>
                  <g className="eyes-closed" data-v-702c373c="">
                    <path d="M56 104Q68 115 80 104" fill="none" stroke="#ffffff" strokeWidth="4.6" strokeLinecap="round" data-v-702c373c=""></path>
                    <path d="M120 104Q132 115 144 104" fill="none" stroke="#ffffff" strokeWidth="4.6" strokeLinecap="round" data-v-702c373c=""></path>
                  </g>
                  <g className="eye-wink" data-v-702c373c="">
                    <path d="M120 110Q132 96 144 110" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" data-v-702c373c=""></path>
                  </g>
                  <g className="tear" data-v-702c373c="">
                    <path d="M60 117C56 126 55 132 59 135C63 138 68 134 66 128C65 124 63 120 60 117Z" fill="#8fd0f0" stroke="#201f1b" strokeWidth="2.2" strokeLinejoin="round" data-v-702c373c=""></path>
                  </g>
                  <g className="brow-l" data-v-702c373c="">
                    <ellipse cx="62" cy="78" rx="15" ry="5.5" transform="rotate(-12 62 78)" fill="#e3e5ec" data-v-702c373c=""></ellipse>
                  </g>
                  <g className="brow-r" data-v-702c373c="">
                    <ellipse cx="138" cy="78" rx="15" ry="5.5" transform="rotate(12 138 78)" fill="#e3e5ec" data-v-702c373c=""></ellipse>
                  </g>
                  <path d="M89.5 119C89.5 112.5 110.5 112.5 110.5 119C110.5 124.5 104 128 100 128C96 128 89.5 124.5 89.5 119Z" fill="#201f1b" data-v-702c373c=""></path>
                  <ellipse cx="95.5" cy="117" rx="3.4" ry="2" fill="#ffffff" fillOpacity="0.45" data-v-702c373c=""></ellipse>
                  <path d="M100 127.5V132" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" data-v-702c373c=""></path>
                  <g className="m-w" data-v-702c373c="">
                    <path d="M88 135Q94 138 100 132Q106 138 112 135C112 149 106 155 100 155C94 155 88 149 88 135Z" fill="#8c2f3c" data-v-702c373c=""></path>
                    <path d="M92 149Q100 141 108 149Q104 154.5 100 154.5Q96 154.5 92 149Z" fill="#f28a8a" data-v-702c373c=""></path>
                    <path d="M88 135C88 149 94 155 100 155C106 155 112 149 112 135" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" data-v-702c373c=""></path>
                    <path d="M84 132Q92 140 100 132Q108 140 116 132" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" data-v-702c373c=""></path>
                  </g>
                  <g className="m-open" data-v-702c373c="">
                    <path d="M84 133.9Q92 138.4 100 132Q108 138.4 116 133.9C116 151 108 158 100 158C92 158 84 151 84 133.9Z" fill="#8c2f3c" data-v-702c373c=""></path>
                    <path d="M90 152Q100 143 110 152Q105 157.6 100 157.6Q95 157.6 90 152Z" fill="#f28a8a" data-v-702c373c=""></path>
                    <path d="M84 133.9C84 151 92 158 100 158C108 158 116 151 116 133.9" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" data-v-702c373c=""></path>
                    <path d="M80 131Q90 140 100 132Q110 140 120 131" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" data-v-702c373c=""></path>
                  </g>
                  <g className="m-big" data-v-702c373c="">
                    <path d="M81 132.4Q90.5 138.8 100 131.5Q109.5 138.8 119 132.4C119 152 110 160 100 160C90 160 81 152 81 132.4Z" fill="#8c2f3c" data-v-702c373c=""></path>
                    <path d="M88.5 152.5Q100 141 111.5 152.5Q106 159.6 100 159.6Q94 159.6 88.5 152.5Z" fill="#f28a8a" data-v-702c373c=""></path>
                    <path d="M81 132.4C81 152 90 160 100 160C110 160 119 152 119 132.4" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" data-v-702c373c=""></path>
                    <path d="M78 130Q89 140 100 131.5Q111 140 122 130" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" data-v-702c373c=""></path>
                  </g>
                  <g className="m-o" data-v-702c373c="">
                    <ellipse cx="100" cy="142" rx="6.5" ry="8" fill="#8c2f3c" stroke="#201f1b" strokeWidth="3.3" data-v-702c373c=""></ellipse>
                  </g>
                  <g className="m-smirk" data-v-702c373c="">
                    <path d="M85 133Q92.5 140 100 133Q108 139 115 129" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" data-v-702c373c=""></path>
                  </g>
                  <g className="m-sad" data-v-702c373c="">
                    <path d="M90 144Q100 135 110 144" fill="none" stroke="#201f1b" strokeWidth="3.3" strokeLinecap="round" data-v-702c373c=""></path>
                  </g>
                  <g className="cheeks" data-v-702c373c="">
                    <ellipse cx="42" cy="136" rx="11" ry="6.5" fill="#f39a9a" data-v-702c373c=""></ellipse>
                    <ellipse cx="158" cy="136" rx="11" ry="6.5" fill="#f39a9a" data-v-702c373c=""></ellipse>
                  </g>
                </g>
              </svg>
              <span className="rk-l m-sleep" data-v-702c373c="">
                <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
                  <g transform="matrix(.9 0 0 .9 10 1.2)" data-v-702c373c="">
                    <ellipse cx="100" cy="141" rx="4" ry="3.4" fill="#8c2f3c" stroke="#201f1b" strokeWidth="2.4" data-v-702c373c=""></ellipse>
                  </g>
                </svg>
              </span>
            </span>
          </span>
        </span>
        <span className="rk-l p-arm-l" data-v-702c373c="">
          <span className="rk-l a-arm-l" data-v-702c373c="">
            <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
              <path d="M63 163 C 63 154.5 79 154.5 79 163 L 78.4 183 L 63.6 183 Z" fill="#6b6f7e" stroke="#201f1b" strokeWidth="3.5" strokeLinejoin="round" data-v-702c373c=""></path>
              <ellipse cx="71" cy="187.5" rx="11" ry="10" fill="#3d4159" stroke="#201f1b" strokeWidth="3.5" data-v-702c373c=""></ellipse>
              <path d="M64.6 183.6 Q 66.6 180.2 70.4 179.8" fill="none" stroke="#5b6080" strokeWidth="2.4" strokeLinecap="round" data-v-702c373c=""></path>
              <path d="M67.2 193.8 L 67.4 196.8 M74.8 193.8 L 74.6 196.8" stroke="#201f1b" strokeWidth="2.2" strokeLinecap="round" data-v-702c373c=""></path>
              <g className="pad" data-v-702c373c="">
                <ellipse cx="71" cy="186.4" rx="4.4" ry="3.4" fill="#8e93a8" data-v-702c373c=""></ellipse>
                <circle cx="64.4" cy="191.4" r="1.8" fill="#8e93a8" data-v-702c373c=""></circle>
                <circle cx="71" cy="193.6" r="1.7" fill="#8e93a8" data-v-702c373c=""></circle>
                <circle cx="77.6" cy="191.4" r="1.8" fill="#8e93a8" data-v-702c373c=""></circle>
              </g>
            </svg>
          </span>
        </span>
        <span className="rk-l p-arm-r" data-v-702c373c="">
          <span className="rk-l a-arm-r" data-v-702c373c="">
            <svg width="380" height="437" viewBox="0 0 200 230" aria-hidden="true" style={{ overflow: "visible" } as CSSProperties} data-v-702c373c="">
              <path d="M121 163 C 121 154.5 137 154.5 137 163 L 136.4 183 L 121.6 183 Z" fill="#6b6f7e" stroke="#201f1b" strokeWidth="3.5" strokeLinejoin="round" data-v-702c373c=""></path>
              <ellipse cx="129" cy="187.5" rx="11" ry="10" fill="#3d4159" stroke="#201f1b" strokeWidth="3.5" data-v-702c373c=""></ellipse>
              <path d="M122.6 183.6 Q 124.6 180.2 128.4 179.8" fill="none" stroke="#5b6080" strokeWidth="2.4" strokeLinecap="round" data-v-702c373c=""></path>
              <path d="M125.2 193.8 L 125.4 196.8 M132.8 193.8 L 132.6 196.8" stroke="#201f1b" strokeWidth="2.2" strokeLinecap="round" data-v-702c373c=""></path>
              <g className="pad" data-v-702c373c="">
                <ellipse cx="129" cy="186.4" rx="4.4" ry="3.4" fill="#8e93a8" data-v-702c373c=""></ellipse>
                <circle cx="122.4" cy="191.4" r="1.8" fill="#8e93a8" data-v-702c373c=""></circle>
                <circle cx="129" cy="193.6" r="1.7" fill="#8e93a8" data-v-702c373c=""></circle>
                <circle cx="135.6" cy="191.4" r="1.8" fill="#8e93a8" data-v-702c373c=""></circle>
              </g>
            </svg>
          </span>
        </span>
        </div>
      </div>
    </div>
  );
}
